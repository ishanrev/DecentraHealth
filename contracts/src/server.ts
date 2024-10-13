import express from "express";
import { proofManagement } from "./index";
const app = express();
const port = 3000; // You can change the port number if needed
const cors = require("cors");

async function main() {
  app.use(cors());
  app.get("/trigger", async (req, res) => {
    let proof = await proofManagement(); // Call the function from the other file
    
    res.json(proof);
  });
  app.get("/aggregation", async (req, res) => {
    // await proofManagement(); // Call the function from the other file
    res.send({ data: "Proof has been sent for verification" });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}


main().catch((error) => {
  console.error(error);
  process.exit(1);
});