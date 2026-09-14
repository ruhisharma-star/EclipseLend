// EclipseLend - Zero-Knowledge Private Underwriting Contract Witness Definitions
import { Ledger } from "./managed/bboard/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type EclipseLendPrivateState = {
  readonly creditScore: bigint;
  readonly reserveAssetsUSD: bigint;
  readonly monthlyIncomeUSD: number;
  readonly monthlyDebtUSD: number;
  readonly identitySalt: Uint8Array;
};

export const createEclipseLendPrivateState = (
  creditScore = 785n,
  reserveAssetsUSD = 65000n,
  monthlyIncomeUSD = 11000,
  monthlyDebtUSD = 2200,
  identitySalt = new Uint8Array(32)
): EclipseLendPrivateState => ({
  creditScore,
  reserveAssetsUSD,
  monthlyIncomeUSD,
  monthlyDebtUSD,
  identitySalt,
});

export const witnesses = {
  getBorrowerFinancials: ({
    privateState,
  }: WitnessContext<Ledger, EclipseLendPrivateState>): [
    EclipseLendPrivateState,
    {
      creditScore: bigint;
      reserveAssetsUSD: bigint;
      monthlyIncomeUSD: number;
      monthlyDebtUSD: number;
      identitySalt: Uint8Array;
    }
  ] => {
    const state = privateState ?? createEclipseLendPrivateState();
    return [
      state,
      {
        creditScore: state.creditScore,
        reserveAssetsUSD: state.reserveAssetsUSD,
        monthlyIncomeUSD: state.monthlyIncomeUSD,
        monthlyDebtUSD: state.monthlyDebtUSD,
        identitySalt: state.identitySalt,
      },
    ];
  },
};
