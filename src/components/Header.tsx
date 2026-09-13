'use client';

import React, { useEffect, useState } from 'react';
import { MidnightConnector } from '@/lib/midnight/connector';
import { MIDNIGHT_CONFIG } from '@/config/midnight.config';
import { WalletState } from '@/types';
import { 
  Shield, 
  Wallet, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  Sparkles,
  Layers,
  ChevronDown,
  FileCode2
} from 'lucide-react';

export const Header: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    dustBalance: 0,
    nightBalance: 0,
    network: 'preprod',
    isLaceInstalled: false,
    walletName: 'Midnight Lace Wallet',
  });
  const [copied, setCopied] = useState(false);
  const [contractCopied, setContractCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const connector = MidnightConnector.getInstance();
    const unsubscribe = connector.subscribe((updatedState) => {
      setWallet(updatedState);
    });
    return () => unsubscribe();
  }, []);

  const handleConnect = async () => {
    const connector = MidnightConnector.getInstance();
    if (wallet.isConnected) {
      connector.disconnect();
    } else {
      await connector.connect();
    }
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(MIDNIGHT_CONFIG.contractAddress);
    setContractCopied(true);
    setTimeout(() => setContractCopied(false), 2000);
  };

  const formatAddr = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  const formatContract = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ice-400/20 bg-titanium-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-ice-400/20 to-ice-600/10 border border-ice-400/30 shadow-ice-sm">
              <Shield className="w-6 h-6 text-ice-400" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-ice-500 border-2 border-titanium-950 flex items-center justify-center">
                <Lock className="w-2 h-2 text-titanium-950 stroke-[3]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-wider text-white font-mono">
                  ECLIPSE<span className="text-ice-400">LEND</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-ice-500/15 text-ice-300 border border-ice-400/30">
                  L3 ZK-ZK
                </span>
              </div>
              <p className="text-xs text-titanium-400">Midnight Confidential Underwriting Protocol</p>
            </div>
          </div>

          {/* Center Badges: Network & Canonical Contract ID */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Network Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-titanium-900 border border-ice-400/20 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-titanium-300 font-medium">Network:</span>
              <span className="text-ice-300 font-semibold font-mono">Midnight Preprod</span>
            </div>

            {/* Deployed Contract Address Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-titanium-900/80 border border-titanium-700 text-xs">
              <FileCode2 className="w-3.5 h-3.5 text-ice-400" />
              <span className="text-titanium-400">Contract ID:</span>
              <a
                href={`${MIDNIGHT_CONFIG.explorerUrl}/${MIDNIGHT_CONFIG.contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-ice-300 font-semibold hover:text-ice-200 transition flex items-center space-x-1"
                title="View on Midnight Explorer"
              >
                <span>{formatContract(MIDNIGHT_CONFIG.contractAddress)}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <button
                onClick={copyContractAddress}
                className="p-1 hover:text-ice-400 text-titanium-400 transition"
                title="Copy Contract Address"
              >
                {contractCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Right Actions: Wallet Connector */}
          <div className="flex items-center space-x-3">
            {wallet.isConnected && wallet.address ? (
              <div className="relative">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-titanium-900 border border-ice-400/30 hover:border-ice-400/60 transition shadow-ice-sm"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[11px] text-titanium-400 font-medium">Shielded Account</span>
                    <span className="text-xs font-mono font-semibold text-ice-200">
                      {formatAddr(wallet.address)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-titanium-400" />
                </button>

                {/* Dropdown Details */}
                {showDetails && (
                  <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl glass-panel shadow-2xl border border-ice-400/30 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-titanium-800">
                      <span className="text-xs font-semibold text-titanium-300">Wallet Connected</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {wallet.network}
                      </span>
                    </div>

                    {/* Address & Copy */}
                    <div className="mt-3 p-2.5 rounded-lg bg-titanium-950/80 border border-titanium-800 flex items-center justify-between">
                      <span className="font-mono text-xs text-ice-300 truncate max-w-[180px]">
                        {wallet.address}
                      </span>
                      <button
                        onClick={copyAddress}
                        className="p-1 hover:text-ice-400 text-titanium-400 transition"
                        title="Copy Address"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Balances */}
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-titanium-400">Shielded tDUST:</span>
                        <span className="font-mono font-bold text-ice-200">{wallet.dustBalance.toLocaleString()} tDUST</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-titanium-400">Governance NIGHT:</span>
                        <span className="font-mono font-bold text-ice-300">{wallet.nightBalance.toLocaleString()} NIGHT</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-titanium-800">
                      <button
                        onClick={handleConnect}
                        className="w-full py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition"
                      >
                        Disconnect Lace Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={wallet.isConnecting}
                className="relative group flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-ice-600 hover:from-ice-400 hover:to-ice-500 text-titanium-950 font-semibold text-sm transition shadow-ice-md hover:shadow-ice-lg active:scale-95 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4 text-titanium-950" />
                <span>{wallet.isConnecting ? 'Connecting...' : 'Connect Lace Wallet'}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
