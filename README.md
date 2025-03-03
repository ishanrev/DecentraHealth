# DecentraHealth

A **decentralized federated learning system** leveraging **Zero-Knowledge Proofs (zk-SNARKs)** and **CKKS encryption** to enable hospitals to train AI models collaboratively while preserving data privacy and ensuring integrity.

## 🌍 Problem Statement
Hospitals often face challenges in balancing **data privacy** with the **need for collaborative AI research**. Strict **privacy regulations (e.g., HIPAA)** prevent direct data sharing, making it difficult to leverage collective intelligence for improved AI models. However, standard federated learning approaches pose risks:
- **Weight updates may leak patient data**, allowing sensitive information to be reconstructed.
- **Malicious actors may submit falsified or corrupted training results**, compromising model integrity.

## 🔐 Solution
DecentraHealth integrates **federated learning** with **blockchain-based verification** and **secure encryption**:
- **Federated Learning:** Hospitals train AI models locally and only share model weights.
- **Zero-Knowledge Proofs (zk-SNARKs):** Ensure training integrity without exposing data.
- **CKKS Encryption:** Encrypts model weights, enabling secure aggregation without compromising sensitive information.
- **Smart Contracts:** Verifies training results on **Ethereum** (Sepolia testnet) for tamper-proof auditing.
- **Secure Multi-Party Computation (MPC):** Aggregates encrypted weights to update a **global AI model** securely.

---

# 🚀 Technical Deep Dive

## System Architecture

DecentraHealth follows a **microservice-based architecture** to streamline federated learning while ensuring security and transparency:

### 1️⃣ **Initialization** (Global Model Setup)
- A **global model** is prepared and **containerized using Docker**.
- The model is **distributed** to participating hospitals via a secured pipeline.

### 2️⃣ **Local Model Training**
- Each hospital trains the **CNN model locally** using its patient data.
- No raw data is shared outside the institution.
- Model updates (weights) are **encrypted using CKKS homomorphic encryption**.

### 3️⃣ **Zero-Knowledge Proof Generation**
Each hospital generates a **zk-SNARK proof** verifying the training was performed correctly. The proof includes:
- **Model architecture verification**
- **Loss function validation**
- **Optimizer & Learning rate confirmation**
- **Training epochs verification**

ZKPs are generated using **Circom** and **Snark.js**, ensuring that weights are computed correctly without revealing patient data.

### 4️⃣ **Verification via Smart Contracts**
- Hospitals submit **zk-SNARK proofs** to an **Ethereum smart contract (Sepolia testnet)**.
- The smart contract **validates the proofs**, ensuring correctness and preventing fraudulent submissions.

### 5️⃣ **Secure Weight Aggregation**
- Encrypted weights are transferred to an **AWS EC2 instance running MPyC** (Multi-Party Computation framework).
- Secure averaging of encrypted weights is performed **without decryption**.
- The final averaged encrypted weights are **decrypted using an MPC protocol**, preventing data leaks.

### 6️⃣ **Global Model Update**
- The decrypted **averaged weights** update the **global model**.
- Updated model is sent **back to all hospitals** for improved performance.
- The process repeats for continued learning.

---

# 🛠️ Tech Stack
| Component | Technology |
|-----------|------------|
| **Federated Learning** | PyTorch |
| **Zero-Knowledge Proofs** | Circom, Snark.js |
| **Blockchain** | Ethereum (Sepolia), Solidity |
| **Encryption** | CKKS Homomorphic Encryption |
| **Secure Computation** | MPyC (Multi-Party Computation) |
| **Cloud Infrastructure** | AWS EC2 |
| **Backend** | Django, Flask |
| **Frontend** | React, JavaScript |
| **Containerization** | Docker |

---

# 🎯 Benefits & Advantages
✅ **Data Privacy:** No raw data ever leaves hospital premises.  
✅ **Security:** Advanced encryption ensures secure data handling.  
✅ **Tamper-proof Verification:** zk-SNARKs guarantee honest training submissions.  
✅ **Scalability:** Easily add more hospitals to the network.  
✅ **Trust & Transparency:** Blockchain-based validation enhances system integrity.  
✅ **Improved AI Performance:** Collaborative model training enhances accuracy.  

---

# 📺 Demo & Resources
- **GitHub Repo:** [DecentraBio](https://github.com/Ayush971107/DecentraBio)
- **Demo Video:** [YouTube](https://www.youtube.com/watch?v=Qf26E1MJCt8)

For any questions or contributions, feel free to open an issue or submit a pull request!

💡 **Join us in revolutionizing AI research with privacy-preserving federated learning!** 🚀

