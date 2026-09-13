import { CreditTier, ProtocolStats, VerificationLogEntry } from '@/types';

const STATS_KEY = 'eclipselend_protocol_stats';
const LOGS_KEY = 'eclipselend_credit_logs';
const LOANS_KEY = 'eclipselend_user_loans';

const INITIAL_STATS: ProtocolStats = {
  totalVaultLiquidityUSD: 12_450_000,
  nightLiquidityUSD: 4_200_000,
  dustLiquidityUSD: 8_250_000,
  totalVerifiedBorrowers: 142,
  totalLoansDisbursedUSD: 3_890_000,
  protocolHealthFactor: 1.84,
  platinumCount: 48,
  goldCount: 65,
  silverCount: 29,
};

const INITIAL_LOGS: VerificationLogEntry[] = [
  {
    id: 'log-1',
    txHash: '0x8f2d9e1c3b4a567890abcdef1234567890abcdef1234567890abcdef12345678',
    blockHeight: 482902,
    nullifier: '0x9e83f71c42b10a658d34e91275ca8301bf56294713aef8d90472e382b610fa12',
    tier: CreditTier.Platinum,
    maxBorrowLimitUSD: 500000,
    timestamp: '2 mins ago',
    proofDurationMs: 2450,
    status: 'CONFIRMED',
  },
  {
    id: 'log-2',
    txHash: '0x3a7b1c9d8e5f0123456789abcdef0123456789abcdef0123456789abcdef0123',
    blockHeight: 482898,
    nullifier: '0x77c52a7bd996270608692f5c0c6d8800112233445566778899aabbccddeeff33',
    tier: CreditTier.Gold,
    maxBorrowLimitUSD: 100000,
    timestamp: '14 mins ago',
    proofDurationMs: 2310,
    status: 'CONFIRMED',
  },
  {
    id: 'log-3',
    txHash: '0x1c2d3e4f5a6b7890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockHeight: 482885,
    nullifier: '0x44d18e9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
    tier: CreditTier.Silver,
    maxBorrowLimitUSD: 25000,
    timestamp: '38 mins ago',
    proofDurationMs: 2680,
    status: 'CONFIRMED',
  },
  {
    id: 'log-4',
    txHash: '0x99a8b7c6d5e4f3210987654321fedcba0987654321fedcba0987654321fedcba',
    blockHeight: 482860,
    nullifier: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    tier: CreditTier.Platinum,
    maxBorrowLimitUSD: 500000,
    timestamp: '1 hour ago',
    proofDurationMs: 2510,
    status: 'CONFIRMED',
  },
];

export interface UserActiveLoan {
  nullifier: string;
  tier: CreditTier;
  borrowedAmountUSD: number;
  maxLimitUSD: number;
  aprPercent: number;
  loanDate: string;
}

export class ProtocolStateManager {
  private static instance: ProtocolStateManager;
  private stats: ProtocolStats = INITIAL_STATS;
  private logs: VerificationLogEntry[] = INITIAL_LOGS;
  private userLoan: UserActiveLoan | null = null;
  private listeners: (() => void)[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  public static getInstance(): ProtocolStateManager {
    if (!ProtocolStateManager.instance) {
      ProtocolStateManager.instance = new ProtocolStateManager();
    }
    return ProtocolStateManager.instance;
  }

  private loadFromStorage() {
    try {
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) this.stats = JSON.parse(savedStats);

      const savedLogs = localStorage.getItem(LOGS_KEY);
      if (savedLogs) this.logs = JSON.parse(savedLogs);

      const savedLoan = localStorage.getItem(LOANS_KEY);
      if (savedLoan) this.userLoan = JSON.parse(savedLoan);
    } catch (e) {
      console.warn('Storage read warning', e);
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats));
      localStorage.setItem(LOGS_KEY, JSON.stringify(this.logs));
      if (this.userLoan) {
        localStorage.setItem(LOANS_KEY, JSON.stringify(this.userLoan));
      } else {
        localStorage.removeItem(LOANS_KEY);
      }
    } catch (e) {
      console.warn('Storage write warning', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.persist();
    this.listeners.forEach((l) => l());
  }

  public getStats(): ProtocolStats {
    return { ...this.stats };
  }

  public getLogs(): VerificationLogEntry[] {
    return [...this.logs];
  }

  public getUserLoan(): UserActiveLoan | null {
    return this.userLoan ? { ...this.userLoan } : null;
  }

  public recordVerifiedAttestation(entry: VerificationLogEntry): void {
    this.logs = [entry, ...this.logs];
    this.stats.totalVerifiedBorrowers += 1;

    if (entry.tier === CreditTier.Platinum) this.stats.platinumCount += 1;
    if (entry.tier === CreditTier.Gold) this.stats.goldCount += 1;
    if (entry.tier === CreditTier.Silver) this.stats.silverCount += 1;

    this.notify();
  }

  public borrowCapital(nullifier: string, tier: CreditTier, amountUSD: number): boolean {
    let maxCap = 25000;
    let apr = 6.2;
    if (tier === CreditTier.Platinum) {
      maxCap = 500000;
      apr = 3.8;
    } else if (tier === CreditTier.Gold) {
      maxCap = 100000;
      apr = 4.9;
    }

    const currentBorrowed = this.userLoan?.borrowedAmountUSD || 0;
    if (currentBorrowed + amountUSD > maxCap) {
      throw new Error(`Borrow request exceeds maximum approved limit of $${maxCap.toLocaleString()}`);
    }
    if (amountUSD > this.stats.totalVaultLiquidityUSD) {
      throw new Error('Vault liquidity insufficient for this borrow size');
    }

    this.userLoan = {
      nullifier,
      tier,
      borrowedAmountUSD: currentBorrowed + amountUSD,
      maxLimitUSD: maxCap,
      aprPercent: apr,
      loanDate: new Date().toLocaleDateString(),
    };

    this.stats.totalVaultLiquidityUSD -= amountUSD;
    this.stats.totalLoansDisbursedUSD += amountUSD;

    this.notify();
    return true;
  }

  public repayCapital(amountUSD: number): boolean {
    if (!this.userLoan || this.userLoan.borrowedAmountUSD <= 0) {
      throw new Error('No outstanding loan to repay');
    }
    if (amountUSD > this.userLoan.borrowedAmountUSD) {
      throw new Error('Repay amount exceeds total outstanding debt');
    }

    const remaining = this.userLoan.borrowedAmountUSD - amountUSD;
    if (remaining === 0) {
      this.userLoan = null;
    } else {
      this.userLoan.borrowedAmountUSD = remaining;
    }

    this.stats.totalVaultLiquidityUSD += amountUSD;
    this.notify();
    return true;
  }
}
