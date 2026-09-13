'use client';

import React, { useState } from 'react';
import { FinancialProfile, CreditTier, ProofStage, VerificationLogEntry } from '@/types';
import { ZeroKnowledgeProver } from '@/lib/midnight/circuitProver';
import { ProtocolStateManager } from '@/lib/midnight/contractState';
import { ProofModal } from './ProofModal';
import { 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  EyeOff, 
  Calculator, 
  AlertTriangle,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ConfidentialAssessmentTerminalProps {
  onVerificationSuccess: (entry: VerificationLogEntry) => void;
}

export const ConfidentialAssessmentTerminal: React.FC<ConfidentialAssessmentTerminalProps> = ({
  onVerificationSuccess,
}) => {
  const [profile, setProfile] = useState<FinancialProfile>({
    creditScore: 785,
    reserveAssetsUSD: 65000,
    monthlyIncomeUSD: 11000,
    monthlyDebtUSD: 2200,
    identitySalt: '0x8f2d9e1c3b4a567890abcdef1234567890abcdef1234567890abcdef12345678',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofStage, setProofStage] = useState<ProofStage>('idle');
  const [proofMessage, setProofMessage] = useState('');
  const [proofProgress, setProofProgress] = useState(0);
  const [proofMetadata, setProofMetadata] = useState<any>(null);

  // Local real-time preflight estimate
  const localEval = ZeroKnowledgeProver.evaluateRiskRules(profile);

  const generateNewSalt = () => {
    const randomSalt = '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setProfile((prev) => ({ ...prev, identitySalt: randomSalt }));
  };

  const handleStartProof = async () => {
    setIsModalOpen(true);
    setProofStage('sanitizing_witness');
    setProofMessage('Initializing Midnight local prover...');
    setProofProgress(5);

    const result = await ZeroKnowledgeProver.executeZKProof(
      profile,
      (stage, message, progressPercent, metadata) => {
        setProofStage(stage);
        setProofMessage(message);
        setProofProgress(progressPercent);
        if (metadata) setProofMetadata(metadata);
      }
    );

    if (result.success && result.proofLog) {
      ProtocolStateManager.getInstance().recordVerifiedAttestation(result.proofLog);
      onVerificationSuccess(result.proofLog);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-ice-400/30 relative">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-titanium-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-ice-500/20 to-ice-600/10 border border-ice-400/30 text-ice-400 shadow-ice-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Confidential Underwriting Terminal</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-ice-500/20 text-ice-300 border border-ice-400/30">
                ZK WITNESS
              </span>
            </h2>
            <p className="text-xs text-titanium-400">
              Your sensitive financial parameters are evaluated strictly in client-side zero-knowledge circuits
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-titanium-950 border border-titanium-800 text-xs">
          <EyeOff className="w-3.5 h-3.5 text-ice-400" />
          <span className="text-titanium-300">Privacy Status:</span>
          <span className="text-emerald-400 font-semibold font-mono">100% Client-Blinded</span>
        </div>
      </div>

      {/* Main Terminal Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: Private Inputs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Credit Score Input with Slider */}
          <div className="p-4 rounded-xl bg-titanium-900/70 border border-titanium-800 focus-within:border-ice-400/50 transition">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-titanium-300 flex items-center space-x-2">
                <span>Credit Bureau Score (FICO/Vantage)</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-ice-500/15 text-ice-300 rounded border border-ice-400/20">
                  Private Witness (Kept Local)
                </span>
              </label>
              <span className="font-mono font-bold text-base text-ice-300">
                {profile.creditScore}
              </span>
            </div>
            
            <input
              type="range"
              min="300"
              max="850"
              value={profile.creditScore}
              onChange={(e) => setProfile({ ...profile, creditScore: Number(e.target.value) })}
              className="w-full accent-ice-400 cursor-pointer h-1.5 bg-titanium-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-titanium-500 font-mono mt-1">
              <span>300 (Subprime)</span>
              <span>650 (Silver)</span>
              <span>720 (Gold)</span>
              <span>780+ (Platinum)</span>
              <span>850</span>
            </div>
          </div>

          {/* Reserve Assets & Monthly Income Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Liquid Reserves */}
            <div className="p-4 rounded-xl bg-titanium-900/70 border border-titanium-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-titanium-300">Liquid Reserve Assets</label>
                <span className="text-[9px] font-mono uppercase bg-ice-500/15 text-ice-300 px-1.5 py-0.5 rounded border border-ice-400/20">
                  Private Witness
                </span>
              </div>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  value={profile.reserveAssetsUSD}
                  onChange={(e) => setProfile({ ...profile, reserveAssetsUSD: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 bg-titanium-950 border border-titanium-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-ice-400"
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Monthly Gross Income */}
            <div className="p-4 rounded-xl bg-titanium-900/70 border border-titanium-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-titanium-300">Monthly Gross Income</label>
                <span className="text-[9px] font-mono uppercase bg-ice-500/15 text-ice-300 px-1.5 py-0.5 rounded border border-ice-400/20">
                  Private Witness
                </span>
              </div>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  value={profile.monthlyIncomeUSD}
                  onChange={(e) => setProfile({ ...profile, monthlyIncomeUSD: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 bg-titanium-950 border border-titanium-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-ice-400"
                  placeholder="10000"
                />
              </div>
            </div>

          </div>

          {/* Monthly Debt Obligations & Identity Salt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Monthly Debt */}
            <div className="p-4 rounded-xl bg-titanium-900/70 border border-titanium-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-titanium-300">Monthly Debt Obligations</label>
                <span className="text-[9px] font-mono uppercase bg-ice-500/15 text-ice-300 px-1.5 py-0.5 rounded border border-ice-400/20">
                  Private Witness
                </span>
              </div>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  value={profile.monthlyDebtUSD}
                  onChange={(e) => setProfile({ ...profile, monthlyDebtUSD: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 bg-titanium-950 border border-titanium-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-ice-400"
                  placeholder="2000"
                />
              </div>
            </div>

            {/* Identity Salt / Nullifier Seed */}
            <div className="p-4 rounded-xl bg-titanium-900/70 border border-titanium-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-titanium-300">Identity Blinding Salt</label>
                <button
                  type="button"
                  onClick={generateNewSalt}
                  className="text-[9px] font-mono uppercase text-ice-400 hover:text-ice-300 flex items-center space-x-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Regenerate</span>
                </button>
              </div>
              <div className="mt-1">
                <input
                  type="text"
                  readOnly
                  value={profile.identitySalt}
                  className="w-full px-3 py-2 bg-titanium-950 border border-titanium-800 rounded-lg text-xs font-mono text-titanium-400 truncate focus:outline-none"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Dynamic Pre-Flight Analyzer & ZK Trigger */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-titanium-900/90 border border-ice-400/20 shadow-ice-sm">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-titanium-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Calculator className="w-4 h-4 text-ice-400" />
                <span>Local Prover Pre-Flight</span>
              </span>
              <span className="text-[10px] font-mono text-titanium-400">Zero-Network Leakage</span>
            </div>

            {/* Live Tier Estimation Banner */}
            <div className="p-3.5 rounded-xl bg-titanium-950 border border-titanium-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-titanium-400">Estimated Credit Tier:</span>
                <span className={`px-2.5 py-1 text-xs font-bold font-mono rounded uppercase ${
                  localEval.tier === CreditTier.Platinum
                    ? 'bg-ice-400/20 text-ice-200 border border-ice-400/40'
                    : localEval.tier === CreditTier.Gold
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : localEval.tier === CreditTier.Silver
                    ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {localEval.tier}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-titanium-400">Debt-to-Income (DTI):</span>
                <span className="font-mono font-bold text-white">{localEval.dtiRatio.toFixed(1)}%</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-titanium-400">Max Underwritten Limit:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${localEval.maxLimitUSD.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Privacy Disclosed vs Blinded Specs */}
            <div className="p-3 rounded-lg bg-titanium-950/60 border border-titanium-850 space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5 text-titanium-300">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>On-Chain Ledger:</span>
                <span className="text-ice-300 font-mono">Tier & Anonymous Nullifier ONLY</span>
              </div>
              <div className="flex items-center space-x-1.5 text-titanium-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Protected Witness:</span>
                <span className="text-titanium-400 font-mono">Credit Score, Income, Assets Sealed</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5">
            <button
              onClick={handleStartProof}
              disabled={!localEval.isApproved}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition shadow-ice-md ${
                localEval.isApproved
                  ? 'bg-gradient-to-r from-ice-500 via-ice-400 to-ice-300 text-titanium-950 hover:shadow-ice-lg active:scale-95'
                  : 'bg-titanium-800 text-titanium-500 cursor-not-allowed border border-titanium-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>
                {localEval.isApproved
                  ? 'Verify Eligibility via ZK Proof'
                  : 'Unqualified: Score/Reserves Under Min Threshold'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Proof Execution Modal */}
      <ProofModal
        isOpen={isModalOpen}
        stage={proofStage}
        message={proofMessage}
        progressPercent={proofProgress}
        metadata={proofMetadata}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
