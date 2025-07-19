const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvestmentPool", function () {
  let InvestmentPool;
  let investmentPool;
  let MockERC20;
  let mockToken;
  let owner;
  let business;
  let investor;
  let feeRecipient;

  beforeEach(async function () {
    [owner, business, investor, feeRecipient] = await ethers.getSigners();

    // Deploy mock cUSD token
    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Celo Dollar", "cUSD", 18);
    await mockToken.deployed();

    // Deploy InvestmentPool
    InvestmentPool = await ethers.getContractFactory("InvestmentPool");
    investmentPool = await InvestmentPool.deploy(mockToken.address, feeRecipient.address);
    await investmentPool.deployed();

    // Mint tokens to investor
    await mockToken.mint(investor.address, ethers.utils.parseEther("1000"));
    
    // Approve investment pool to spend investor's tokens
    await mockToken.connect(investor).approve(investmentPool.address, ethers.utils.parseEther("1000"));
  });

  describe("Pool Creation", function () {
    it("Should create a new investment pool", async function () {
      const targetAmount = ethers.utils.parseEther("100");
      const duration = 12; // 12 months
      const interestRate = 10; // 10%
      const businessId = "business_123";
      const purpose = "Equipment purchase";

      await investmentPool.connect(business).createPool(
        targetAmount,
        duration,
        interestRate,
        businessId,
        purpose
      );

      const pool = await investmentPool.getPool(1);
      expect(pool.businessOwner).to.equal(business.address);
      expect(pool.targetAmount).to.equal(targetAmount);
      expect(pool.duration).to.equal(duration);
      expect(pool.interestRate).to.equal(interestRate);
      expect(pool.businessId).to.equal(businessId);
      expect(pool.purpose).to.equal(purpose);
    });

    it("Should emit PoolCreated event", async function () {
      const targetAmount = ethers.utils.parseEther("100");
      const duration = 12;
      const interestRate = 10;
      const businessId = "business_123";
      const purpose = "Equipment purchase";

      await expect(
        investmentPool.connect(business).createPool(
          targetAmount,
          duration,
          interestRate,
          businessId,
          purpose
        )
      ).to.emit(investmentPool, "PoolCreated")
       .withArgs(1, business.address, targetAmount, duration, businessId);
    });
  });

  describe("Investment", function () {
    beforeEach(async function () {
      // Create a pool first
      await investmentPool.connect(business).createPool(
        ethers.utils.parseEther("100"),
        12,
        10,
        "business_123",
        "Equipment purchase"
      );
    });

    it("Should allow investment in active pool", async function () {
      const investmentAmount = ethers.utils.parseEther("50");
      
      await investmentPool.connect(investor).invest(1, investmentAmount);
      
      const pool = await investmentPool.getPool(1);
      expect(pool.currentAmount).to.equal(investmentAmount);
    });

    it("Should emit InvestmentMade event", async function () {
      const investmentAmount = ethers.utils.parseEther("50");
      
      await expect(
        investmentPool.connect(investor).invest(1, investmentAmount)
      ).to.emit(investmentPool, "InvestmentMade")
       .withArgs(1, investor.address, investmentAmount);
    });

    it("Should track investor's investment", async function () {
      const investmentAmount = ethers.utils.parseEther("50");
      
      await investmentPool.connect(investor).invest(1, investmentAmount);
      
      const investments = await investmentPool.getPoolInvestments(1);
      expect(investments.length).to.equal(1);
      expect(investments[0].investor).to.equal(investor.address);
      expect(investments[0].amount).to.equal(investmentAmount);
    });
  });
});

// Mock ERC20 contract for testing
const MockERC20Source = `
pragma solidity ^0.8.19;

contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}
`;