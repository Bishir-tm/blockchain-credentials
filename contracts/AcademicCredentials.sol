// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AcademicCredentials {
    struct Certificate {
        string studentId;
        string studentName;
        string degree;
        string graduationDate;
        string institution;
        uint256 issueTimestamp;
        bytes32 certificateHash;
        bool exists;
    }
    
    address public admin;
    mapping(string => Certificate) public certificates;
    mapping(bytes32 => string) public hashToCertId;
    
    // NEW: Array to store all issued certificate IDs
    string[] public issuedCertificateIds;
    
    // NEW: Mapping to track if a certificate ID is already in the array (prevents duplicates)
    mapping(string => bool) private certificateIdExists;
    
    event CertificateIssued(
        string indexed certificateId,
        string studentName,
        string degree,
        bytes32 certificateHash
    );
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function issueCertificate(
        string memory _certificateId,
        string memory _studentId,
        string memory _studentName,
        string memory _degree,
        string memory _graduationDate,
        string memory _institution,
        bytes32 _certificateHash
    ) public onlyAdmin {
        require(!certificates[_certificateId].exists, "Certificate already exists");
         
        certificates[_certificateId] = Certificate({
            studentId: _studentId,
            studentName: _studentName,
            degree: _degree,
            graduationDate: _graduationDate,
            institution: _institution,
            issueTimestamp: block.timestamp,
            certificateHash: _certificateHash,
            exists: true
        });
        
        hashToCertId[_certificateHash] = _certificateId;
        
        // NEW: Add certificate ID to the array if not already added
        if (!certificateIdExists[_certificateId]) {
            issuedCertificateIds.push(_certificateId);
            certificateIdExists[_certificateId] = true;
        }
        
        emit CertificateIssued(_certificateId, _studentName, _degree, _certificateHash);
    }
    
    function verifyCertificate(string memory _certificateId) 
        public view returns (
            bool exists,
            string memory studentName,
            string memory degree,
            string memory graduationDate,
            string memory institution,
            uint256 issueTimestamp,
            bytes32 certificateHash
        ) {
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.exists,
            cert.studentName,
            cert.degree,
            cert.graduationDate,
            cert.institution,
            cert.issueTimestamp,
            cert.certificateHash
        );
    }
    
    function verifyByHash(bytes32 _hash) 
        public view returns (
            bool exists,
            string memory certificateId,
            string memory studentName,
            string memory degree
        ) {
        string memory certId = hashToCertId[_hash];
        Certificate memory cert = certificates[certId];
        return (
            cert.exists,
            certId,
            cert.studentName,
            cert.degree
        );
    }
    
    // NEW: Get all issued certificate IDs
    function getAllCertificateIds() 
        public view returns (string[] memory) {
        return issuedCertificateIds;
    }
    
    // NEW: Get the total number of issued certificates
    function getTotalCertificates() 
        public view returns (uint256) {
        return issuedCertificateIds.length;
    }
    
    // NEW: Get certificate ID by index (for pagination)
    function getCertificateIdByIndex(uint256 _index) 
        public view returns (string memory) {
        require(_index < issuedCertificateIds.length, "Index out of bounds");
        return issuedCertificateIds[_index];
    }
}