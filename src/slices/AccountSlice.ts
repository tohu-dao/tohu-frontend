import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses, MAX_RETRY_ATTEMPTS } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { error } from "./MessagesSlice";
import { setAll } from "../helpers";
import { NetworkID } from "src/lib/Bond";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { IERC20, SOhmv2, WsOHM } from "src/typechain";

interface IUserBalances {
  balances: {
    ohm: string;
    sohm: string;
    wsohm: string;
    wsohmAsSohm: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider, attempts = 0 }: IBaseAddressAsyncThunk, { dispatch }) => {
    try {
      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      const sohmContract = new ethers.Contract(
        addresses[networkID].SOHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;

      /*const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS as string,
        ierc20Abi,
        provider,
        ) as IERC20;
      const poolBalance = await poolTokenContract.balanceOf(address);
      */

      const [ohm, sohm, wsohm] = await Promise.all([
        ohmContract.balanceOf(address),
        sohmContract.balanceOf(address),
        wsohmContract.balanceOf(address),
      ]);
      // NOTE (appleseed): wsohmAsSohm is wsOHM given as a quantity of sOHM
      const wsohmAsSohm = await wsohmContract.sOHMValue(wsohm);

      return {
        balances: {
          ohm: ethers.utils.formatUnits(ohm, "gwei"),
          sohm: ethers.utils.formatUnits(sohm, "gwei"),
          wsohm: ethers.utils.formatEther(wsohm),
          wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
          pool: 0, //ethers.utils.formatUnits(poolBalance, "gwei"),
        },
      };
    } catch (e) {
      if (attempts < 0) return;
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const newAttempts = attempts + 1;
        dispatch(getBalances({ networkID, provider, address, attempts: newAttempts }));
      } else {
        if ([NetworkID.Mainnet, NetworkID.Testnet].includes(networkID)) {
          dispatch(error(`Failed to load your account balances. Please try refreshing the page.`));
        }
        throw e;
      }
    }
  },
);

interface IUserAccountDetails {
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  wrapping: {
    sohmWrap: number;
    ohmWrap: number;
    wsohmUnwrap: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address, attempts = 0 }: IBaseAddressAsyncThunk, { dispatch }) => {
    try {
      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider) as SOhmv2;
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;

      //const poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);

      const [ohmStake, ohmUnstake, sohmWrap, ohmWrap, unwrapAllowance] = await Promise.all([
        ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS),
        sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS),
        sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS),
        ohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS),
        wsohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS),
      ]);
      dispatch(getBalances({ address, networkID, provider }));

      return {
        staking: {
          ohmStake: +ohmStake,
          ohmUnstake: +ohmUnstake,
        },
        wrapping: {
          sohmWrap: +sohmWrap,
          ohmWrap: +ohmWrap,
          ohmUnwrap: +unwrapAllowance,
        },
        pooling: {
          sohmPool: +0,
        },
      };
    } catch (e) {
      if (attempts < 0) return;
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const newAttempts = attempts + 1;
        dispatch(loadAccountDetails({ networkID, provider, address, attempts: newAttempts }));
      } else {
        if ([NetworkID.Mainnet, NetworkID.Testnet].includes(networkID)) {
          dispatch(error(`Failed to load your account allowances. Please try refreshing the page.`));
        }
        throw e;
      }
    }
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider, attempts = 0 }: ICalcUserBondDetailsAsyncThunk, { dispatch }) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        isMonolith: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }

    try {
      // dispatch(fetchBondInProgress());

      // Calculate bond details.
      const bondContract = bond.getContractForBond(networkID, provider);
      const reserveContract = bond.getContractForReserve(networkID, provider);

      let pendingPayout, bondMaturationBlock, bondDetails;
      let allowance,
        balance = BigNumber.from(0);

      [bondDetails, pendingPayout, allowance, balance] = await Promise.all([
        bondContract.bondInfo(address),
        bondContract.pendingPayoutFor(address),
        reserveContract.allowance(address, bond.getAddressForBond(networkID)),
        reserveContract.balanceOf(address),
      ]);

      let interestDue: BigNumberish = Number(ethers.utils.formatUnits(bondDetails.payout, bond.outputDecimals));
      bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;

      // formatEthers takes BigNumber => String
      const balanceVal = ethers.utils.formatUnits(balance, bond.inputDecimals);

      // balanceVal should NOT be converted to a number. it loses decimal precision
      return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        isAbsorption: bond.isAbsorption,
        isMonolith: bond.isMonolith,
        allowance: Number(allowance.toString()),
        balance: balanceVal,
        interestDue,
        bondMaturationBlock,
        pendingPayout: ethers.utils.formatUnits(pendingPayout, bond.outputDecimals),
      };
    } catch (e) {
      if (attempts < 0) return;
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const newAttempts = attempts + 1;
        dispatch(calculateUserBondDetails({ address, bond, networkID, provider, attempts: newAttempts }));
      } else {
        if ([NetworkID.Mainnet, NetworkID.Testnet].includes(networkID)) {
          dispatch(error(`Failed to load ${bond.name} details. Please try refreshing the page.`));
        }
        throw e;
      }
    }
  },
);

interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    wsohm: string;
    wsohmAsSohm: string;
    pool: string;
  };
  loading: boolean;
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  pooling: {
    sohmPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", wsohmAsSohm: "", wsohm: "", pool: "" },
  staking: { ohmStake: 0, ohmUnstake: 0 },
  wrapping: { sohmWrap: 0, wsohmUnwrap: 0 },
  pooling: { sohmPool: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
