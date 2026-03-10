// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintCert is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct Certificate {
        string studentName;
        string title;
        string school;
        string year;
        uint256 dateIssued;
    }

    mapping(uint256 => Certificate) public certificates;

    event CertificateMinted(uint256 indexed tokenId, address indexed student, string title);

    constructor(address initialOwner) ERC721("MintCert Achievement", "MCERT") Ownable(initialOwner) {}

    function mintCertificate(
        address student,
        string memory studentName,
        string memory title,
        string memory school,
        string memory year,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        certificates[tokenId] = Certificate({
            studentName: studentName,
            title: title,
            school: school,
            year: year,
            dateIssued: block.timestamp
        });

        _safeMint(student, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit CertificateMinted(tokenId, student, title);

        return tokenId;
    }

    function getCertificateInfo(uint256 tokenId) public view returns (Certificate memory) {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        return certificates[tokenId];
    }
}
