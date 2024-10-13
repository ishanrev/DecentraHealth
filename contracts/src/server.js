"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./index");
const app = (0, express_1.default)();
const port = 3000; // You can change the port number if needed
app.get('/trigger', async (req, res) => {
    await (0, index_1.proofManagement)(); // Call the function from the other file
    res.send('Proof has been sent for verification');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
