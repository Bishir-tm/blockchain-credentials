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
}