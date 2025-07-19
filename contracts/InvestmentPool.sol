// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title InvestmentPool
 * @dev Manages investment pools for local businesses with milestone-based fund release
 */
contract InvestmentPool is ReentrancyGuard, AccessControl, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BUSINESS_ROLE = keccak256("BUSINESS_ROLE");
    
    IERC20 public immutable cUSD;
    uint256 public constant PLATFORM_FEE = 200; // 2% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    enum PoolStatus { Active, Funded, Closed, Defaulted }
    enum MilestoneStatus { Pending, Approved, Rejected }
    
    struct Pool {
        uint256 id;
        address businessOwner;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 duration; // in months
        uint256 interestRate; // annual rate in basis points
        PoolStatus status;
        uint256 createdAt;
        uint256 fundingDeadline;
        string businessId;
        string purpose;
    }
    
    struct Investment {
        address investor;
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }
    
    struct Milestone {
        uint256 poolId;
        string description;
        uint256 amount;
        MilestoneStatus status;
        uint256 dueDate;
        string evidence;
    }
    
    struct RepaymentSchedule {
        uint256 poolId;
        uint256 amount;
        uint256 dueDate;
        bool paid;
    }
    
    mapping(uint256 => Pool) public pools;
    mapping(uint256 => Investment[]) public poolInvestments;
    mapping(uint256 => Milestone[]) public poolMilestones;
    mapping(uint256 => RepaymentSchedule[]) public repaymentSchedules;
    mapping(address => uint256[]) public investorPools;
    mapping(address => uint256[]) public businessPools;
    
    uint256 public nextPoolId = 1;
    address public feeRecipient;
    
    event PoolCreated(
        uint256 indexed poolId,
        address indexed businessOwner,
        uint256 targetAmount,
        uint256 duration,
        string businessId
    );
    
    event InvestmentMade(
        uint256 indexed poolId,
        address indexed investor,
        uint256 amount
    );
    
    event FundsReleased(
        uint256 indexed poolId,
        uint256 amount,
        uint256 milestoneIndex
    );
    
    event RepaymentMade(
        uint256 indexed poolId,
        uint256 amount,
        uint256 scheduleIndex
    );
    
    event PoolClosed(uint256 indexed poolId, PoolStatus status);
    
    constructor(address _cUSD, address _feeRecipient) {
        cUSD = IERC20(_cUSD);
        feeRecipient = _feeRecipient;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new investment pool
     */
    function createPool(
        uint256 _targetAmount,
        uint256 _duration,
        uint256 _interestRate,
        string memory _businessId,
        string memory _purpose
    ) external returns (uint256) {
        require(_targetAmount > 0, "Target amount must be positive");
        require(_duration > 0 && _duration <= 60, "Duration must be 1-60 months");
        require(_interestRate >= 500 && _interestRate <= 1500, "Interest rate must be 5-15%");
        
        uint256 poolId = nextPoolId++;
        
        pools[poolId] = Pool({
            id: poolId,
            businessOwner: msg.sender,
            targetAmount: _targetAmount,
            currentAmount: 0,
            duration: _duration,
            interestRate: _interestRate,
            status: PoolStatus.Active,
            createdAt: block.timestamp,
            fundingDeadline: block.timestamp + 30 days,
            businessId: _businessId,
            purpose: _purpose
        });
        
        businessPools[msg.sender].push(poolId);
        _grantRole(BUSINESS_ROLE, msg.sender);
        
        emit PoolCreated(poolId, msg.sender, _targetAmount, _duration, _businessId);
        return poolId;
    }
    
    /**
     * @dev Invest in a pool
     */
    function invest(uint256 _poolId, uint256 _amount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Pool storage pool = pools[_poolId];
        require(pool.status == PoolStatus.Active, "Pool not active");
        require(block.timestamp <= pool.fundingDeadline, "Funding deadline passed");
        require(_amount > 0, "Investment amount must be positive");
        require(pool.currentAmount + _amount <= pool.targetAmount, "Exceeds target amount");
        require(_amount >= 1e18, "Minimum investment is 1 cUSD"); // $1 minimum
        require(_amount <= 50e18, "Maximum investment is 50 cUSD"); // $50 maximum
        
        cUSD.safeTransferFrom(msg.sender, address(this), _amount);
        
        poolInvestments[_poolId].push(Investment({
            investor: msg.sender,
            amount: _amount,
            timestamp: block.timestamp,
            withdrawn: false
        }));
        
        pool.currentAmount += _amount;
        investorPools[msg.sender].push(_poolId);
        
        // Check if pool is fully funded
        if (pool.currentAmount >= pool.targetAmount) {
            pool.status = PoolStatus.Funded;
            _createRepaymentSchedule(_poolId);
        }
        
        emit InvestmentMade(_poolId, msg.sender, _amount);
    }
    
    /**
     * @dev Release funds to business owner after milestone approval
     */
    function releaseFunds(uint256 _poolId, uint256 _milestoneIndex) 
        external 
        onlyRole(ADMIN_ROLE) 
        nonReentrant 
    {
        Pool storage pool = pools[_poolId];
        require(pool.status == PoolStatus.Funded, "Pool not funded");
        
        Milestone storage milestone = poolMilestones[_poolId][_milestoneIndex];
        require(milestone.status == MilestoneStatus.Approved, "Milestone not approved");
        
        uint256 platformFee = (milestone.amount * PLATFORM_FEE) / BASIS_POINTS;
        uint256 businessAmount = milestone.amount - platformFee;
        
        cUSD.safeTransfer(pool.businessOwner, businessAmount);
        cUSD.safeTransfer(feeRecipient, platformFee);
        
        emit FundsReleased(_poolId, milestone.amount, _milestoneIndex);
    }
    
    /**
     * @dev Process repayment from business
     */
    function processRepayment(uint256 _poolId, uint256 _scheduleIndex) 
        external 
        nonReentrant 
    {
        Pool storage pool = pools[_poolId];
        require(msg.sender == pool.businessOwner, "Only business owner can repay");
        
        RepaymentSchedule storage schedule = repaymentSchedules[_poolId][_scheduleIndex];
        require(!schedule.paid, "Already paid");
        require(block.timestamp <= schedule.dueDate + 7 days, "Payment window expired");
        
        cUSD.safeTransferFrom(msg.sender, address(this), schedule.amount);
        schedule.paid = true;
        
        // Distribute to investors proportionally
        _distributeRepayment(_poolId, schedule.amount);
        
        emit RepaymentMade(_poolId, schedule.amount, _scheduleIndex);
    }
    
    /**
     * @dev Emergency pause functionality
     */
    function emergencyPause(uint256 _poolId) external onlyRole(ADMIN_ROLE) {
        pools[_poolId].status = PoolStatus.Closed;
        emit PoolClosed(_poolId, PoolStatus.Closed);
    }
    
    /**
     * @dev Handle default situation
     */
    function handleDefault(uint256 _poolId) external onlyRole(ADMIN_ROLE) {
        pools[_poolId].status = PoolStatus.Defaulted;
        emit PoolClosed(_poolId, PoolStatus.Defaulted);
    }
    
    /**
     * @dev Add milestone to pool
     */
    function addMilestone(
        uint256 _poolId,
        string memory _description,
        uint256 _amount,
        uint256 _dueDate
    ) external {
        Pool storage pool = pools[_poolId];
        require(msg.sender == pool.businessOwner, "Only business owner");
        require(pool.status == PoolStatus.Funded, "Pool not funded");
        
        poolMilestones[_poolId].push(Milestone({
            poolId: _poolId,
            description: _description,
            amount: _amount,
            status: MilestoneStatus.Pending,
            dueDate: _dueDate,
            evidence: ""
        }));
    }
    
    /**
     * @dev Approve milestone
     */
    function approveMilestone(uint256 _poolId, uint256 _milestoneIndex) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        poolMilestones[_poolId][_milestoneIndex].status = MilestoneStatus.Approved;
    }
    
    /**
     * @dev Create repayment schedule for funded pool
     */
    function _createRepaymentSchedule(uint256 _poolId) internal {
        Pool storage pool = pools[_poolId];
        uint256 totalRepayment = pool.targetAmount + 
            (pool.targetAmount * pool.interestRate * pool.duration) / (BASIS_POINTS * 12);
        uint256 monthlyPayment = totalRepayment / pool.duration;
        
        for (uint256 i = 0; i < pool.duration; i++) {
            repaymentSchedules[_poolId].push(RepaymentSchedule({
                poolId: _poolId,
                amount: monthlyPayment,
                dueDate: block.timestamp + ((i + 1) * 30 days),
                paid: false
            }));
        }
    }
    
    /**
     * @dev Distribute repayment to investors proportionally
     */
    function _distributeRepayment(uint256 _poolId, uint256 _amount) internal {
        Pool storage pool = pools[_poolId];
        Investment[] storage investments = poolInvestments[_poolId];
        
        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].withdrawn) {
                uint256 investorShare = (_amount * investments[i].amount) / pool.targetAmount;
                cUSD.safeTransfer(investments[i].investor, investorShare);
            }
        }
    }
    
    /**
     * @dev Get pool details
     */
    function getPool(uint256 _poolId) external view returns (Pool memory) {
        return pools[_poolId];
    }
    
    /**
     * @dev Get pool investments
     */
    function getPoolInvestments(uint256 _poolId) external view returns (Investment[] memory) {
        return poolInvestments[_poolId];
    }
    
    /**
     * @dev Get investor pools
     */
    function getInvestorPools(address _investor) external view returns (uint256[] memory) {
        return investorPools[_investor];
    }
    
    /**
     * @dev Get business pools
     */
    function getBusinessPools(address _business) external view returns (uint256[] memory) {
        return businessPools[_business];
    }
}