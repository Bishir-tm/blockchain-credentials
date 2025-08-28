const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

class BlockchainService {
  constructor() {
    this.web3 = new Web3("http://localhost:8545");
    this.loadContract();
  }

  loadContract() {
    try {
      // Load contract ABI
      const contractPath = path.join(
        __dirname,
        "./artifacts/contracts/AcademicCredentials.sol/AcademicCredentials.json"
      );
      const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
      this.contractABI = contractJson.abi;

      // Load deployment info
      const deploymentPath = path.join(__dirname, "./deployment.json");
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
      console.error("Error loading contract:", error);
    }
  }

  async getAccounts() {
    return await this.web3.eth.getAccounts();
  }

  async issueCertificate(certificateData) {
    const accounts = await this.getAccounts();
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
    try {
      return await this.contract.methods.admin().call();
    } catch (error) {
      console.error("Error getting admin address:", error);
      return null;
    }
  }
}

module.exports = BlockchainService;
