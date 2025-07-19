const hre = require("hardhat");

async function main() {
  console.log("Testing contract compilation and deployment setup...");

  try {
    // Get the contract factories to verify they compile correctly
    console.log("✓ Getting BusinessRegistry contract factory...");
    const BusinessRegistry = await hre.ethers.getContractFactory("BusinessRegistry");
    
    console.log("✓ Getting InvestmentPool contract factory...");
    const InvestmentPool = await hre.ethers.getContractFactory("InvestmentPool");
    
    console.log("✓ Getting EscrowManager contract factory...");
    const EscrowManager = await hre.ethers.getContractFactory("EscrowManager");
    
    console.log("✓ Getting MockERC20 contract factory...");
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");

    console.log("\n🎉 All contracts compiled successfully!");
    
    // Show deployment parameters that would be used
    const cUSDAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
    
    console.log("\n📋 Deployment Configuration:");
    console.log("Network:", hre.network.name);
    console.log("cUSD Token Address:", cUSDAddress);
    
    // Check if we have a signer (private key)
    try {
      const [deployer] = await hre.ethers.getSigners();
      console.log("Deployer Address:", deployer.address);
      console.log("✓ Private key configured");
    } catch (error) {
      console.log("⚠️  No private key configured - deployment will fail");
      console.log("   Add your private key to .env.local to enable deployment");
    }
    
    console.log("\n📝 Next Steps:");
    console.log("1. Add your private key to .env.local");
    console.log("2. Get Alfajores testnet tokens from https://faucet.celo.org/");
    console.log("3. Run 'yarn deploy' to deploy to testnet");
    
  } catch (error) {
    console.error("❌ Error during compilation test:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n✅ Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });