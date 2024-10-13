// @ts-nocheck
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { ethers } from "hardhat";
// import ethers from "ethers"
import {
  ZkModel,
  SGDVerifier,
  SGDVerifier__factory,
  ZkModel__factory,
} from "../typechain";
import { ZKPClient } from "../../circuits/src/index";
import { BigNumberish } from "ethers";
import fs from "fs";
import path from "path";

const scale = (num: number) => {
  let scale = 1000000;
  return scale * num;
};

const toSolidityProof = (proof: snarkjs.Groth16Proof) => {
  return {
    a: [proof.pi_a[0], proof.pi_a[1]] as [BigNumberish, BigNumberish],
    b: [proof.pi_b[0].reverse(), proof.pi_b[1].reverse()] as [
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish]
    ],
    c: [proof.pi_c[0], proof.pi_c[1]] as [BigNumberish, BigNumberish],
  };
};

const preProcessWeights = (data: any, layer: number) => {
  const randomLayerWeight = data.layers[layer].weights[0][0];
  const randomLayerGradient = data.layers[layer].gradients[0][0];
  const radnomLayerNewWeight = data.layers[layer].updated_weights[0][0];
  let witnessData = {
    learning_rate: scale(data.learning_rate).toString(),
    prev_weight: scale(randomLayerWeight).toString(),
    loss_gradient: scale(randomLayerGradient).toString(),
    new_weight: scale(radnomLayerNewWeight).toString(),
  };
  // console.log(witnessData)
  return witnessData;
};

export const proofManagement = async () => {
  let verifier: SGDVerifier;
  let zkModel: ZkModel;
  let deployer;
  let client: ZKPClient;
  const data = {
    learning_rate: 0.001,
    layers: [
      {
        layer: 1,
        learning_rate: 0.001,
        weights: [
          [0.45, 0.35, -0.2, 0.15], // Initial weights of the first layer
        ],
        gradients: [
          [-0.05, 0.03, -0.01, 0.04], // Gradients for weight updates
        ],
        updated_weights: [
          [0.45005, 0.34997, -0.19999, 0.14996], // Correctly updated weights after applying gradients
        ],
      },
      {
        layer: 2,
        learning_rate: 0.001,
        weights: [
          [0.5, -0.1, 0.2], // Initial weights of the second layer
        ],
        gradients: [
          [-0.02, 0.01, -0.03], // Gradients for weight updates
        ],
        updated_weights: [
          [0.49998, -0.09999, 0.20005], // Incorrectly updated weights (should be [0.50002, -0.10001, 0.20003])
        ],
      },
      {
        layer: 3,
        learning_rate: 0.001,
        weights: [
          [0.6, -0.3], // Initial weights of the third layer
        ],
        gradients: [
          [-0.04, 0.02], // Gradients for weight updates
        ],
        updated_weights: [
          [0.60004, -0.30002], // Correctly updated weights after applying gradients
        ],
      },
    ],
  };

  [deployer] = await ethers.getSigners();
  console.log(deployer);
  verifier = await new SGDVerifier__factory(deployer).deploy();

  zkModel = await new ZkModel__factory(deployer).deploy(
    verifier.getAddress(),
    verifier.getAddress()
  );
  client = new ZKPClient();

  await client.init(
    fs.readFileSync(
      path.join(__dirname, "../../circuits/zk/circuits/SGD_js/SGD.wasm")
    ),
    fs.readFileSync(path.join(__dirname, "../../circuits/zk/zkeys/SGD.zkey")),
    "SGD"
  );

  if (!client.initialized) {
    throw "client not initialized properly";
  }
  let proof = await client.prove(preProcessWeights(data, 0));
  expect(proof).not.to.eq(undefined);

  let isValid = await client.verifyProof(proof);
  console.log(toSolidityProof(proof));

  return { isValid, proof: toSolidityProof(proof) };
};
