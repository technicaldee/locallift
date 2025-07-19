// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title EscrowManager
 * @dev Manages escrow for investment funds with milestone-based releases
 */
contract EscrowManager is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BUSINESS_ROLE = keccak256("BUSINESS_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");
    
    IERC20 public immutable cUSD;
    
    enum EscrowStatus { Active, Released, Disputed, Cancelled }
    enum DisputeStatus { None, Raised, UnderReview, Resolved }
    
    struct Escrow {
        uint256 id;
        uint256 poolId;
        address business;
        address[] investors;
        uint256 totalAmount;
        uint256 releasedAmount;
        EscrowStatus status;
        uint256 createdAt;
        uint256 releaseDeadline;
        string milestoneDescription;
        string evidenceHash; // IPFS hash of milestone evidence
    }
    
    struct Dispute {
        uint256 escrowId;
        address initiator;
        string reason;
        DisputeStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
        address resolver;
        bool businessFavor; // true if resolved in business favor
        string resolution;
    }
    
    struct InvestorVote {
        address investor;
        bool approve;
        uint256 timestamp;
        string comment;
    }
    
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => InvestorVote[]) public escrowVotes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256[]) public businessEscrows;
    mapping(address => uint256[]) public investorEscrows;
    
    uint256 public nextEscrowId = 1;
    uint256 public votingPeriod = 7 days;
    uint256 public requiredApprovalPercentage = 60; // 60% approval needed
    
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed poolId,
        address indexed business,
        uint256 amount
    );
    
    event MilestoneSubmitted(
        uint256 indexed escrowId,
        string evidenceHash,
        string description
    );
    
    event VoteCast(
        uint256 indexed escrowId,
        address indexed investor,
        bool approve
    );
    
    event FundsReleased(
        uint256 indexed escrowId,
        uint256 amount,
        address recipient
    );
    
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed initiator,
        string reason
    );
    
    event DisputeResolved(
        uint256 indexed escrowId,
        address indexed resolver,
        bool businessFavor
    );
    
    constructor(address _cUSD) {
        cUSD = IERC20(_cUSD);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ARBITRATOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Create new escrow for milestone
     */
    function createEscrow(
        uint256 _poolId,
        address _business,
        address[] memory _investors,
        uint256 _amount,
        string memory _milestoneDescription,
        uint256 _releaseDeadline
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_amount > 0, "Amount must be positive");
        require(_investors.length > 0, "Must have investors");
        require(_releaseDeadline > block.timestamp, "Invalid deadline");
        
        uint256 escrowId = nextEscrowId++;
        
        escrows[escrowId] = Escrow({
            id: escrowId,
            poolId: _poolId,
            business: _business,
            investors: _investors,
            totalAmount: _amount,
            releasedAmount: 0,
            status: EscrowStatus.Active,
            createdAt: block.timestamp,
            releaseDeadline: _releaseDeadline,
            milestoneDescription: _milestoneDescription,
            evidenceHash: ""
        });
        
        businessEscrows[_business].push(escrowId);
        for (uint256 i = 0; i < _investors.length; i++) {
            investorEscrows[_investors[i]].push(escrowId);
        }
        
        _grantRole(BUSINESS_ROLE, _business);
        
        emit EscrowCreated(escrowId, _poolId, _business, _amount);
        return escrowId;
    }
    
    /**
     * @dev Submit milestone evidence
     */
    function submitMilestone(
        uint256 _escrowId,
        string memory _evidenceHash,
        string memory _description
    ) external {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.id != 0, "Escrow does not exist");
        require(msg.sender == escrow.business, "Only business can submit");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(bytes(_evidenceHash).length > 0, "Evidence hash required");
        
        escrow.evidenceHash = _evidenceHash;
        escrow.milestoneDescription = _description;
        
        emit MilestoneSubmitted(_escrowId, _evidenceHash, _description);
    }
    
    /**
     * @dev Cast vote on milestone
     */
    function castVote(
        uint256 _escrowId,
        bool _approve,
        string memory _comment
    ) external nonReentrant {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.id != 0, "Escrow does not exist");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(bytes(escrow.evidenceHash).length > 0, "No milestone submitted");
        require(!hasVoted[_escrowId][msg.sender], "Already voted");
        require(_isInvestor(_escrowId, msg.sender), "Not an investor");
        
        escrowVotes[_escrowId].push(InvestorVote({
            investor: msg.sender,
            approve: _approve,
            timestamp: block.timestamp,
            comment: _comment
        }));
        
        hasVoted[_escrowId][msg.sender] = true;
        
        emit VoteCast(_escrowId, msg.sender, _approve);
        
        // Check if voting is complete
        _checkVotingComplete(_escrowId);
    }
    
    /**
     * @dev Release funds after successful voting
     */
    function releaseFunds(uint256 _escrowId) 
        external 
        nonReentrant 
        onlyRole(ADMIN_ROLE) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.id != 0, "Escrow does not exist");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(_isApproved(_escrowId), "Milestone not approved");
        
        uint256 releaseAmount = escrow.totalAmount - escrow.releasedAmount;
        escrow.releasedAmount = escrow.totalAmount;
        escrow.status = EscrowStatus.Released;
        
        cUSD.safeTransfer(escrow.business, releaseAmount);
        
        emit FundsReleased(_escrowId, releaseAmount, escrow.business);
    }
    
    /**
     * @dev Raise dispute
     */
    function raiseDispute(uint256 _escrowId, string memory _reason) 
        external 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.id != 0, "Escrow does not exist");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(
            _isInvestor(_escrowId, msg.sender) || msg.sender == escrow.business,
            "Not authorized"
        );
        require(disputes[_escrowId].status == DisputeStatus.None, "Dispute already exists");
        
        disputes[_escrowId] = Dispute({
            escrowId: _escrowId,
            initiator: msg.sender,
            reason: _reason,
            status: DisputeStatus.Raised,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolver: address(0),
            businessFavor: false,
            resolution: ""
        });
        
        escrow.status = EscrowStatus.Disputed;
        
        emit DisputeRaised(_escrowId, msg.sender, _reason);
    }
    
    /**
     * @dev Resolve dispute (arbitrator only)
     */
    function resolveDispute(
        uint256 _escrowId,
        bool _businessFavor,
        string memory _resolution
    ) external onlyRole(ARBITRATOR_ROLE) {
        Dispute storage dispute = disputes[_escrowId];
        Escrow storage escrow = escrows[_escrowId];
        
        require(dispute.status == DisputeStatus.Raised, "No active dispute");
        require(escrow.status == EscrowStatus.Disputed, "Escrow not disputed");
        
        dispute.status = DisputeStatus.Resolved;
        dispute.resolvedAt = block.timestamp;
        dispute.resolver = msg.sender;
        dispute.businessFavor = _businessFavor;
        dispute.resolution = _resolution;
        
        if (_businessFavor) {
            // Release funds to business
            uint256 releaseAmount = escrow.totalAmount - escrow.releasedAmount;
            escrow.releasedAmount = escrow.totalAmount;
            escrow.status = EscrowStatus.Released;
            cUSD.safeTransfer(escrow.business, releaseAmount);
        } else {
            // Return funds to investors proportionally
            escrow.status = EscrowStatus.Cancelled;
            _returnFundsToInvestors(_escrowId);
        }
        
        emit DisputeResolved(_escrowId, msg.sender, _businessFavor);
    }
    
    /**
     * @dev Emergency cancel escrow (admin only)
     */
    function emergencyCancel(uint256 _escrowId) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.id != 0, "Escrow does not exist");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        
        escrow.status = EscrowStatus.Cancelled;
        _returnFundsToInvestors(_escrowId);
    }
    
    /**
     * @dev Check if milestone is approved by investors
     */
    function _isApproved(uint256 _escrowId) internal view returns (bool) {
        InvestorVote[] memory votes = escrowVotes[_escrowId];
        Escrow memory escrow = escrows[_escrowId];
        
        if (votes.length < escrow.investors.length) {
            return false; // Not all investors voted
        }
        
        uint256 approvals = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].approve) {
                approvals++;
            }
        }
        
        return (approvals * 100) / votes.length >= requiredApprovalPercentage;
    }
    
    /**
     * @dev Check if address is investor in escrow
     */
    function _isInvestor(uint256 _escrowId, address _address) 
        internal 
        view 
        returns (bool) 
    {
        Escrow memory escrow = escrows[_escrowId];
        for (uint256 i = 0; i < escrow.investors.length; i++) {
            if (escrow.investors[i] == _address) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Check if voting is complete and process result
     */
    function _checkVotingComplete(uint256 _escrowId) internal {
        Escrow memory escrow = escrows[_escrowId];
        InvestorVote[] memory votes = escrowVotes[_escrowId];
        
        if (votes.length == escrow.investors.length) {
            // All investors have voted
            if (_isApproved(_escrowId)) {
                // Auto-release if approved
                // Note: In production, you might want manual release for additional checks
            }
        }
    }
    
    /**
     * @dev Return funds to investors proportionally
     */
    function _returnFundsToInvestors(uint256 _escrowId) internal {
        Escrow memory escrow = escrows[_escrowId];
        uint256 returnAmount = escrow.totalAmount - escrow.releasedAmount;
        
        // In a real implementation, you would need investment amounts per investor
        // For now, distribute equally
        uint256 amountPerInvestor = returnAmount / escrow.investors.length;
        
        for (uint256 i = 0; i < escrow.investors.length; i++) {
            cUSD.safeTransfer(escrow.investors[i], amountPerInvestor);
        }
    }
    
    /**
     * @dev Get escrow details
     */
    function getEscrow(uint256 _escrowId) 
        external 
        view 
        returns (Escrow memory) 
    {
        return escrows[_escrowId];
    }
    
    /**
     * @dev Get escrow votes
     */
    function getEscrowVotes(uint256 _escrowId) 
        external 
        view 
        returns (InvestorVote[] memory) 
    {
        return escrowVotes[_escrowId];
    }
    
    /**
     * @dev Get business escrows
     */
    function getBusinessEscrows(address _business) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return businessEscrows[_business];
    }
    
    /**
     * @dev Get investor escrows
     */
    function getInvestorEscrows(address _investor) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return investorEscrows[_investor];
    }
    
    /**
     * @dev Set voting parameters (admin only)
     */
    function setVotingParameters(
        uint256 _votingPeriod,
        uint256 _requiredApprovalPercentage
    ) external onlyRole(ADMIN_ROLE) {
        require(_requiredApprovalPercentage > 0 && _requiredApprovalPercentage <= 100, "Invalid percentage");
        votingPeriod = _votingPeriod;
        requiredApprovalPercentage = _requiredApprovalPercentage;
    }
}