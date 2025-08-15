const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying DirectInvestment contract...");

  // Celo Alfajores testnet cUSD address
  const cUSDAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  
  // Deploy contract
  const DirectInvestment = await ethers.getContractFactory("DirectInvestment");
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get current gas price and add buffer
  const gasPrice = await ethers.provider.getFeeData();
  console.log("Current gas price:", gasPrice.gasPrice?.toString());

  const directInvestment = await DirectInvestment.deploy(
    cUSDAddress,
    deployer.address, // Fee recipient (can be changed later)
    {
      gasPrice: gasPrice.gasPrice ? gasPrice.gasPrice * 2n : ethers.parseUnits("2", "gwei"),
      gasLimit: 3000000
    }
  );

  await directInvestment.waitForDeployment();
  const contractAddress = await directInvestment.getAddress();

  console.log("DirectInvestment deployed to:", contractAddress);
  console.log("cUSD Token:", cUSDAddress);
  console.log("Fee Recipient:", deployer.address);

  // Verify deployment
  console.log("\nVerifying deployment...");
  const owner = await directInvestment.owner();
  const cusd = await directInvestment.cUSD();
  const feeRecipient = await directInvestment.feeRecipient();
  
  console.log("Contract Owner:", owner);
  console.log("cUSD Address:", cusd);
  console.log("Fee Recipient:", feeRecipient);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Add this to your .env file:");
  console.log(`NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });