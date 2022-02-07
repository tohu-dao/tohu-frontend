import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds, { allExpiredBonds, allUpcomingBonds, allAbsorptionBonds } from "src/helpers/AllBonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";

interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding: {
    loading: Boolean;
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the BondData Type
export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}

const initialBondArray = allBonds;
const initialExpiredArray = allExpiredBonds;
const initialUpcommingArray = allUpcomingBonds;
const initialAbsorptionArray = allAbsorptionBonds;

// Slaps together bond data within the account & bonding states
function useBonds(chainID: number) {
  const [bonds, setBonds] = useState<Bond[] | IAllBondData[]>(initialBondArray);
  const [expiredBonds, setExpiredBonds] = useState<Bond[] | IAllBondData[]>(initialExpiredArray);
  const [absorptionBonds, setAbsorptionBonds] = useState<Bond[] | IAllBondData[]>(initialAbsorptionArray);
  const [upcomingBonds] = useState<Bond[] | IAllBondData[]>(initialUpcommingArray);

  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const accountBondsState = useSelector((state: IBondingStateView) => state.account.bonds);

  const mapBondStateToBond = (initialBond: any) => {
    if (bondState[initialBond.name] && bondState[initialBond.name].bondPrice) {
      return Object.assign(initialBond, bondState[initialBond.name]); // Keeps the object type
    }
    return initialBond;
  };
  const mapAccountStateToBond = (initialBond: any) => {
    if (accountBondsState[initialBond.name]) {
      return Object.assign(initialBond, accountBondsState[initialBond.name]);
    }
    return initialBond;
  };

  const sortMostProfitableBonds = (a: IAllBondData, b: IAllBondData) => {
    if (a.getAvailability(chainID) === false) return 1;
    if (b.getAvailability(chainID) === false) return -1;
    return a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
  };

  useEffect(() => {
    const bondDetails: IAllBondData[] = allBonds.flatMap(mapBondStateToBond).flatMap(mapAccountStateToBond);
    const expiredDetails: IAllBondData[] = allExpiredBonds.flatMap(mapBondStateToBond).flatMap(mapAccountStateToBond);
    const absorptionDetails: IAllBondData[] = allAbsorptionBonds
      .flatMap(mapBondStateToBond)
      .flatMap(mapAccountStateToBond);

    const mostProfitableBonds = bondDetails.concat().sort(sortMostProfitableBonds);

    setBonds(mostProfitableBonds);
    setExpiredBonds(expiredDetails);
    setAbsorptionBonds(absorptionDetails);
    // console.log(absorptionDetails);
  }, [bondState, accountBondsState, bondLoading]);

  return { bonds, loading: bondLoading, expiredBonds, upcomingBonds, absorptionBonds };
}

export default useBonds;
