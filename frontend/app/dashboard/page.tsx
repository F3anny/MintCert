"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Award, Calendar, GraduationCap, Layout, Search } from "lucide-react";
import { MINTCERT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

type Certificate = {
    tokenId: string;
    studentName: string;
    title: string;
    school: string;
    year: string;
    dateIssued: Date;
};

export default function Dashboard() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        fetchMyCertificates();
    }, []);

    const fetchMyCertificates = async () => {
        try {
            if (!window.ethereum) return setLoading(false);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.length === 0) {
                setLoading(false);
                return;
            }

            const userAddress = accounts[0].address;
            setWalletAddress(userAddress);

            const contract = new ethers.Contract(CONTRACT_ADDRESS, MINTCERT_ABI, provider);

            // Note: In a production app, you'd want a more efficient way to query these,
            // such as an indexer (The Graph) or an Enumerable ERC721 extension.
            // For this demo, we'll listen for Transfer events to this user to find their NFTs.

            const filter = contract.filters.Transfer(null, userAddress);
            const events = await contract.queryFilter(filter);

            const myTokens = events.map((e: any) => e.args[2].toString()); // args[2] is tokenId

            // Eliminate duplicates if they transferred it to themselves
            const uniqueTokens = Array.from(new Set(myTokens));

            const certData = await Promise.all(
                uniqueTokens.map(async (tokenId) => {
                    const info = await contract.getCertificateInfo(tokenId);
                    return {
                        tokenId,
                        studentName: info.studentName,
                        title: info.title,
                        school: info.school,
                        year: info.year,
                        dateIssued: new Date(Number(info.dateIssued) * 1000),
                    };
                })
            );

            setCertificates(certData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto min-h-[70vh] animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Credentials</h1>
                    <p className="text-gray-400">View and manage your verifiable achievements.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search certificates..."
                        className="w-full bg-surface/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            {!walletAddress ? (
                <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <Layout className="w-16 h-16 text-gray-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Wallet Disconnected</h2>
                    <p className="text-gray-400 mb-6 max-w-sm">Please connect your Web3 wallet to view your minted certificates.</p>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card rounded-2xl h-64 animate-pulse flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        </div>
                    ))}
                </div>
            ) : certificates.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <Award className="w-16 h-16 text-primary/40 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No Certificates Found</h2>
                    <p className="text-gray-400 max-w-sm">You haven't received any MintCert credentials on this wallet yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.tokenId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative glass-card p-6 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all" />

                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-surface/80 p-3 rounded-xl border border-white/5">
                                    <Award className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                    ID: #{cert.tokenId}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{cert.title}</h3>
                            <p className="text-primary-400 font-medium mb-4 line-clamp-1">{cert.studentName}</p>

                            <div className="space-y-2 mt-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="line-clamp-1">{cert.school} (Class of {cert.year})</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>Issued: {cert.dateIssued.toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 rounded-lg bg-surface hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                                Verify on Explorer
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
