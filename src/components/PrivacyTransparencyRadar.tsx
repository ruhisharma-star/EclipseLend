'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Globe, 
  Laptop, 
  FileCode2, 
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export const PrivacyTransparencyRadar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'prover' | 'explorer'>('side-by-side');

  return (
    <div className="glass-panel rounded-2xl p-6 border border-ice-400/30">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-titanium-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-ice-400" />
            <span>Privacy Transparency Radar</span>
          </h2>
          <p className="text-xs text-titanium-400 mt-0.5">
            Compare what the borrower sees locally in their browser prover versus what Midnight validators & block explorers see on-chain
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-titanium-950 border border-titanium-800">
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'side-by-side'
                ? 'bg-ice-500/20 text-ice-300 border border-ice-400/30 shadow-ice-sm'
                : 'text-titanium-400 hover:text-white'
            }`}
          >
            Side-by-Side Radar
          </button>
          <button
            onClick={() => setActiveTab('prover')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'prover'
                ? 'bg-ice-500/20 text-ice-300 border border-ice-400/30 shadow-ice-sm'
                : 'text-titanium-400 hover:text-white'
            }`}
          >
            Local Prover View
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'explorer'
                ? 'bg-ice-500/20 text-ice-300 border border-ice-400/30 shadow-ice-sm'
                : 'text-titanium-400 hover:text-white'
            }`}
          >
            On-Chain Explorer View
          </button>
        </div>
      </div>

      {/* Main Comparative View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Left Side: Local Borrower View */}
        {(activeTab === 'side-by-side' || activeTab === 'prover') && (
          <div className="p-5 rounded-xl bg-titanium-900/80 border border-ice-400/30 shadow-ice-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-titanium-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-ice-500/20 text-ice-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Local Borrower Machine</h4>
                  <span className="text-[10px] text-titanium-400">Client Memory (Prover Context)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WITNESS UNENCRYPTED
              </span>
            </div>

            {/* Local Financial Metrics */}
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Exact Credit Score:</span>
                <span className="font-mono font-bold text-white">785 (FICO 8 Score)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Liquid Reserve Balance:</span>
                <span className="font-mono font-bold text-white">$65,000.00 USD</span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Monthly Gross Salary:</span>
                <span className="font-mono font-bold text-white">$11,000.00 / month</span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Monthly Debt Obligations:</span>
                <span className="font-mono font-bold text-white">$2,200.00 / month (20.0% DTI)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Identity Blinding Salt:</span>
                <span className="font-mono text-[11px] text-ice-400 truncate max-w-[150px]">
                  0x8f2d9e1c3b4a56789...
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-ice-500/10 border border-ice-400/20 text-[11px] text-ice-300 flex items-start space-y-1">
              <Lock className="w-4 h-4 text-ice-400 shrink-0 mr-2 mt-0.5" />
              <span>
                These exact figures are ingested by the <code className="font-mono text-white">witness getBorrowerFinancials()</code> hook and blinded before proof synthesis.
              </span>
            </div>
          </div>
        )}

        {/* Right Side: Public On-Chain Explorer View */}
        {(activeTab === 'side-by-side' || activeTab === 'explorer') && (
          <div className="p-5 rounded-xl bg-titanium-900/80 border border-titanium-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-titanium-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-titanium-800 text-ice-300">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Midnight Preprod Ledger</h4>
                  <span className="text-[10px] text-titanium-400">Public Explorer & Validator View</span>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-ice-500/20 text-ice-300 border border-ice-400/30">
                DISCLOSED OUTCOME ONLY
              </span>
            </div>

            {/* On-Chain Disclosed State */}
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Verified Risk Tier:</span>
                <span className="font-mono font-bold text-ice-300 px-2 py-0.5 rounded bg-ice-500/20 border border-ice-400/30">
                  PLATINUM
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Borrower Nullifier:</span>
                <span className="font-mono text-emerald-400 font-bold truncate max-w-[170px]">
                  0x9e83f71c42b10a6...fa12
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Credit Score:</span>
                <span className="font-mono text-[11px] text-titanium-500 bg-titanium-900 px-2 py-0.5 rounded">
                  [REDACTED / ZK SEALED]
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Bank Balance / Assets:</span>
                <span className="font-mono text-[11px] text-titanium-500 bg-titanium-900 px-2 py-0.5 rounded">
                  [REDACTED / ZK SEALED]
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-titanium-950 border border-titanium-800 flex justify-between items-center">
                <span className="text-titanium-400">Proof Verification Status:</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VALID (Halo2)</span>
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-titanium-950 border border-titanium-800 text-[11px] text-titanium-400 flex items-start space-y-1">
              <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mr-2 mt-0.5" />
              <span>
                Midnight network consensus nodes verify the zero-knowledge proof mathematically without learning any personal financial details.
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
