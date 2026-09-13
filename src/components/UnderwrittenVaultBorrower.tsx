'use client';

import React, { useState, useEffect } from 'react';
import { CreditTier, VerificationLogEntry } from '@/types';
import { ProtocolStateManager, UserActiveLoan } from '@/lib/midnight/contractState';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface UnderwrittenVaultBorrowerProps {
  lastVerifiedProof: VerificationLogEntry | null;
}

export const UnderwrittenVaultBorrower: React.FC<UnderwrittenVaultBorrowerProps> = ({
  lastVerifiedProof,
}) => {
  const [activeLoan, setActiveLoan] = useState<UserActiveLoan | null>(null);
  const [borrowAmount, setBorrowAmount] = useState<number>(50000);
  const [repayAmount, setRepayAmount] = useState<number>(10000);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const manager = ProtocolStateManager.getInstance();

  useEffect(() => {
    const update = () => {
      setActiveLoan(manager.getUserLoan());
    };
    update();
    const unsub = manager.subscribe(update);
    return () => unsub();
  }, [manager]);

  const currentTier = lastVerifiedProof?.tier || (activeLoan ? activeLoan.tier : CreditTier.Platinum);
  const maxTierAllowance = 
    currentTier === CreditTier.Platinum ? 500000 :
    currentTier === CreditTier.Gold ? 100000 : 25000;

  const handleBorrow = () => {
    setActionSuccess(null);
    setActionError(null);
    try {
      const nullifier = lastVerifiedProof?.nullifier || activeLoan?.nullifier || '0x9e83f71c42b10a658d34e91275ca8301bf56294713aef8d90472e382b610fa12';
      manager.borrowCapital(nullifier, currentTier, borrowAmount);
      setActionSuccess(`Successfully drew $${borrowAmount.toLocaleString()} USD from liquidity pool to your shielded balance.`);
    } catch (err: any) {
      setActionError(err.message || 'Borrow failed');
    }
  };

  const handleRepay = () => {
    setActionSuccess(null);
    setActionError(null);
    try {
      manager.repayCapital(repayAmount);
      setActionSuccess(`Repayment of $${repayAmount.toLocaleString()} USD processed and pool liquidity restored.`);
    } catch (err: any) {
      setActionError(err.message || 'Repayment failed');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-ice-400/30 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-titanium-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-ice-500/10 border border-ice-400/30 text-ice-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Tier-Authorized Underwriting Vault</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-ice-500/20 text-ice-300 border border-ice-400/30">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-titanium-400">
              Draw confidential liquidity backed by your on-chain zero-knowledge credit attestation
            </p>
          </div>
        </div>

        {/* Current Verified Tier Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-titanium-400">Approved Tier:</span>
          <span className="px-3 py-1 text-xs font-bold font-mono rounded-lg bg-ice-400/20 text-ice-200 border border-ice-400/40 uppercase shadow-ice-sm">
            {currentTier} ($ {maxTierAllowance.toLocaleString()} Limit)
          </span>
        </div>
      </div>

      {/* Action Alerts */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Grid: Borrow Panel vs Active Loan Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Borrow Draw Form */}
        <div className="p-5 rounded-xl bg-titanium-900/80 border border-titanium-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-titanium-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <ArrowUpRight className="w-4 h-4 text-ice-400" />
              <span>Draw Liquidity</span>
            </span>
            <span className="text-[11px] font-mono text-titanium-400">
              Available: ${((maxTierAllowance) - (activeLoan?.borrowedAmountUSD || 0)).toLocaleString()} USD
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-titanium-300 font-medium">Borrow Amount (USD)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-titanium-950 border border-titanium-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-ice-400"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-titanium-950 border border-titanium-850 space-y-1.5 text-xs">
              <div className="flex justify-between text-titanium-400">
                <span>Fixed Preferential APR:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currentTier === CreditTier.Platinum ? '3.8%' : currentTier === CreditTier.Gold ? '4.9%' : '6.2%'}
                </span>
              </div>
              <div className="flex justify-between text-titanium-400">
                <span>Disbursement Destination:</span>
                <span className="font-mono text-ice-300">Shielded Preprod Balance</span>
              </div>
            </div>

            <button
              onClick={handleBorrow}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-ice-500 to-ice-600 hover:from-ice-400 hover:to-ice-500 text-titanium-950 transition shadow-ice-sm active:scale-95"
            >
              Draw Anonymous Loan to Shielded Address
            </button>
          </div>
        </div>

        {/* Right: Active Debt & Repayment Panel */}
        <div className="p-5 rounded-xl bg-titanium-900/80 border border-titanium-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-titanium-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>Active Outstanding Loan</span>
            </span>
            <span className="text-[11px] font-mono text-titanium-400">
              {activeLoan ? 'ACTIVE DEBT' : 'NO ACTIVE LOANS'}
            </span>
          </div>

          {activeLoan && activeLoan.borrowedAmountUSD > 0 ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-titanium-950 border border-titanium-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-titanium-400">Current Outstanding Debt:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    ${activeLoan.borrowedAmountUSD.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Loan Date:</span>
                  <span className="font-mono text-titanium-300">{activeLoan.loanDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-titanium-400">Interest Accrual Rate:</span>
                  <span className="font-mono text-emerald-400">{activeLoan.aprPercent}% APR</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-titanium-300 font-medium">Repay Amount (USD)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-xs text-titanium-500 font-mono">$</span>
                  <input
                    type="number"
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-titanium-950 border border-titanium-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-ice-400"
                  />
                </div>
              </div>

              <button
                onClick={handleRepay}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-titanium-800 hover:bg-titanium-700 text-ice-200 border border-ice-400/30 transition shadow-ice-sm"
              >
                Repay Loan & Clear Active Balance
              </button>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-titanium-600 mx-auto" />
              <p className="text-xs text-titanium-400">You currently have no active loan drawn against this pool.</p>
              <p className="text-[11px] text-titanium-500">Draw liquidity from the left panel at any time.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
