const hre = require("hardhat");

async function main() {
  // Load deployment addresses
  const fs = require('fs');
  let deploymentInfo;
  
  try {
    deploymentInfo = JSON.parse(fs.readFileSync('./deployment-addresses.json', 'utf8'));
  } catch (error) {
    console.error("Could not read deployment-addresses.json. Please deploy contracts first.");
    process.exit(1);
  }

  console.log("Verifying contracts on Celoscan...");

  const cUSDAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

  try {
    // Verify BusinessRegistry
    console.log("Verifying BusinessRegistry...");
    await hre.run("verify:verify", {
      address: deploymentInfo.businessRegistry,
      constructorArguments: [],
    });
    console.log("BusinessRegistry verified!");
  } catch (error) {
    console.log("BusinessRegistry verification failed:", error.message);
  }

  try {
    // Verify InvestmentPool
    console.log("Verifying InvestmentPool...");
    await hre.run("verify:verify", {
      address: deploymentInfo.investmentPool,
      constructorArguments: [cUSDAddress, deploymentInfo.deployer],
    });
    console.log("InvestmentPool verified!");
  } catch (error) {
    console.log("InvestmentPool verification failed:", error.message);
  }

  try {
    // Verify EscrowManager
    console.log("Verifying EscrowManager...");
    await hre.run("verify:verify", {
      address: deploymentInfo.escrowManager,
      constructorArguments: [cUSDAddress],
    });
    console.log("EscrowManager verified!");
  } catch (error) {
    console.log("EscrowManager verification failed:", error.message);
  }

  console.log("\nVerification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });