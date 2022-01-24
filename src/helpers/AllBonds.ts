import { StableBond, LPBond, CustomBond } from "src/lib/Bond";
import { dai, eth, the_monolith_lp, the_monolith_lp_old, gohm, fbeets, solid } from "./BondDefinitions";

// Add new bonds to this array!!
export const allBonds: (StableBond | CustomBond | LPBond)[] = [dai, eth, gohm, the_monolith_lp];
export const allExpiredBonds: (StableBond | CustomBond | LPBond)[] = [the_monolith_lp_old];
export const allUpcomingBonds: (StableBond | CustomBond | LPBond)[] = [fbeets, solid];

export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
