"use strict";
// @ts-ignore
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZKPClient = void 0;
const witness_calculator_js_1 = __importDefault(require("../zk/circuits/SGD_js/witness_calculator.js"));
const snarkjs = __importStar(require("snarkjs"));
const fs_1 = __importDefault(require("fs"));
class ZKPClient {
    constructor() {
        this.proofName = "";
    }
    get initialized() {
        return this.calculator !== undefined && this.zkey !== undefined;
    }
    async init(wasm, zkey, name) {
        if (this.initialized)
            return this;
        this.proofName = name;
        [this.zkey, this.calculator] = await Promise.all([zkey, (0, witness_calculator_js_1.default)(wasm)]);
    }
    async prove(signals) {
        console.log(signals);
        const wtns = await this.calculator.calculateWTNSBin(signals, 0);
        const { proof } = await snarkjs.groth16.prove(this.zkey, wtns);
        return proof;
    }
    async verifyProof(proof) {
        try {
            // Load the verification key from file
            const vKey = JSON.parse(fs_1.default.readFileSync(`zk/vkeys/${this.proofName}_vkey.json`, "utf-8"));
            // Load the proof and public signals from files
            const publicSignals = ["0"];
            // Perform the verification using snarkjs
            const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
            // Output the result
            if (isValid) {
                console.log("Proof is correct");
            }
            else {
                console.log("Proof is invalid");
            }
            return isValid;
        }
        catch (error) {
            console.error("Error during verification:", error);
        }
    }
}
exports.ZKPClient = ZKPClient;
