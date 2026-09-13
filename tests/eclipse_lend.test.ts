import { describe, it, expect, beforeEach } from 'vitest';

// Enum replicating Compact CreditTier
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

export interface LedgerState {
  poolLiquidity: bigint;
  totalVerifiedBorrowers: number;
  silverBorrowersCount: number;
  goldBorrowersCount: number;
  platinumBorrowersCount: number;
  totalLoansDisbursed: bigint;
  verifiedBorrowerTiers: Map<string, CreditTier>;
  activeLoanBalances: Map<string, bigint>;
  isPoolInitialized: boolean;
}

/**
 * Deterministic Zero-Knowledge Underwriting Circuit Simulator
 * Exact mirror of contracts/eclipse_lend.compact logic
 */
export class EclipseLendContract {
  public ledger: LedgerState;

  constructor() {
    this.ledger = {
      poolLiquidity: 0n,
      totalVerifiedBorrowers: 0,
      silverBorrowersCount: 0,
      goldBorrowersCount: 0,
      platinumBorrowersCount: 0,
      totalLoansDisbursed: 0n,
      verifiedBorrowerTiers: new Map<string, CreditTier>(),
      activeLoanBalances: new Map<string, bigint>(),
      isPoolInitialized: false,
    };
  }

  public initializePool(initialLiquidityUSD: bigint): void {
    if (this.ledger.isPoolInitialized) {
      throw new Error('Pool has already been initialized');
    }
    if (initialLiquidityUSD <= 0n) {
      throw new Error('Initial liquidity must be positive');
    }
    this.ledger.poolLiquidity = initialLiquidityUSD;
    this.ledger.isPoolInitialized = true;
  }

  public depositLiquidity(amountUSD: bigint): void {
    if (amountUSD <= 0n) {
      throw new Error('Deposit amount must be greater than zero');
    }
    this.ledger.poolLiquidity += amountUSD;
  }

  /**
   * Evaluates credit eligibility with private witness injection
   * Simulates ZK circuit evaluation and selective disclosure
   */
  public evaluateCreditTier(
    borrowerNullifier: string,
    witnessFn: () => FinancialProfile
  ): { disclosedTier: CreditTier; disclosedNullifier: string; publicDisclosuresOnly: boolean } {
    // 1. Private witness evaluation (local prover execution)
    const profile = witnessFn();

    // 2. Witness assertion constraints
    if (profile.creditScore < 300 || profile.creditScore > 850) {
      throw new Error('Credit score out of valid range (300-850)');
    }
    if (profile.monthlyIncomeUSD <= 0) {
      throw new Error('Monthly income must be strictly positive');
    }

    const dtiRatio = (profile.monthlyDebtUSD * 100) / profile.monthlyIncomeUSD;

    let evaluatedTier = CreditTier.Unqualified;
    if (profile.creditScore >= 780 && profile.reserveAssetsUSD >= 50000 && dtiRatio <= 25) {
      evaluatedTier = CreditTier.Platinum;
    } else if (profile.creditScore >= 720 && profile.reserveAssetsUSD >= 20000 && dtiRatio <= 35) {
      evaluatedTier = CreditTier.Gold;
    } else if (profile.creditScore >= 650 && profile.reserveAssetsUSD >= 5000 && dtiRatio <= 45) {
      evaluatedTier = CreditTier.Silver;
    }

    if (evaluatedTier === CreditTier.Unqualified) {
      throw new Error('Borrower does not meet minimum risk underwriting criteria');
    }

    // 3. Selective disclosure simulation: ONLY tier and nullifier leave the private boundary
    const disclosedTier = evaluatedTier;
    const disclosedNullifier = borrowerNullifier;

    // 4. Update ledger
    this.ledger.verifiedBorrowerTiers.set(disclosedNullifier, disclosedTier);
    this.ledger.totalVerifiedBorrowers += 1;

    if (disclosedTier === CreditTier.Platinum) {
      this.ledger.platinumBorrowersCount += 1;
    } else if (disclosedTier === CreditTier.Gold) {
      this.ledger.goldBorrowersCount += 1;
    } else if (disclosedTier === CreditTier.Silver) {
      this.ledger.silverBorrowersCount += 1;
    }

    return {
      disclosedTier,
      disclosedNullifier,
      publicDisclosuresOnly: true,
    };
  }

  public requestLoan(borrowerNullifier: string, requestedAmountUSD: bigint): boolean {
    const tier = this.ledger.verifiedBorrowerTiers.get(borrowerNullifier);
    if (!tier || tier === CreditTier.Unqualified) {
      throw new Error('Borrower has no verified credit tier on record');
    }

    let maxAllowance = 0n;
    if (tier === CreditTier.Platinum) maxAllowance = 500000n;
    else if (tier === CreditTier.Gold) maxAllowance = 100000n;
    else if (tier === CreditTier.Silver) maxAllowance = 25000n;

    const currentDebt = this.ledger.activeLoanBalances.get(borrowerNullifier) || 0n;

    if (currentDebt + requestedAmountUSD > maxAllowance) {
      throw new Error('Requested amount exceeds credit tier maximum borrowing capacity');
    }
    if (requestedAmountUSD > this.ledger.poolLiquidity) {
      throw new Error('Insufficient liquidity available in lending pool');
    }

    this.ledger.poolLiquidity -= requestedAmountUSD;
    this.ledger.totalLoansDisbursed += requestedAmountUSD;
    this.ledger.activeLoanBalances.set(borrowerNullifier, currentDebt + requestedAmountUSD);

    return true;
  }

