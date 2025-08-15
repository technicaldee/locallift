require("dotenv").config();
const { ethers } = require("hardhat");
const DirectInvestmentABI = require("../src/contracts/abis/DirectInvestment.json");

async function main() {
  console.log("=== Starting business registration script ===");
  console.log("Registering sample businesses on blockchain...");

  const contractAddress = process.env.NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS;
  console.log("Contract address:", contractAddress);
  console.log("Network:", network.name);
  
  if (!contractAddress) {
    console.error("Please set NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS in .env");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const directInvestment = new ethers.Contract(
    contractAddress,
    DirectInvestmentABI.abi,
    deployer
  );

  // Sample businesses to register
  const businesses = [
    {
      id: "mama-janes-kitchen",
      wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A",
      goalAmount: ethers.parseEther("5000") // 5000 cUSD
    },
    {
      id: "tech-repair-shop",
      wallet: "0x8ba1f109551bD432803012645Hac136c30C67560",
      goalAmount: ethers.parseEther("3000") // 3000 cUSD
    },
    {
      id: "green-grocery",
      wallet: "0x9C8ff314C9Bc7F6e59A9d9225Fb22946427eDC03",
      goalAmount: ethers.parseEther("7500") // 7500 cUSD
    },
    {
      id: "local-bakery",
      wallet: "0x1234567890123456789012345678901234567890",
      goalAmount: ethers.parseEther("2500") // 2500 cUSD
    },
    {
      id: "fitness-studio",
      wallet: "0x0987654321098765432109876543210987654321",
      goalAmount: ethers.parseEther("10000") // 10000 cUSD
    }
  ];

  for (const business of businesses) {
    try {
      console.log(`\nRegistering ${business.id}...`);
      
      // Check if business is already registered
      try {
        const existingBusiness = await directInvestment.getBusiness(business.id);
        if (existingBusiness.isActive) {
          console.log(`Business ${business.id} already registered and active`);
          continue;
        }
      } catch (error) {
        // Business doesn't exist, continue with registration
      }

      const tx = await directInvestment.registerBusiness(
        business.id,
        business.wallet,
        business.goalAmount,
        {
          gasLimit: 500000
        }
      );

      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ Successfully registered ${business.id}`);
      
    } catch (error) {
      console.error(`❌ Failed to register ${business.id}:`, error.message);
    }
  }

  console.log("\n=== Registration Complete ===");
  console.log("Businesses have been registered on the blockchain!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });