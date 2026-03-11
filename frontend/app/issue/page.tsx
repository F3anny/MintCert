"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { MINTCERT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

export default function IssueCertificate() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        studentAddress: "",
        studentName: "",
        title: "",
        school: "",
        year: new Date().getFullYear().toString(),
        tokenURI: "ipfs://placeholder", // In production, upload metadata to IPFS first
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const mintCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!window.ethereum) throw new Error("Please install MetaMask to issue certificates");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(CONTRACT_ADDRESS, MINTCERT_ABI, signer);

            const tx = await contract.mintCertificate(
                formData.studentAddress,
                formData.studentName,
                formData.title,
                formData.school,
                formData.year,
                formData.tokenURI
            );

            await tx.wait(); // Wait for transaction to be mined
            setSuccess(true);

            // Reset form
            setFormData({
                studentAddress: "",
                studentName: "",
                title: "",
                school: "",
                year: new Date().getFullYear().toString(),
                tokenURI: "ipfs://placeholder",
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred while minting the certificate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Issue New Certificate</h1>
                <p className="text-gray-400">Mint a verifiable achievement as an NFT to a student's wallet.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-2xl relative overflow-hidden"
            >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5" />
                        <div>
                            <h3 className="text-green-500 font-medium">Certificate Issued Successfully!</h3>
                            <p className="text-sm text-green-500/80">The transaction has been confirmed on the blockchain.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                        <AlertCircle className="text-red-500 w-5 h-5 mt-0.5" />
                        <div>
                            <h3 className="text-red-500 font-medium">Transaction Failed</h3>
                            <p className="text-sm text-red-500/80">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={mintCertificate} className="space-y-5 relative z-10">

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Student Wallet Address</label>
                        <input
                            required
                            name="studentAddress"
                            value={formData.studentAddress}
                            onChange={handleChange}
                            placeholder="0x..."
                            className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Student Name</label>
                            <input
                                required
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Certificate Title</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. B.S. in Computer Science"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Issuing Institution / School</label>
                            <input
                                required
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                placeholder="University of Example"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Graduation Year</label>
                            <input
                                required
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="2026"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(139,92,246,0.2)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Minting Immutable Record...
                            </>
                        ) : (
                            "Issue Certificate to Blockchain"
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
