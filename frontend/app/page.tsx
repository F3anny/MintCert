"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Spline from "@splinetool/react-spline";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">

      {/* 3D SPLINE BACKGROUND */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60">
        <div className="w-full h-full max-w-4xl max-h-[600px] pointer-events-auto">
          {/* I'm using a placeholder Spline URL here for a 3D abstract shape, you can replace it with your own */}
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary-400 font-medium text-sm mb-4">
            Secured on Ethereum Sepolia
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Verifiable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Achievements</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            MintCert allows educational institutions to issue tamper-proof certificates
            as NFTs. Students can own, verify, and share their credentials anywhere.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/issue">
            <button className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transform hover:-translate-y-1">
              Issue Certificate
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all border border-white/20 transform hover:-translate-y-1">
              View Dashboard
            </button>
          </Link>
        </motion.div>
      </div>

      {/* FLOATING FEATURES GRID */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-5xl"
      >
        {[
          { title: "Immutable", desc: "Stored permanently on the blockchain. Cannot be forged or altered." },
          { title: "Verifiable", desc: "Anyone can cryptographically verify the authenticity instantly." },
          { title: "Portable", desc: "Students own their certificates in their standard web3 wallet." }
        ].map((feature, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-colors duration-300">
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.div>

    </div>
  );
}
