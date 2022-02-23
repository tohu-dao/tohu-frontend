import { useAppSelector } from "src/hooks";

export const useTreasuryMetrics = () => {
  return useAppSelector(state => state.app.treasuryMetrics);
};