  public repayLoan(borrowerNullifier: string, repayAmountUSD: bigint): boolean {
    const currentDebt = this.ledger.activeLoanBalances.get(borrowerNullifier);
    if (!currentDebt || currentDebt === 0n) {
      throw new Error('No active loan record for given nullifier');
    }
    if (repayAmountUSD <= 0n) {
      throw new Error('Repay amount must be greater than zero');
    }
    if (repayAmountUSD > currentDebt) {
      throw new Error('Repay amount exceeds outstanding loan balance');
    }

    const newDebt = currentDebt - repayAmountUSD;
    if (newDebt === 0n) {
      this.ledger.activeLoanBalances.delete(borrowerNullifier);
    } else {
      this.ledger.activeLoanBalances.set(borrowerNullifier, newDebt);
    }

    this.ledger.poolLiquidity += repayAmountUSD;
    return true;
  }
}

// ============================================================================
// COMPREHENSIVE TEST SUITE
// ============================================================================

describe('EclipseLend Zero-Knowledge Underwriting Protocol Suite', () => {
  let contract: EclipseLendContract;
  const INITIAL_VAULT_LIQUIDITY = 5_000_000n; // $5M initial liquidity

  beforeEach(() => {
    contract = new EclipseLendContract();
    contract.initializePool(INITIAL_VAULT_LIQUIDITY);
  });

  it('1. Should qualify for PLATINUM tier with credit score >= 780, strong reserves, and low DTI', () => {
    const platinumNullifier = '0x99e74c9df1b849281a8b417e2e8f00112233445566778899aabbccddeeff0011';
    const platinumWitness: FinancialProfile = {
      creditScore: 810,
      reserveAssetsUSD: 120_000,
      monthlyIncomeUSD: 14_000,
      monthlyDebtUSD: 2_100, // DTI = 15% (<= 25%)
      identitySalt: '0xa0f9e123456789abcdef0123456789abcdef0123456789abcdef0123456789ab',
    };

    const result = contract.evaluateCreditTier(platinumNullifier, () => platinumWitness);

    expect(result.disclosedTier).toBe(CreditTier.Platinum);
    expect(contract.ledger.totalVerifiedBorrowers).toBe(1);
    expect(contract.ledger.platinumBorrowersCount).toBe(1);
    expect(contract.ledger.goldBorrowersCount).toBe(0);
    expect(contract.ledger.silverBorrowersCount).toBe(0);
    expect(contract.ledger.verifiedBorrowerTiers.get(platinumNullifier)).toBe(CreditTier.Platinum);
  });

  it('2. Should qualify for GOLD tier with credit score >= 720, adequate reserves, and moderate DTI', () => {
    const goldNullifier = '0x88d63b8ce0a73817097a306d1d7e9900112233445566778899aabbccddeeff22';
    const goldWitness: FinancialProfile = {
      creditScore: 745,
      reserveAssetsUSD: 35_000,
      monthlyIncomeUSD: 9_000,
      monthlyDebtUSD: 2_700, // DTI = 30% (<= 35%)
      identitySalt: '0xb1e8d23456789abcdef0123456789abcdef0123456789abcdef0123456789bc',
    };

    const result = contract.evaluateCreditTier(goldNullifier, () => goldWitness);

    expect(result.disclosedTier).toBe(CreditTier.Gold);
    expect(contract.ledger.goldBorrowersCount).toBe(1);
    expect(contract.ledger.verifiedBorrowerTiers.get(goldNullifier)).toBe(CreditTier.Gold);
  });

  it('3. Should qualify for SILVER tier with baseline credit score >= 650', () => {
    const silverNullifier = '0x77c52a7bd996270608692f5c0c6d8800112233445566778899aabbccddeeff33';
    const silverWitness: FinancialProfile = {
      creditScore: 670,
      reserveAssetsUSD: 8_500,
      monthlyIncomeUSD: 5_000,
      monthlyDebtUSD: 2_000, // DTI = 40% (<= 45%)
      identitySalt: '0xc2d7c3456789abcdef0123456789abcdef0123456789abcdef0123456789cd',
    };

    const result = contract.evaluateCreditTier(silverNullifier, () => silverWitness);

    expect(result.disclosedTier).toBe(CreditTier.Silver);
    expect(contract.ledger.silverBorrowersCount).toBe(1);
    expect(contract.ledger.verifiedBorrowerTiers.get(silverNullifier)).toBe(CreditTier.Silver);
  });

  it('4. Should REJECT under-threshold applicants (Score < 650 or DTI > 45%) without polluting ledger', () => {
    const subprimeNullifier = '0x66b4196ac88516f5f7581e4bfa5c7700112233445566778899aabbccddeeff44';
    
    // Subprime score
    const lowScoreWitness: FinancialProfile = {
      creditScore: 590,
      reserveAssetsUSD: 4_000,
      monthlyIncomeUSD: 4_000,
      monthlyDebtUSD: 1_200,
      identitySalt: '0xd3c6b456789abcdef0123456789abcdef0123456789abcdef0123456789de',
    };

    expect(() => {
      contract.evaluateCreditTier(subprimeNullifier, () => lowScoreWitness);
    }).toThrow('Borrower does not meet minimum risk underwriting criteria');

    // High DTI ratio (> 45%)
    const highDtiWitness: FinancialProfile = {
      creditScore: 750,
      reserveAssetsUSD: 50_000,
      monthlyIncomeUSD: 6_000,
      monthlyDebtUSD: 3_600, // DTI = 60% > 45%
      identitySalt: '0xe4b5a56789abcdef0123456789abcdef0123456789abcdef0123456789ef',
    };

    expect(() => {
      contract.evaluateCreditTier(subprimeNullifier, () => highDtiWitness);
    }).toThrow('Borrower does not meet minimum risk underwriting criteria');

    // Ensure no borrower state was recorded
    expect(contract.ledger.totalVerifiedBorrowers).toBe(0);
    expect(contract.ledger.verifiedBorrowerTiers.has(subprimeNullifier)).toBe(false);
  });

  it('5. Strict Privacy Model: Verifies private witness data remains completely unexposed', () => {
    const nullifier = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const secretIncome = 25000;
    const secretReserves = 300000;
    const secretScore = 840;
    const secretSalt = '0xsecret_user_salt_123456789abcdef';

    const witness: FinancialProfile = {
      creditScore: secretScore,
      reserveAssetsUSD: secretReserves,
      monthlyIncomeUSD: secretIncome,
      monthlyDebtUSD: 1500,
      identitySalt: secretSalt,
    };

    const evaluation = contract.evaluateCreditTier(nullifier, () => witness);

    // Public output MUST only be the tier and nullifier
    expect(evaluation.disclosedTier).toBe(CreditTier.Platinum);
    expect(evaluation.disclosedNullifier).toBe(nullifier);

    // Ledger inspection: ensure no raw financial fields are anywhere in ledger state
    const ledgerJSON = JSON.stringify(contract.ledger, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );

    expect(ledgerJSON).not.toContain(secretIncome.toString());
    expect(ledgerJSON).not.toContain(secretReserves.toString());
    expect(ledgerJSON).not.toContain(secretScore.toString());
    expect(ledgerJSON).not.toContain(secretSalt);
  });

  it('6. Enforces Tier-based Borrow Limits ($500k Platinum, $100k Gold, $25k Silver) and Loan Repayment', () => {
    // Register Platinum borrower
    const platNullifier = '0xplat_borrower_01';
    contract.evaluateCreditTier(platNullifier, () => ({
      creditScore: 800,
      reserveAssetsUSD: 100_000,
      monthlyIncomeUSD: 20_000,
      monthlyDebtUSD: 2_000,
      identitySalt: '0xsalt1',
    }));

    // Register Silver borrower
    const silverNullifier = '0xsilver_borrower_01';
    contract.evaluateCreditTier(silverNullifier, () => ({
      creditScore: 660,
      reserveAssetsUSD: 6_000,
      monthlyIncomeUSD: 4_000,
      monthlyDebtUSD: 1_200,
      identitySalt: '0xsalt2',
    }));

    // Platinum borrows $400,000 (valid <= $500,000)
    contract.requestLoan(platNullifier, 400_000n);
    expect(contract.ledger.activeLoanBalances.get(platNullifier)).toBe(400_000n);
    expect(contract.ledger.poolLiquidity).toBe(INITIAL_VAULT_LIQUIDITY - 400_000n);

    // Platinum attempts to borrow an additional $150,000 (total $550k > $500k cap) -> Should fail
    expect(() => {
      contract.requestLoan(platNullifier, 150_000n);
    }).toThrow('Requested amount exceeds credit tier maximum borrowing capacity');

    // Silver attempts to borrow $50,000 (exceeds $25,000 cap) -> Should fail
    expect(() => {
      contract.requestLoan(silverNullifier, 50_000n);
    }).toThrow('Requested amount exceeds credit tier maximum borrowing capacity');

    // Silver borrows valid $20,000
    contract.requestLoan(silverNullifier, 20_000n);
    expect(contract.ledger.activeLoanBalances.get(silverNullifier)).toBe(20_000n);

    // Silver repays $10,000
    contract.repayLoan(silverNullifier, 10_000n);
    expect(contract.ledger.activeLoanBalances.get(silverNullifier)).toBe(10_000n);

    // Silver repays remaining $10,000 -> Loan cleared from active balances
    contract.repayLoan(silverNullifier, 10_000n);
    expect(contract.ledger.activeLoanBalances.has(silverNullifier)).toBe(false);
  });
});
