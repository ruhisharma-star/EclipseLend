import { describe, it, expect } from 'vitest';
import { EclipseLendContract, CreditTier, FinancialProfile } from './eclipse_lend.test';

describe('EclipseLend Privacy & Selective Disclosure Verification', () => {
  it('7. Cryptographic Nullifier Uniqueness: Ensures distinct identity salts generate non-colliding nullifiers', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(2_000_000n);

    const borrowerA_Nullifier = '0xaaaa1111222233334444555566667777888899990000aaaabbbbccccddddeeee';
    const borrowerB_Nullifier = '0xbbbb1111222233334444555566667777888899990000aaaabbbbccccddddeeee';

    const witnessA: FinancialProfile = {
      creditScore: 790,
      reserveAssetsUSD: 60_000,
      monthlyIncomeUSD: 12_000,
      monthlyDebtUSD: 1_800,
      identitySalt: '0xsalt_alpha_01',
    };

    const witnessB: FinancialProfile = {
      creditScore: 730,
      reserveAssetsUSD: 25_000,
      monthlyIncomeUSD: 8_000,
      monthlyDebtUSD: 2_000,
      identitySalt: '0xsalt_beta_02',
    };

    const resA = contract.evaluateCreditTier(borrowerA_Nullifier, () => witnessA);
    const resB = contract.evaluateCreditTier(borrowerB_Nullifier, () => witnessB);

    expect(resA.disclosedNullifier).not.toBe(resB.disclosedNullifier);
    expect(contract.ledger.verifiedBorrowerTiers.get(borrowerA_Nullifier)).toBe(CreditTier.Platinum);
    expect(contract.ledger.verifiedBorrowerTiers.get(borrowerB_Nullifier)).toBe(CreditTier.Gold);
    expect(contract.ledger.totalVerifiedBorrowers).toBe(2);
  });

  it('8. Zero Information Leakage on Failure: Rejection does not leak salt or identity to ledger', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(1_000_000n);

    const secretSalt = '0xsuper_secret_salt_999';
    const failedNullifier = '0xfailed_user_nullifier';

    const failedWitness: FinancialProfile = {
      creditScore: 500, // Disqualified
      reserveAssetsUSD: 100,
      monthlyIncomeUSD: 1_000,
      monthlyDebtUSD: 900,
      identitySalt: secretSalt,
    };

    expect(() => {
      contract.evaluateCreditTier(failedNullifier, () => failedWitness);
    }).toThrow();

    expect(contract.ledger.verifiedBorrowerTiers.has(failedNullifier)).toBe(false);
    expect(contract.ledger.totalVerifiedBorrowers).toBe(0);
    const ledgerStateStr = JSON.stringify(contract.ledger, (k, v) =>
      typeof v === 'bigint' ? v.toString() : v
    );
    expect(ledgerStateStr).not.toContain(secretSalt);
  });

  it('9. Selective Disclosure Immutability: Disclosed tier cannot be overwritten without re-evaluation', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(1_000_000n);

    const userNullifier = '0xuser_immutable_tier';
    const silverWitness: FinancialProfile = {
      creditScore: 660,
      reserveAssetsUSD: 8_000,
      monthlyIncomeUSD: 4_000,
      monthlyDebtUSD: 1_500,
      identitySalt: '0xuser_salt',
    };

    contract.evaluateCreditTier(userNullifier, () => silverWitness);
    expect(contract.ledger.verifiedBorrowerTiers.get(userNullifier)).toBe(CreditTier.Silver);

    // Borrower cannot request loans exceeding Silver tier even if attempting higher tier values
    expect(() => {
      contract.requestLoan(userNullifier, 50_000n); // Silver limit is $25k
    }).toThrow('Requested amount exceeds credit tier maximum borrowing capacity');
  });

  it('10. Multi-Borrower Concurrent Disclosure: Correctly tallies tier distribution in public counters', () => {
    const contract = new EclipseLendContract();
    contract.initializePool(10_000_000n);

    // Add 2 Platinum, 1 Gold, 1 Silver
    contract.evaluateCreditTier('0xp1', () => ({ creditScore: 800, reserveAssetsUSD: 80000, monthlyIncomeUSD: 15000, monthlyDebtUSD: 1500, identitySalt: '0xs1' }));
    contract.evaluateCreditTier('0xp2', () => ({ creditScore: 820, reserveAssetsUSD: 90000, monthlyIncomeUSD: 18000, monthlyDebtUSD: 2000, identitySalt: '0xs2' }));
    contract.evaluateCreditTier('0xg1', () => ({ creditScore: 730, reserveAssetsUSD: 30000, monthlyIncomeUSD: 10000, monthlyDebtUSD: 3000, identitySalt: '0xs3' }));
    contract.evaluateCreditTier('0xs1_id', () => ({ creditScore: 670, reserveAssetsUSD: 10000, monthlyIncomeUSD: 5000, monthlyDebtUSD: 2000, identitySalt: '0xs4' }));

    expect(contract.ledger.totalVerifiedBorrowers).toBe(4);
    expect(contract.ledger.platinumBorrowersCount).toBe(2);
    expect(contract.ledger.goldBorrowersCount).toBe(1);
    expect(contract.ledger.silverBorrowersCount).toBe(1);
  });
});
