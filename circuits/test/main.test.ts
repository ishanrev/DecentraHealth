/* eslint-disable node/no-missing-import */
/* eslint-disable camelcase */
import { expect } from "chai";
import { BigNumber } from "ethers";
// eslint-disable-next-line node/no-extraneous-import
// import { ZKPClient, EdDSA } from "circuits";
import * as fs from "fs";
import * as path from "path";
import { ZKPClient } from "../src";

describe("testing SGD", () => {
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
  beforeEach(async () => {
    client = new ZKPClient();
    let sgdWasm = fs.readFileSync(
      path.resolve(__dirname, "../zk/circuits/SGD_js/SGD.wasm")
    );
    let sgdKey = fs.readFileSync(
      path.resolve(__dirname, "../zk/zkeys/SGD.zkey")
    );
    await client.init(sgdWasm, sgdKey, "SGD");
    console.log(client.initialized);
  });
  it("must conduct basic sgd techniques properly", async () => {
    let n = 0.0005;
    //This data replicates one epoch and therefore from the actual taraining history, a random epohc history must be selected
    
    
    if (!client.initialized) {throw("client not initialized properly")}
    let proof = await client.prove(preProcessWeights(data,0));
    expect(proof).not.to.eq(undefined);
    
    let isValid = await client.verifyProof(proof)
    expect(isValid).to.eq(true, "The ZKP proof was incorrect")
  }); 
  it("must identify false profs correctly as well", async () => {
    let n = 0.0005;
    //This data replicates one epoch and therefore from the actual taraining history, a random epohc history must be selected
    
    
    if (!client.initialized) {throw("client not initialized properly")}
    let proof = await client.prove(preProcessWeights(data,1));
    expect(proof).not.to.eq(undefined);
    
    let isValid = await client.verifyProof(proof)
    expect(isValid).to.eq(false, "The ZKP proof was incorrect")
  });

  const preProcessWeights = (data: any, layer:number) => {
    const randomLayerWeight = data.layers[layer].weights[0][0];
    const randomLayerGradient = data.layers[layer].gradients[0][0];
    const radnomLayerNewWeight = data.layers[layer].updated_weights[0][0]
    let witnessData = {
      learning_rate: (scale(data.learning_rate)).toString(),
      prev_weight:(scale(randomLayerWeight)).toString(),
      loss_gradient:(scale(randomLayerGradient)).toString(),
      new_weight:(scale(radnomLayerNewWeight)).toString(),
    };
    // console.log(witnessData)
    return witnessData
  };

  const scale = (num: number) => {
    let scale = 1000000
    return scale*num
  };
});
