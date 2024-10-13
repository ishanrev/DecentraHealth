"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
console.log(process.env.PRIVATE_KEY + "," + process.env.INFURA_PROJECT_ID);
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const config = {
    solidity: "0.8.27",
    networks: {
        hardhat: {},
        // goerli: {
        //   url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
        //   accounts: [PRIVATE_KEY],
        // },
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v6", // Adjust to match ethers v5
    },
};
exports.default = config;
