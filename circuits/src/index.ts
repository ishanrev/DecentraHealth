// @ts-ignore

import builder from "../zk/circuits/SGD_js/witness_calculator.js";
import * as snarkjs from "snarkjs";
import fs from "fs"

class ZKPClient {
  private calculator: any ;
  private zkey: any;
  private proofName:string = "";

  get initialized() {
    return this.calculator !== undefined && this.zkey !== undefined;
  }

  async init(wasm: Buffer, zkey: Buffer, name:string) {
    if (this.initialized) return this;
    this.proofName = name;
    [this.zkey, this.calculator] = await Promise.all([zkey, builder(wasm)]);
  }

  async prove(signals: {
    learning_rate: string;
    prev_weight: string;
    new_weight:string;
    loss_gradient: string;
  }):Promise<snarkjs.Groth16Proof>{
    console.log(signals)
    const wtns = await this.calculator.calculateWTNSBin(signals, 0)
    const {proof} = await snarkjs.groth16.prove(this.zkey, wtns)

    return proof

  }

  async verifyProof(proof:snarkjs.Groth16Proof) {
    try {
      // Load the verification key from file
      const vKey = JSON.parse(fs.readFileSync(`zk/vkeys/${this.proofName}_vkey.json`, "utf-8"));
  
      // Load the proof and public signals from files
      
      const publicSignals = ["0"]
  
      // Perform the verification using snarkjs
      const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  
      // Output the result
      if (isValid) {
        console.log("Proof is correct");
      } else {
        console.log("Proof is invalid");
      }
      return isValid
    } catch (error) {
      console.error("Error during verification:", error);
    }
  }
}

export interface Proof {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
}

export {ZKPClient}