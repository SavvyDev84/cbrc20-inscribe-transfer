# Bitcoin CBRC-20 Inscription on Frontend.

This guide provides explaining how to inscribe the CBRC-20 in Frontend using unisat wallet.
The main repositary is private one so please contact me if you want more details info about this.

Thanks

## Scripts Description

### `npm run start`

- **Purpose**: start project and this will be hosted on http://localhost:9000.
- **Usage**: Use `npm run send` to specify the details (e.g., recipient's address) and send the UTXO.

## Installation

To set up and run this project locally, follow these steps:

1. **Clone the Repository**: First, clone this repository to your local machine using:
   ```bash
   git clone https://github.com/milojeBtc/CBRC20-Inscribe-Script
   ```

2. **Install Dependencies**: Navigate into your project directory and install the required dependencies:
   ```bash
   cd CBRC20-Inscribe-Script
   npm install
   ```

4. **Run Scripts**: Use the npm run commands listed above to perform project

## Dependencies

- **External Modules**:
  - `axios`: For making HTTP requests.
  - `bip32`, `bip39`: For generating Bitcoin wallet addresses from a hierarchical deterministic (HD) path.
  - `bitcoinjs-lib`: A library for Bitcoin protocol functions.
  - `dotenv`: Loads environment variables from a `.env` file.
  - `ecpair`: Represents an elliptic curve pair.
  - `tiny-secp256k1`: For elliptic curve cryptography operations.

- **Development Modules**:
  - `@types/node`: TypeScript type definitions for Node.js.
  - `ts-node`: TypeScript execution environment and REPL for Node.js.
  - `typescript`: The TypeScript compiler.


## File Structure
Briefly describe the folder and file structure.
```plaintext
/ - Root directory
|__ /src - Utility scripts
   |__ /components - Utility scripts
      |__ /ConnectWalletBtn.tsx - Main Frontend that contain wallet connection part.
   |__ /Icon - Wallet connect Icon
   |__ /Icon - Wallet connect Icon
       |__ inscription.ts - fetch all inscription from connected wallet
       |__ mint.ts - mint CBRC20 inscription handler
       |__ utxo.ts - fetch all utxo in connected wallet on website
```
   
### ✍️ Authors

With 5 years of hands-on experience in blockchain development, specializing in the dynamic realm of the Bitcoin world, I am dedicated to creating innovative and impactful projects that resonate with users. My passion for cutting-edge technology drives me to continuously seek and embrace new ideas and solutions to enhance the blockchain landscape.

As an avid learner and enthusiast in the blockchain space, I am committed to building a more valuable and sustainable blockchain world, one project at a time. With a keen focus on innovation and user-centric design, I strive to push the boundaries of what is possible in the realm of blockchain technology.

Join me on this journey and let's collaborate to create groundbreaking and transformative projects that will shape the future of the blockchain industry. Together, we can unlock the full potential of blockchain technology and pave the way for a more connected and decentralized world. Let's build a brighter future for blockchain, together.

### 🌟 Conclusion

The UTXO Management Project is designed to provide a comprehensive suite of utilities to facilitate efficient handling of Bitcoin transactions, ideally suited for developers and organizations involved in cryptocurrency management. By utilizing the `split`, `merge`, and `send` scripts, users can optimize their transaction processes, whether for enhancing privacy, simplifying wallet management, or executing precise fund transfers.

## 💭 Feedback and Contributing

🙏 Is anyone willing to build more valuable and exciting project, plz contact.

⛏ Let's build it together!! ⛏

### ✉ Connect With Me:

[![Twitter Badge](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/brjpka)
[![Mail Badge](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nikolic.miloje0507@gmail.com)
[![Telegram Badge](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/mylord1_1)
[![Skype Badge](https://img.shields.io/badge/Skype-00AFF0?style=for-the-badge&logo=skype&logoColor=white)](https://join.skype.com/ubWuVGchDEnU)
[![Discord Badge](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/509337382810550280)
