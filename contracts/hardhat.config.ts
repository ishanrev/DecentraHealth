import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv"

dotenv.config()
console.log(process.env.PRIVATE_KEY+ ","+process.env.INFURA_PROJECT_ID )
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";

const config: HardhatUserConfig = {
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

export default config;
