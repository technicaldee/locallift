// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title BusinessRegistry
 * @dev Registry for business verification and data management
 */
contract BusinessRegistry is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    enum BusinessStatus { Pending, Verified, Rejected, Suspended }
    
    struct Business {
        uint256 id;
        address owner;
        string name;
        string businessType;
        string location;
        string documentsHash; // IPFS hash
        BusinessStatus status;
        uint256 registrationDate;
        uint256 verificationDate;
        string rejectionReason;
        uint256 monthlyRevenue;
        uint256 yearsInOperation;
        uint256 employeeCount;
    }
    
    struct BusinessMetadata {
        string description;
        string website;
        string email;
        string phone;
        string[] categories;
        mapping(string => string) additionalData;
    }
    
    mapping(uint256 => Business) public businesses;
    mapping(uint256 => BusinessMetadata) private businessMetadata;
    mapping(address => uint256[]) public ownerBusinesses;
    mapping(string => bool) public businessNames; // Prevent duplicate names
    
    uint256 public nextBusinessId = 1;
    uint256 public totalBusinesses;
    uint256 public verifiedBusinesses;
    
    event BusinessRegistered(
        uint256 indexed businessId,
        address indexed owner,
        string name,
        string businessType
    );
    
    event BusinessVerified(
        uint256 indexed businessId,
        address indexed verifier,
        uint256 timestamp
    );
    
    event BusinessRejected(
        uint256 indexed businessId,
        address indexed verifier,
        string reason
    );
    
    event BusinessStatusUpdated(
        uint256 indexed businessId,
        BusinessStatus oldStatus,
        BusinessStatus newStatus
    );
    
    event BusinessDataUpdated(
        uint256 indexed businessId,
        string field,
        string newValue
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }
    
    /**
     * @dev Register a new business
     */
    function registerBusiness(
        string memory _name,
        string memory _businessType,
        string memory _location,
        string memory _documentsHash,
        uint256 _monthlyRevenue,
        uint256 _yearsInOperation,
        uint256 _employeeCount,
        string memory _description,
        string memory _website,
        string memory _email,
        string memory _phone
    ) external whenNotPaused returns (uint256) {
        require(bytes(_name).length > 0, "Business name required");
        require(bytes(_businessType).length > 0, "Business type required");
        require(bytes(_location).length > 0, "Location required");
        require(bytes(_documentsHash).length > 0, "Documents hash required");
        require(!businessNames[_name], "Business name already exists");
        
        uint256 businessId = nextBusinessId++;
        
        businesses[businessId] = Business({
            id: businessId,
            owner: msg.sender,
            name: _name,
            businessType: _businessType,
            location: _location,
            documentsHash: _documentsHash,
            status: BusinessStatus.Pending,
            registrationDate: block.timestamp,
            verificationDate: 0,
            rejectionReason: "",
            monthlyRevenue: _monthlyRevenue,
            yearsInOperation: _yearsInOperation,
            employeeCount: _employeeCount
        });
        
        BusinessMetadata storage metadata = businessMetadata[businessId];
        metadata.description = _description;
        metadata.website = _website;
        metadata.email = _email;
        metadata.phone = _phone;
        
        ownerBusinesses[msg.sender].push(businessId);
        businessNames[_name] = true;
        totalBusinesses++;
        
        emit BusinessRegistered(businessId, msg.sender, _name, _businessType);
        return businessId;
    }
    
    /**
     * @dev Verify a business
     */
    function verifyBusiness(uint256 _businessId) 
        external 
        onlyRole(VERIFIER_ROLE) 
        whenNotPaused 
    {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        require(business.status == BusinessStatus.Pending, "Business not pending verification");
        
        BusinessStatus oldStatus = business.status;
        business.status = BusinessStatus.Verified;
        business.verificationDate = block.timestamp;
        verifiedBusinesses++;
        
        emit BusinessVerified(_businessId, msg.sender, block.timestamp);
        emit BusinessStatusUpdated(_businessId, oldStatus, BusinessStatus.Verified);
    }
    
    /**
     * @dev Reject a business
     */
    function rejectBusiness(uint256 _businessId, string memory _reason) 
        external 
        onlyRole(VERIFIER_ROLE) 
        whenNotPaused 
    {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        require(business.status == BusinessStatus.Pending, "Business not pending verification");
        require(bytes(_reason).length > 0, "Rejection reason required");
        
        BusinessStatus oldStatus = business.status;
        business.status = BusinessStatus.Rejected;
        business.rejectionReason = _reason;
        
        emit BusinessRejected(_businessId, msg.sender, _reason);
        emit BusinessStatusUpdated(_businessId, oldStatus, BusinessStatus.Rejected);
    }
    
    /**
     * @dev Update business status (admin only)
     */
    function updateBusinessStatus(uint256 _businessId, BusinessStatus _newStatus) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        
        BusinessStatus oldStatus = business.status;
        
        // Update verified count
        if (oldStatus == BusinessStatus.Verified && _newStatus != BusinessStatus.Verified) {
            verifiedBusinesses--;
        } else if (oldStatus != BusinessStatus.Verified && _newStatus == BusinessStatus.Verified) {
            verifiedBusinesses++;
        }
        
        business.status = _newStatus;
        
        emit BusinessStatusUpdated(_businessId, oldStatus, _newStatus);
    }
    
    /**
     * @dev Update business documents
     */
    function updateBusinessDocuments(uint256 _businessId, string memory _newDocumentsHash) 
        external 
    {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        require(msg.sender == business.owner, "Only business owner can update");
        require(bytes(_newDocumentsHash).length > 0, "Documents hash required");
        
        business.documentsHash = _newDocumentsHash;
        // Reset status to pending if it was rejected
        if (business.status == BusinessStatus.Rejected) {
            business.status = BusinessStatus.Pending;
            business.rejectionReason = "";
        }
        
        emit BusinessDataUpdated(_businessId, "documentsHash", _newDocumentsHash);
    }
    
    /**
     * @dev Update business metadata
     */
    function updateBusinessMetadata(
        uint256 _businessId,
        string memory _description,
        string memory _website,
        string memory _email,
        string memory _phone
    ) external {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        require(msg.sender == business.owner, "Only business owner can update");
        
        BusinessMetadata storage metadata = businessMetadata[_businessId];
        metadata.description = _description;
        metadata.website = _website;
        metadata.email = _email;
        metadata.phone = _phone;
        
        emit BusinessDataUpdated(_businessId, "metadata", "updated");
    }
    
    /**
     * @dev Add business category
     */
    function addBusinessCategory(uint256 _businessId, string memory _category) 
        external 
    {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        require(msg.sender == business.owner, "Only business owner can update");
        
        businessMetadata[_businessId].categories.push(_category);
        emit BusinessDataUpdated(_businessId, "category", _category);
    }
    
    /**
     * @dev Set additional business data
     */
    function setAdditionalData(
        uint256 _businessId, 
        string memory _key, 
        string memory _value
    ) external {
        Business storage business = businesses[_businessId];
        require(business.id != 0, "Business does not exist");
        require(msg.sender == business.owner, "Only business owner can update");
        
        businessMetadata[_businessId].additionalData[_key] = _value;
        emit BusinessDataUpdated(_businessId, _key, _value);
    }
    
    /**
     * @dev Get business details
     */
    function getBusiness(uint256 _businessId) 
        external 
        view 
        returns (Business memory) 
    {
        require(businesses[_businessId].id != 0, "Business does not exist");
        return businesses[_businessId];
    }
    
    /**
     * @dev Get business metadata
     */
    function getBusinessMetadata(uint256 _businessId) 
        external 
        view 
        returns (
            string memory description,
            string memory website,
            string memory email,
            string memory phone,
            string[] memory categories
        ) 
    {
        require(businesses[_businessId].id != 0, "Business does not exist");
        BusinessMetadata storage metadata = businessMetadata[_businessId];
        return (
            metadata.description,
            metadata.website,
            metadata.email,
            metadata.phone,
            metadata.categories
        );
    }
    
    /**
     * @dev Get additional business data
     */
    function getAdditionalData(uint256 _businessId, string memory _key) 
        external 
        view 
        returns (string memory) 
    {
        require(businesses[_businessId].id != 0, "Business does not exist");
        return businessMetadata[_businessId].additionalData[_key];
    }
    
    /**
     * @dev Get businesses owned by address
     */
    function getOwnerBusinesses(address _owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return ownerBusinesses[_owner];
    }
    
    /**
     * @dev Check if business is verified
     */
    function isBusinessVerified(uint256 _businessId) 
        external 
        view 
        returns (bool) 
    {
        return businesses[_businessId].status == BusinessStatus.Verified;
    }
    
    /**
     * @dev Get business statistics
     */
    function getBusinessStats() 
        external 
        view 
        returns (
            uint256 total,
            uint256 verified,
            uint256 pending,
            uint256 rejected
        ) 
    {
        uint256 pendingCount = 0;
        uint256 rejectedCount = 0;
        
        for (uint256 i = 1; i < nextBusinessId; i++) {
            if (businesses[i].status == BusinessStatus.Pending) {
                pendingCount++;
            } else if (businesses[i].status == BusinessStatus.Rejected) {
                rejectedCount++;
            }
        }
        
        return (totalBusinesses, verifiedBusinesses, pendingCount, rejectedCount);
    }
    
    /**
     * @dev Pause contract (admin only)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract (admin only)
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}