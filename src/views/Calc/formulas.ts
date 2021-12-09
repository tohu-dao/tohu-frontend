import { BLOCK_RATE_SECONDS, EPOCH_INTERVAL } from "src/constants";

export const calcYieldPercent = (rebaseRate: number, days: number) => {
  const nRebases = 86400 * days / (BLOCK_RATE_SECONDS * EPOCH_INTERVAL)
  return Math.pow(1 + rebaseRate / 100, nRebases);
};

export const calcTotalReturns = (exodAmount: number, finalExodPrice: number, yieldPercent: number): number => {
  return exodAmount * yieldPercent * finalExodPrice;
};

export const calcInitialInvestment = (exodAmount: number, purchasePrice: number): number => {
  return exodAmount * purchasePrice;
};

export const calcMinimumDays = (
  initialInvestment: number,
  exodAmount: number,
  finalExodPrice: number,
  rebaseRate: number,
): number => {
  const minRebases = Math.log(initialInvestment / (exodAmount * finalExodPrice)) / Math.log(1 + rebaseRate / 100);
  const minDays = Math.ceil((minRebases * EPOCH_INTERVAL * BLOCK_RATE_SECONDS) / 86400);
  return minDays > 0 ? minDays : 0;
};

export const calcMinimumPrice = (
  initialInvestment: number,
  rebaseRate: number,
  calcDays: number,
  exodAmount: number,
): number => {
  const nRebases = 86400 * calcDays / (BLOCK_RATE_SECONDS * EPOCH_INTERVAL);
  return initialInvestment / (Math.pow(1 + rebaseRate / 100, nRebases) * exodAmount);
};

export const calcRoi = (totalReturns: number, initialInvestment: number): number => {
  return totalReturns / initialInvestment;
};

export const calcProfits = (totalReturns: number, initialInvestment: number): number => {
  return totalReturns - initialInvestment;
};

export const calcTotalExod = (exodAmount: number, yieldPercent: number): number => {
  return exodAmount * yieldPercent;
};
