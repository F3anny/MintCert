// The ABI for the MintCert contract
export const MINTCERT_ABI = [
    "function mintCertificate(address student, string studentName, string title, string school, string year, string tokenURI) public returns (uint256)",
    "function getCertificateInfo(uint256 tokenId) public view returns (tuple(string studentName, string title, string school, string year, uint256 dateIssued))",
    "function tokenURI(uint256 tokenId) public view returns (string)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "event CertificateMinted(uint256 indexed tokenId, address indexed student, string title)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Address of the deployed contract. We'll update this once you deploy it to a testnet.
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // REPLACE LATER
