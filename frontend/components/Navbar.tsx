"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Wallet, Award, LayoutDashboard, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";

export default function Navbar() {
    const pathname = usePathname();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    // Check if wallet is already connected on load
    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        if (typeof window.ethereum !== "undefined") {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        }
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setWalletAddress(accounts[0]);
            } catch (error) {
                console.error("Connection failed", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const navLinks = [
        { name: "Home", href: "/", icon: Award },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Issue Certificate", href: "/issue", icon: PlusCircle },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 py-4 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="bg-primary/20 p-2 rounded-xl backdrop-blur-sm border border-primary/30">
                            <Award className="text-primary w-6 h-6" />
                        </div>
                    </motion.div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        MintCert
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1 bg-surface/50 rounded-full border border-white/10 p-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                style={{ color: isActive ? "white" : "rgba(255,255,255,0.6)" }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 bg-primary/20 rounded-full border border-primary/30"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {link.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Connect Wallet Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={connectWallet}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all text-sm",
                        walletAddress
                            ? "bg-surface border border-white/10 text-white/80"
                            : "bg-primary hover:bg-primary-dark text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    )}
                >
                    <Wallet className="w-4 h-4" />
                    {walletAddress
                        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                        : "Connect Wallet"}
                </motion.button>
            </div>
        </nav>
    );
}
