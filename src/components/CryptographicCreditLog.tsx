'use client';

import React from 'react';
import { VerificationLogEntry, CreditTier } from '@/types';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Cpu, 
  Layers,
  Sparkles
} from 'lucide-react';

interface CryptographicCreditLogProps {
  logs: VerificationLogEntry[];
}

export const CryptographicCreditLog: React.FC<CryptographicCreditLogProps> = ({ logs }) => {
  const formatHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-ice-400/30 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-titanium-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-ice-500/10 border border-ice-400/30 text-ice-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Cryptographic Credit Attestation Log</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE PREPROD
              </span>
            </h3>
            <p className="text-xs text-titanium-400">
              Verified zero-knowledge credit proofs committed to the Midnight Preprod testnet ledger
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-titanium-400">
          <Clock className="w-3.5 h-3.5 text-ice-400" />
          <span>Real-time on-chain verification stream</span>
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-titanium-800/80 text-titanium-400 font-mono text-[11px] uppercase">
              <th className="pb-3 font-semibold">Preprod TX Hash</th>
              <th className="pb-3 font-semibold">Block</th>
              <th className="pb-3 font-semibold">Anonymous Nullifier</th>
              <th className="pb-3 font-semibold">Disclosed Tier</th>
              <th className="pb-3 font-semibold">Credit Limit</th>
              <th className="pb-3 font-semibold">ZK Prover Time</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-titanium-800/50">
            {logs.map((entry) => (
              <tr key={entry.id} className="hover:bg-titanium-900/40 transition">
                
                {/* TX Hash */}
                <td className="py-3.5 pr-4">
                  <a
                    href={`https://explorer.preprod.midnight.network/tx/${entry.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 font-mono text-ice-300 hover:text-ice-200 transition"
                  >
                    <span>{formatHash(entry.txHash)}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 hover:opacity-100" />
                  </a>
                </td>

                {/* Block */}
                <td className="py-3.5 pr-4 font-mono text-titanium-300">
                  #{entry.blockHeight}
                </td>

                {/* Nullifier */}
                <td className="py-3.5 pr-4 font-mono text-titanium-400">
                  {formatHash(entry.nullifier)}
                </td>

                {/* Tier */}
                <td className="py-3.5 pr-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    entry.tier === CreditTier.Platinum
                      ? 'bg-ice-400/20 text-ice-200 border border-ice-400/30'
                      : entry.tier === CreditTier.Gold
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {entry.tier}
                  </span>
                </td>

                {/* Max Credit */}
                <td className="py-3.5 pr-4 font-mono font-bold text-white">
                  ${entry.maxBorrowLimitUSD.toLocaleString()}
                </td>

                {/* ZK Prover time */}
                <td className="py-3.5 pr-4 font-mono text-titanium-400">
                  {(entry.proofDurationMs / 1000).toFixed(2)}s
                </td>

                {/* Status */}
                <td className="py-3.5 text-right">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{entry.status}</span>
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
