'use client';

import React from 'react';
import { ProtocolStats, CreditTier } from '@/types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Coins, 
  Award, 
  Lock, 
  Activity, 
  Zap, 
  Layers
} from 'lucide-react';

interface InstitutionalCreditHubProps {
  stats: ProtocolStats;
}

export const InstitutionalCreditHub: React.FC<InstitutionalCreditHubProps> = ({ stats }) => {
  return (
    <section className="space-y-6">
      
      {/* Top Banner / Hero Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Vault Liquidity */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-ice-400/40 transition">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-ice-500/10 blur-xl group-hover:bg-ice-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-titanium-400 uppercase tracking-wider">Vault Liquidity</span>
            <div className="p-2 rounded-lg bg-ice-500/10 border border-ice-400/20 text-ice-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              ${stats.totalVaultLiquidityUSD.toLocaleString()}
            </div>
            <div className="flex items-center mt-1 space-x-2 text-xs text-titanium-400">
              <span className="text-ice-400 font-mono font-medium">8.25M tDUST</span>
              <span>•</span>
              <span className="text-ice-300 font-mono font-medium">4.20M NIGHT</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Protocol Health Factor */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-titanium-400 uppercase tracking-wider">Health Factor</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight flex items-baseline space-x-1.5">
              <span>{stats.protocolHealthFactor.toFixed(2)}x</span>
              <span className="text-xs font-medium text-emerald-300/80">Optimal</span>
            </div>
            <p className="mt-1 text-xs text-titanium-400">0% Default / Algorithmic Proof Solvency</p>
          </div>
        </div>

        {/* Metric 3: Total Verified Borrowers */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-ice-400/40 transition">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-ice-500/10 blur-xl group-hover:bg-ice-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-titanium-400 uppercase tracking-wider">Verified Borrowers</span>
            <div className="p-2 rounded-lg bg-ice-500/10 border border-ice-400/20 text-ice-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {stats.totalVerifiedBorrowers}
            </div>
            <div className="flex items-center mt-1 space-x-1.5 text-[11px] text-titanium-400 font-mono">
              <span className="text-ice-200">{stats.platinumCount} Plat</span>
              <span>/</span>
              <span className="text-amber-400">{stats.goldCount} Gold</span>
              <span>/</span>
              <span className="text-slate-400">{stats.silverCount} Silv</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Loans Disbursed */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-titanium-400 uppercase tracking-wider">Disbursed Volume</span>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              ${stats.totalLoansDisbursedUSD.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-titanium-400">Active Anonymous Lines of Credit</p>
          </div>
        </div>

      </div>

      {/* Credit Tier Underwriting Specs */}
      <div className="glass-panel rounded-2xl p-6 border border-ice-400/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-titanium-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-ice-400" />
              <span>Institutional Underwriting Tier Matrix</span>
            </h3>
            <p className="text-xs text-titanium-400 mt-0.5">
              Smart contract enforces real-time liquidity draws strictly bounded by ZK verified credit tiers
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-ice-500/10 text-ice-300 border border-ice-400/30">
              <Lock className="w-3 h-3 mr-1 text-ice-400" />
              Private Witness Enforced
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          
          {/* Platinum Tier Card */}
          <div className="p-4 rounded-xl bg-titanium-900/80 border border-ice-400/40 relative overflow-hidden shadow-ice-sm">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-ice-400/20 text-ice-200 border border-ice-400/40 uppercase">
                Platinum Tier
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">3.8% APR</span>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono text-white">$500,000 USD</div>
              <p className="text-[11px] text-titanium-400">Max Credit Allocation Limit</p>
            </div>
            <div className="mt-3 pt-3 border-t border-titanium-800/80 space-y-1 text-xs text-titanium-300">
              <div className="flex justify-between">
                <span>Min Credit Score:</span>
                <span className="font-mono font-bold text-ice-300">780+</span>
              </div>
              <div className="flex justify-between">
                <span>Min Liquid Reserves:</span>
                <span className="font-mono font-bold text-ice-300">$50,000</span>
              </div>
              <div className="flex justify-between">
                <span>Max DTI Ratio:</span>
                <span className="font-mono font-bold text-ice-300">&le; 25%</span>
              </div>
            </div>
          </div>

          {/* Gold Tier Card */}
          <div className="p-4 rounded-xl bg-titanium-900/80 border border-amber-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Gold Tier
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">4.9% APR</span>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono text-white">$100,000 USD</div>
              <p className="text-[11px] text-titanium-400">Max Credit Allocation Limit</p>
            </div>
            <div className="mt-3 pt-3 border-t border-titanium-800/80 space-y-1 text-xs text-titanium-300">
              <div className="flex justify-between">
                <span>Min Credit Score:</span>
                <span className="font-mono font-bold text-amber-300">720+</span>
              </div>
              <div className="flex justify-between">
                <span>Min Liquid Reserves:</span>
                <span className="font-mono font-bold text-amber-300">$20,000</span>
              </div>
              <div className="flex justify-between">
                <span>Max DTI Ratio:</span>
                <span className="font-mono font-bold text-amber-300">&le; 35%</span>
              </div>
            </div>
          </div>

          {/* Silver Tier Card */}
          <div className="p-4 rounded-xl bg-titanium-900/80 border border-slate-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-slate-500/20 text-slate-300 border border-slate-500/40 uppercase">
                Silver Tier
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">6.2% APR</span>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono text-white">$25,000 USD</div>
              <p className="text-[11px] text-titanium-400">Max Credit Allocation Limit</p>
            </div>
            <div className="mt-3 pt-3 border-t border-titanium-800/80 space-y-1 text-xs text-titanium-300">
              <div className="flex justify-between">
                <span>Min Credit Score:</span>
                <span className="font-mono font-bold text-slate-300">650+</span>
              </div>
              <div className="flex justify-between">
                <span>Min Liquid Reserves:</span>
                <span className="font-mono font-bold text-slate-300">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span>Max DTI Ratio:</span>
                <span className="font-mono font-bold text-slate-300">&le; 45%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
