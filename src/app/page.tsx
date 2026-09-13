'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { InstitutionalCreditHub } from '@/components/InstitutionalCreditHub';
import { ConfidentialAssessmentTerminal } from '@/components/ConfidentialAssessmentTerminal';
import { PrivacyTransparencyRadar } from '@/components/PrivacyTransparencyRadar';
import { UnderwrittenVaultBorrower } from '@/components/UnderwrittenVaultBorrower';
import { CryptographicCreditLog } from '@/components/CryptographicCreditLog';
import { ProtocolStateManager } from '@/lib/midnight/contractState';
import { ProtocolStats, VerificationLogEntry } from '@/types';
import { 
  Shield, 
  Sparkles, 
  Cpu, 
  Lock, 
  Globe, 
  Layers, 
  ArrowRight,
  FileCode2,
  CheckCircle2,
  Terminal
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<ProtocolStats>({
    totalVaultLiquidityUSD: 12_450_000,
    nightLiquidityUSD: 4_200_000,
    dustLiquidityUSD: 8_250_000,
    totalVerifiedBorrowers: 142,
    totalLoansDisbursedUSD: 3_890_000,
    protocolHealthFactor: 1.84,
    platinumCount: 48,
    goldCount: 65,
    silverCount: 29,
  });

  const [logs, setLogs] = useState<VerificationLogEntry[]>([]);
  const [lastVerifiedProof, setLastVerifiedProof] = useState<VerificationLogEntry | null>(null);

  const manager = ProtocolStateManager.getInstance();

  useEffect(() => {
    const update = () => {
      setStats(manager.getStats());
      setLogs(manager.getLogs());
    };
    update();
    const unsub = manager.subscribe(update);
    return () => unsub();
  }, [manager]);

  const handleVerificationSuccess = (entry: VerificationLogEntry) => {
    setLastVerifiedProof(entry);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-ice-500/30 selection:text-ice-200">
      
      {/* Top Navigation */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Protocol Hero Header */}
        <div className="relative rounded-3xl p-8 md:p-10 glass-panel border border-ice-400/30 overflow-hidden shadow-ice-md">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-ice-500/15 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-ice-500/10 border border-ice-400/30 text-xs font-semibold text-ice-300">
              <Sparkles className="w-3.5 h-3.5 text-ice-400" />
              <span>Midnight Network • Level-3 Zero-Knowledge Privacy Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono leading-tight">
              Zero-Knowledge Private Underwriting & Credit Protocol
            </h1>

            <p className="text-sm sm:text-base text-titanium-300 leading-relaxed">
              EclipseLend unlocks institutional liquidity pools by proving creditworthiness in client-side 
              zero-knowledge circuits. Your credit score, liquid reserves, and debt ratios are validated 
              mathematically without ever leaking plaintext financial records to the public ledger.
            </p>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-titanium-900/90 border border-titanium-800 text-titanium-300">
                <Lock className="w-3.5 h-3.5 text-ice-400" />
                <span>Witness Isolation: Active</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-titanium-900/90 border border-titanium-800 text-titanium-300">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compact Circuit: Compiled</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-titanium-900/90 border border-titanium-800 text-titanium-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Midnight Preprod Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Institutional Credit Hub */}
        <InstitutionalCreditHub stats={stats} />

        {/* 2. Confidential Assessment Terminal */}
        <ConfidentialAssessmentTerminal onVerificationSuccess={handleVerificationSuccess} />

        {/* 3. Privacy Transparency Radar */}
        <PrivacyTransparencyRadar />

        {/* 4. Tier-Authorized Underwriting Vault (Borrow/Repay) */}
        <UnderwrittenVaultBorrower lastVerifiedProof={lastVerifiedProof} />

        {/* 5. Cryptographic Credit Log (Real-time on-chain verification) */}
        <CryptographicCreditLog logs={logs} />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-titanium-800/80 bg-titanium-950/90 py-8 text-xs text-titanium-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-ice-400" />
            <span className="font-mono font-bold text-slate-200">EclipseLend Protocol</span>
            <span>—</span>
            <span>Built for Midnight Network (Preprod)</span>
          </div>

          <div className="flex items-center space-x-6 text-titanium-400">
            <span className="flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5 text-ice-400" />
              <code className="font-mono text-[11px] text-titanium-300">contracts/eclipse_lend.compact</code>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Level-3 Privacy Spec</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
