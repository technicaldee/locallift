const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to Celo Alfajores...");

  // Get the contract factories
  const BusinessRegistry = await hre.ethers.getContractFactory("BusinessRegistry");
  const InvestmentPool = await hre.ethers.getContractFactory("InvestmentPool");
  const EscrowManager = await hre.ethers.getContractFactory("EscrowManager");

  // Celo Alfajores cUSD token address
  const cUSDAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  
  // Deploy BusinessRegistry
  console.log("Deploying BusinessRegistry...");
  const businessRegistry = await BusinessRegistry.deploy();
  await businessRegistry.waitForDeployment();
  console.log("BusinessRegistry deployed to:", await businessRegistry.getAddress());

  // Deploy InvestmentPool
  console.log("Deploying InvestmentPool...");
  const [deployer] = await hre.ethers.getSigners();
  const investmentPool = await InvestmentPool.deploy(cUSDAddress, deployer.address);
  await investmentPool.waitForDeployment();
  console.log("InvestmentPool deployed to:", await investmentPool.getAddress());

  // Deploy EscrowManager
  console.log("Deploying EscrowManager...");
  const escrowManager = await EscrowManager.deploy(cUSDAddress);
  await escrowManager.waitForDeployment();
  console.log("EscrowManager deployed to:", await escrowManager.getAddress());

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    businessRegistry: await businessRegistry.getAddress(),
    investmentPool: await investmentPool.getAddress(),
    escrowManager: await escrowManager.getAddress(),
    cUSDToken: cUSDAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write to file
  const fs = require('fs');
  fs.writeFileSync(
    './deployment-addresses.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment addresses saved to deployment-addresses.json");
  console.log("\nUpdate your .env.local file with these addresses:");
  console.log(`NEXT_PUBLIC_BUSINESS_REGISTRY_ADDRESS=${await businessRegistry.getAddress()}`);
  console.log(`NEXT_PUBLIC_INVESTMENT_POOL_ADDRESS=${await investmentPool.getAddress()}`);
  console.log(`NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS=${await escrowManager.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });