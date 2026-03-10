import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MintCertModule = buildModule("MintCertModule", (m) => {
    const initialOwner = m.getAccount(0);

    const mintCert = m.contract("MintCert", [initialOwner]);

    return { mintCert };
});

export default MintCertModule;
