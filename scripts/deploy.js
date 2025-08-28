const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );

  // Deploy the contract
  console.log("Deploying AcademicCredentials contract...");

  const AcademicCredentials = await ethers.getContractFactory(
    "AcademicCredentials"
  );
  const contract = await AcademicCredentials.deploy();

  // Wait for deployment to complete
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("AcademicCredentials deployed to:", address);

  // Verify the admin address was set correctly
  const admin = await contract.admin();
  console.log("Contract admin address:", admin);
  console.log("Deployer address:", deployer.address);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: address,
    adminAddress: admin,
    deployerAddress: deployer.address,
    deployedAt: new Date().toISOString(),
    network: "localhost",
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment.json");
  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
