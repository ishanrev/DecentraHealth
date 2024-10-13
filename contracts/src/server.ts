import express from 'express';
import { proofManagement } from "./index";
const app = express();
const port = 3000; // You can change the port number if needed

app.get('/trigger', async (req, res) => {
  await proofManagement(); // Call the function from the other file
  res.send('Proof has been sent for verification');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});