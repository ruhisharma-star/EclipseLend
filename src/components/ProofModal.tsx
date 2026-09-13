'use client';

import React from 'react';
import { ProofStage } from '@/types';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ShieldAlert, 
  Lock, 
  Cpu, 
  KeyRound, 
  Send, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  stage: ProofStage;
  message: string;
  progressPercent: number;
  metadata?: any;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  isOpen,
  stage,
  message,
  progressPercent,
  metadata,
  onClose,
}) => {
  if (!isOpen) return null;

  const stages = [
    { key: 'sanitizing_witness', title: '1. Witness Data Ingestion', desc: 'Isolating private financial witness in local browser RAM' },
    { key: 'generating_constraints', title: '2. Compact Circuit Synthesis', desc: 'Generating R1CS & polynomial risk constraints' },
    { key: 'computing_zk_proof', title: '3. Zero-Knowledge Prover', desc: 'Computing Halo2 proof & blinding raw parameters' },
    { key: 'signing_lace_tx', title: '4. Midnight Lace Signature', desc: 'Signing Preprod transaction envelope' },
    { key: 'broadcasting_preprod', title: '5. Preprod Ledger Inclusion', desc: 'Submitting ZK proof and attesting credit tier' },
  ];

  const getStageIndex = (s: ProofStage) => {
    switch (s) {
      case 'sanitizing_witness': return 0;
      case 'generating_constraints': return 1;
      case 'computing_zk_proof': return 2;
      case 'signing_lace_tx': return 3;
      case 'broadcasting_preprod': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-titanium-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel border border-ice-400/30 p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-titanium-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-ice-500/10 border border-ice-400/30 text-ice-400 shadow-ice-sm">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Midnight Zero-Knowledge Proof Terminal</span>
              </h3>
              <p className="text-xs text-titanium-400 font-mono">Circuit: contracts/eclipse_lend.compact</p>
            </div>
          </div>
          {(stage === 'completed' || stage === 'failed') && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-titanium-400 hover:text-white hover:bg-titanium-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-titanium-300 font-medium">Proving Progress</span>
            <span className="font-mono font-bold text-ice-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-titanium-900 overflow-hidden border border-titanium-800">
            <div
              className="h-full bg-gradient-to-r from-ice-500 via-ice-400 to-ice-accent transition-all duration-500 rounded-full shadow-ice-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Pipeline Stage Tracker */}
        <div className="space-y-2.5">
          {stages.map((st, idx) => {
            const isDone = currentIndex > idx || stage === 'completed';
            const isCurrent = currentIndex === idx && stage !== 'completed' && stage !== 'failed';
            const isFailed = stage === 'failed' && currentIndex === idx;

            return (
              <div
                key={st.key}
                className={`p-3 rounded-xl transition-all border ${
                  isCurrent
                    ? 'bg-titanium-800/80 border-ice-400/50 shadow-ice-sm'
                    : isDone
                    ? 'bg-titanium-900/40 border-titanium-800 text-titanium-400'
                    : isFailed
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : 'bg-titanium-950/30 border-transparent text-titanium-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-ice-400 animate-spin shrink-0" />
                    ) : isFailed ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-titanium-700 shrink-0" />
                    )}
                    <div>
                      <span className={`text-xs font-semibold block ${isCurrent ? 'text-ice-200' : isDone ? 'text-titanium-300' : 'text-titanium-400'}`}>
                        {st.title}
                      </span>
                      <span className="text-[11px] text-titanium-400">{st.desc}</span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-ice-400/20 text-ice-300 animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Status Message & Cryptographic Output */}
        <div className="p-3.5 rounded-xl bg-titanium-950 border border-titanium-800 font-mono text-xs">
          <div className="flex items-center space-x-2 text-titanium-400 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-ice-400" />
            <span className="text-[11px] uppercase tracking-wider text-titanium-400">Terminal Log</span>
          </div>
          <div className="text-ice-300 break-words leading-relaxed">
            {stage === 'failed' ? (
              <span className="text-rose-400">{message}</span>
            ) : (
              message
            )}
          </div>
          {metadata?.txHash && (
            <div className="mt-2 pt-2 border-t border-titanium-900 flex items-center justify-between text-[11px]">
              <span className="text-titanium-400">Preprod TX Hash:</span>
              <span className="text-ice-400 truncate max-w-[240px]">{metadata.txHash}</span>
            </div>
          )}
        </div>

        {/* Action Button for completed/failed state */}
        {(stage === 'completed' || stage === 'failed') && (
          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition shadow-ice-sm ${
              stage === 'completed'
                ? 'bg-gradient-to-r from-ice-500 to-ice-600 text-titanium-950 hover:from-ice-400 hover:to-ice-500'
                : 'bg-titanium-800 text-white hover:bg-titanium-700'
            }`}
          >
            {stage === 'completed' ? 'Proceed to Vault Underwriting' : 'Dismiss and Retry'}
          </button>
        )}

      </div>
    </div>
  );
};
