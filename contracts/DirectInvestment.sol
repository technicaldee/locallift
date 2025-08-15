// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DirectInvestment
 * @dev Simple direct investment contract for swipe-to-invest functionality
 */
contract DirectInvestment is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable cUSD;
    uint256 public constant PLATFORM_FEE = 250; // 2.5% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    struct Business {
        string id;
        address wallet;
        uint256 goalAmount;
        uint256 currentAmount;
        bool isActive;
        uint256 createdAt;
    }
    
    struct Investment {
        address investor;
        string businessId;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(string => Business) public businesses;
    mapping(address => Investment[]) public investorHistory;
    mapping(string => Investment[]) public businessInvestments;
    
    address public feeRecipient;
    uint256 public totalInvestments;
    
    event BusinessRegistered(string indexed businessId, address indexed wallet, uint256 goalAmount);
    event InvestmentMade(string indexed businessId, address indexed investor, uint256 amount);
    event FundsWithdrawn(string indexed businessId, address indexed wallet, uint256 amount);
    
    constructor(address _cUSD, address _feeRecipient) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Register a business for investments
     */
    function registerBusiness(
        string memory _businessId,
        address _wallet,
        uint256 _goalAmount
    ) external onlyOwner {
        require(_wallet != address(0), "Invalid wallet address");
        require(_goalAmount > 0, "Goal amount must be positive");
        require(!businesses[_businessId].isActive, "Business already registered");
        
        businesses[_businessId] = Business({
            id: _businessId,
            wallet: _wallet,
            goalAmount: _goalAmount,
            currentAmount: 0,
            isActive: true,
            createdAt: block.timestamp
        });
        
        emit BusinessRegistered(_businessId, _wallet, _goalAmount);
    }
    
    /**
     * @dev Make direct investment to business
     */
    function invest(string memory _businessId, uint256 _amount) 
        external 
        nonReentrant 
    {
        Business storage business = businesses[_businessId];
        require(business.isActive, "Business not active");
        require(_amount > 0, "Investment amount must be positive");
        require(_amount >= 1e18, "Minimum investment is 1 cUSD");
        require(_amount <= 100e18, "Maximum investment is 100 cUSD");
        
        // Transfer cUSD from investor
        cUSD.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Calculate platform fee
        uint256 platformFee = (_amount * PLATFORM_FEE) / BASIS_POINTS;
        uint256 businessAmount = _amount - platformFee;
        
        // Transfer to business wallet and fee recipient
        cUSD.safeTransfer(business.wallet, businessAmount);
        cUSD.safeTransfer(feeRecipient, platformFee);
        
        // Update records
        business.currentAmount += _amount;
        totalInvestments += _amount;
        
        Investment memory newInvestment = Investment({
            investor: msg.sender,
            businessId: _businessId,
            amount: _amount,
            timestamp: block.timestamp
        });
        
        investorHistory[msg.sender].push(newInvestment);
        businessInvestments[_businessId].push(newInvestment);
        
        emit InvestmentMade(_businessId, msg.sender, _amount);
    }
    
    /**
     * @dev Update business goal amount
     */
    function updateBusinessGoal(string memory _businessId, uint256 _newGoal) 
        external 
        onlyOwner 
    {
        require(businesses[_businessId].isActive, "Business not active");
        businesses[_businessId].goalAmount = _newGoal;
    }
    
    /**
     * @dev Deactivate business
     */
    function deactivateBusiness(string memory _businessId) 
        external 
        onlyOwner 
    {
        businesses[_businessId].isActive = false;
    }
    
    /**
     * @dev Update fee recipient
     */
    function updateFeeRecipient(address _newRecipient) 
        external 
        onlyOwner 
    {
        require(_newRecipient != address(0), "Invalid address");
        feeRecipient = _newRecipient;
    }
    
    /**
     * @dev Get business details
     */
    function getBusiness(string memory _businessId) 
        external 
        view 
        returns (Business memory) 
    {
        return businesses[_businessId];
    }
    
    /**
     * @dev Get investor history
     */
    function getInvestorHistory(address _investor) 
        external 
        view 
        returns (Investment[] memory) 
    {
        return investorHistory[_investor];
    }
    
    /**
     * @dev Get business investments
     */
    function getBusinessInvestments(string memory _businessId) 
        external 
        view 
        returns (Investment[] memory) 
    {
        return businessInvestments[_businessId];
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = cUSD.balanceOf(address(this));
        if (balance > 0) {
            cUSD.safeTransfer(owner(), balance);
        }
    }
}