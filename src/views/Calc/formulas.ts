export const calcYieldPercent = (rebaseRate: number, days: number) => {
  return Math.pow(1 + rebaseRate / 100, days * 3);
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
  const minDays = Math.ceil(
    Math.log(initialInvestment / (exodAmount * finalExodPrice)) / Math.log(1 + rebaseRate / 100) / 3,
  );
  return minDays > 0 ? minDays : 0;
};

export const calcMinimumPrice = (
  initialInvestment: number,
  rebaseRate: number,
  calcDays: number,
  exodAmount: number,
): number => {
  return initialInvestment / (Math.pow(1 + rebaseRate / 100, 3 * calcDays) * exodAmount);
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
