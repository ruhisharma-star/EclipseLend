import { describe, it, expect } from 'vitest';
import { EclipseLendContract, CreditTier, FinancialProfile } from './eclipse_lend.test';

describe('EclipseLend Underwriting Risk Engine & Witness Constraints', () => {
  it('11. Exact DTI Boundary Validation: Asserts DTI <= 25% boundary precisely for Platinum qualification', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(2_000_000n);

    // Exactly 25.0% DTI ($2,500 / $10,000) -> Should qualify for Platinum
    const exactPlatinumWitness: FinancialProfile = {
      creditScore: 780,
      reserveAssetsUSD: 50_000,
      monthlyIncomeUSD: 10_000,
      monthlyDebtUSD: 2_500,
      identitySalt: '0xexact_salt',
    };

    const res = contract.evaluateCreditTier('0xexact_plat', () => exactPlatinumWitness);
    expect(res.disclosedTier).toBe(CreditTier.Platinum);

    // 25.1% DTI ($2,510 / $10,000) -> Drops to Gold
    const overDtiWitness: FinancialProfile = {
      creditScore: 780,
      reserveAssetsUSD: 50_000,
      monthlyIncomeUSD: 10_000,
      monthlyDebtUSD: 2_510,
      identitySalt: '0xover_salt',
    };

    const res2 = contract.evaluateCreditTier('0xover_plat', () => overDtiWitness);
    expect(res2.disclosedTier).toBe(CreditTier.Gold);
  });

  it('12. Vault Liquidity Insolvency Protection: Rejects loans exceeding pool liquidity', () => {
    const contract = new EclipseLendContract();
    const SMALL_POOL = 100_000n; // Only $100k in pool
    contract.initializePool(SMALL_POOL);

    contract.evaluateCreditTier('0xplat_borrower', () => ({
      creditScore: 820,
      reserveAssetsUSD: 100_000,
      monthlyIncomeUSD: 20_000,
      monthlyDebtUSD: 1_000,
      identitySalt: '0xsalt',
    }));

    // Tier allowance is $500k, but pool only has $100k
    expect(() => {
      contract.requestLoan('0xplat_borrower', 200_000n);
    }).toThrow('Insufficient liquidity available in lending pool');

    // Borrowing available $80k succeeds
    expect(contract.requestLoan('0xplat_borrower', 80_000n)).toBe(true);
    expect(contract.ledger.poolLiquidity).toBe(20_000n);
  });

  it('13. Liquidity Provider Deposit Accumulation: Correctly reflects external deposits', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(500_000n);

    contract.depositLiquidity(250_000n);
    expect(contract.ledger.poolLiquidity).toBe(750_000n);

    contract.depositLiquidity(250_000n);
    expect(contract.ledger.poolLiquidity).toBe(1_000_000n);
  });

  it('14. Full Loan Repayment Cycle & Active Balance Clearance', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(1_000_000n);

    const borrowerNullifier = '0xcycle_borrower';
    contract.evaluateCreditTier(borrowerNullifier, () => ({
      creditScore: 750,
      reserveAssetsUSD: 30_000,
      monthlyIncomeUSD: 10_000,
      monthlyDebtUSD: 2_500,
      identitySalt: '0xcycle_salt',
    }));

    // Borrow $50,000
    contract.requestLoan(borrowerNullifier, 50_000n);
    expect(contract.ledger.activeLoanBalances.get(borrowerNullifier)).toBe(50_000n);
    expect(contract.ledger.poolLiquidity).toBe(950_000n);

    // Partial Repay $20,000
    contract.repayLoan(borrowerNullifier, 20_000n);
    expect(contract.ledger.activeLoanBalances.get(borrowerNullifier)).toBe(30_000n);
    expect(contract.ledger.poolLiquidity).toBe(970_000n);

    // Complete Repay $30,000
    contract.repayLoan(borrowerNullifier, 30_000n);
    expect(contract.ledger.activeLoanBalances.has(borrowerNullifier)).toBe(false);
    expect(contract.ledger.poolLiquidity).toBe(1_000_000n);
  });
});
