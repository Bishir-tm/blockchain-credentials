const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

class BlockchainService {
  constructor() {
    this.web3 = new Web3("http://localhost:8545");
    this.contract = null;
    this.contractABI = null;
    this.contractAddress = null;
    this.loadContract();
  }

  loadContract() {
    try {
      // Load contract ABI
      const contractPath = path.join(
        __dirname,
        "./artifacts/contracts/AcademicCredentials.sol/AcademicCredentials.json"
      );

      if (!fs.existsSync(contractPath)) {
        throw new Error(
          "Contract artifact not found. Please compile the contract first with: npx hardhat compile"
        );
      }

      const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
      this.contractABI = contractJson.abi;

      // Load deployment info
      const deploymentPath = path.join(__dirname, "./deployment.json");

      if (!fs.existsSync(deploymentPath)) {
        throw new Error(
          "Deployment file not found. Please deploy the contract first with: npx hardhat run scripts/deploy.js --network localhost"
        );
      }

      const deploymentInfo = JSON.parse(
        fs.readFileSync(deploymentPath, "utf8")
      );
      this.contractAddress = deploymentInfo.contractAddress;

      // Create contract instance
      this.contract = new this.web3.eth.Contract(
        this.contractABI,
        this.contractAddress
      );

      console.log("Contract loaded successfully at:", this.contractAddress);
    } catch (error) {
      console.error("Error loading contract:", error.message);
      console.log("Make sure to:");
      console.log("1. Start Hardhat node: npx hardhat node");
      console.log("2. Compile contracts: npx hardhat compile");
      console.log(
        "3. Deploy contract: npx hardhat run scripts/deploy.js --network localhost"
      );
    }
  }

  async getAccounts() {
    try {
      return await this.web3.eth.getAccounts();
    } catch (error) {
      console.error("Error getting accounts:", error);
      return [];
    }
  }

  async issueCertificate(certificateData) {
    if (!this.contract) {
      throw new Error("Contract not loaded. Please check deployment.");
    }

    const accounts = await this.getAccounts();
    if (accounts.length === 0) {
      throw new Error("No accounts available. Is Hardhat node running?");
    }

    const adminAccount = accounts[0];

    // Generate certificate hash
    const dataString = JSON.stringify(certificateData);
    const hash = this.web3.utils.keccak256(dataString);

    try {
      const tx = await this.contract.methods
        .issueCertificate(
          certificateData.certificateId,
          certificateData.studentId,
          certificateData.studentName,
          certificateData.degree,
          certificateData.graduationDate,
          certificateData.institution,
          hash
        )
        .send({
          from: adminAccount,
          gas: 3000000,
        });

      return {
        success: true,
        transactionHash: tx.transactionHash,
        certificateHash: hash,
        certificateId: certificateData.certificateId,
      };
    } catch (error) {
      console.error("Error issuing certificate:", error);
      return { success: false, error: error.message };
    }
  }

  async verifyCertificate(certificateId) {
    if (!this.contract) {
      throw new Error("Contract not loaded. Please check deployment.");
    }

    try {
      const result = await this.contract.methods
        .verifyCertificate(certificateId)
        .call();

      return {
        exists: result[0],
        studentName: result[1],
        degree: result[2],
        graduationDate: result[3],
        institution: result[4],
        issueTimestamp: result[5],
        certificateHash: result[6],
      };
    } catch (error) {
      console.error("Error verifying certificate:", error);
      return { exists: false, error: error.message };
    }
  }

  async getAdminAddress() {
    if (!this.contract) {
      throw new Error("Contract not loaded. Please check deployment.");
    }

    try {
      return await this.contract.methods.admin().call();
    } catch (error) {
      console.error("Error getting admin address:", error);
      throw error;
    }
  }
}

module.exports = BlockchainService;
