import { StableBond, LPBond, CustomBond } from "src/lib/Bond";
import { dai, wftm, wftm_old, the_monolith_lp, the_monolith_lp_old, gohm, fbeets, solid, wen, xopr } from "./BondDefinitions";

// Add new bonds to this array!!
export const allBonds: (StableBond | CustomBond | LPBond)[] = [dai, wftm, gohm, the_monolith_lp, fbeets, xopr];
export const allExpiredBonds: (StableBond | CustomBond | LPBond)[] = [the_monolith_lp_old, wftm_old];
export const allAbsorptionBonds: (StableBond | CustomBond | LPBond)[] = [wen];
export const allUpcomingBonds: (StableBond | CustomBond | LPBond)[] = [solid];

export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
