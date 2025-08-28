const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AcademicCredentials contract...");

  const AcademicCredentials = await ethers.getContractFactory(
    "AcademicCredentials"
  );
  const contract = await AcademicCredentials.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("AcademicCredentials deployed to:", address);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress: address,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
