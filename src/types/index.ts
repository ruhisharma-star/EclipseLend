export enum CreditTier {
  Unqualified = 'Unqualified',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum'
}

export interface FinancialProfile {
  creditScore: number;
  reserveAssetsUSD: number;
  monthlyIncomeUSD: number;
  monthlyDebtUSD: number;
  identitySalt: string;
}

export interface VerificationLogEntry {
  id: string;
  txHash: string;
  blockHeight: number;
  nullifier: string;
  tier: CreditTier;
  maxBorrowLimitUSD: number;
  timestamp: string;
  proofDurationMs: number;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
}

export interface ProtocolStats {
  totalVaultLiquidityUSD: number;
  nightLiquidityUSD: number;
  dustLiquidityUSD: number;
  totalVerifiedBorrowers: number;
  totalLoansDisbursedUSD: number;
  protocolHealthFactor: number;
  platinumCount: number;
  goldCount: number;
  silverCount: number;
}

export type ProofStage = 
  | 'idle'
  | 'sanitizing_witness'
  | 'generating_constraints'
  | 'computing_zk_proof'
  | 'signing_lace_tx'
  | 'broadcasting_preprod'
  | 'completed'
  | 'failed';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  dustBalance: number;
  nightBalance: number;
  network: 'preprod' | 'testnet' | 'mock-sandbox';
  isLaceInstalled: boolean;
  walletName: string;
}
