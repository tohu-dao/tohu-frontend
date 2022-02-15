import { ethers } from "ethers";
import { addresses, EPOCH_INTERVAL, MAX_RETRY_ATTEMPTS } from "../constants";
import { abi as OlympusStakingv2ABI } from "../abi/OlympusStakingv2.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { setAll, getTokenPrice, getMarketPrice, secondsUntilBlock, prettifySeconds } from "../helpers";
import apollo from "../lib/apolloClient";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { error } from "./MessagesSlice";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2, SOhmv2 } from "../typechain";
import { NetworkID } from "src/lib/Bond";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly ohmCirculatingSupply: string;
  readonly sOhmCirculatingSupply: string;
  readonly totalSupply: string;
  readonly ohmPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider, attempts = 0 }: IBaseAsyncThunk, { dispatch }) => {
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {};
    }

    try {
      const stakingContract = new ethers.Contract(
        addresses[networkID].STAKING_ADDRESS as string,
        OlympusStakingv2ABI,
        provider,
      ) as OlympusStakingv2;

      const sohmMainContract = new ethers.Contract(
        addresses[networkID].SOHM_ADDRESS as string,
        sOHMv2,
        provider,
      ) as SOhmv2;

      const [currentBlock, epoch, circ, currentIndex] = await Promise.all([
        provider.getBlockNumber(),
        stakingContract.epoch(),
        sohmMainContract.circulatingSupply(),
        stakingContract.index(),
      ]);

      const blockFifteenEpochsAgo = await provider.getBlock(currentBlock - EPOCH_INTERVAL * 15);
      const blockRateSeconds =
        (Date.now() / 1000 - blockFifteenEpochsAgo.timestamp) / (currentBlock - blockFifteenEpochsAgo.number);

      // Calculating staking
      const nRebasesFiveDays = (86400 * 5) / (blockRateSeconds * EPOCH_INTERVAL);
      const nRebasesYear = (86400 * 365) / (blockRateSeconds * EPOCH_INTERVAL);
      const stakingReward = epoch.distribute;
      const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
      const fiveDayRate = Math.pow(1 + stakingRebase, nRebasesFiveDays) - 1;
      const stakingAPY = Math.pow(1 + stakingRebase, nRebasesYear) - 1;
      const endBlock = epoch.endBlock;

      console.log(`Fantom Block Rate: ${blockRateSeconds} seconds`);
      return {
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        currentBlock,
        fiveDayRate,
        stakingAPY,
        stakingRebase,
        endBlock,
        blockRateSeconds,
      } as IAppData;
    } catch (e) {
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const newAttempts = attempts + 1;
        dispatch(loadAppDetails({ networkID, provider, attempts: newAttempts }));
      } else {
        if ([NetworkID.Mainnet, NetworkID.Testnet].includes(networkID)) {
          dispatch(error(`Failed to load app details. Please try refreshing the page.`));
        }
        throw e;
      }
    }
  },
);

export const loadGraphData = createAsyncThunk(
  "app/loadGraphData",
  async ({ attempts = 0 }: { attempts?: number }, { dispatch }) => {
    const protocolMetricsQuery = `
    query {
      _meta {
        block {
          number
        }
      }
      protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        timestamp
        ohmCirculatingSupply
        sOhmCirculatingSupply
        totalSupply
        ohmPrice
        marketCap
        totalValueLocked
        treasuryMarketValue
        nextEpochRebase
        nextDistributedOhm
      }
    }
  `;

    try {
      const graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);

      if (!graphData) {
        console.error("Returned a null response when querying TheGraph");
        return {};
      }

      const stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
      // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
      // NOTE (melondrone): this appears to work for us and is the same value as coingecko
      const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);

      const marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
      const circSupply = parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply);
      const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
      const treasuryMarketValue = parseFloat(graphData.data.protocolMetrics[0].treasuryMarketValue);
      // const currentBlock = parseFloat(graphData.data._meta.block.number);
      return {
        stakingTVL,
        marketCap,
        circSupply,
        totalSupply,
        treasuryMarketValue,
        marketPrice,
      } as IAppData;
    } catch (e) {
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const newAttempts = attempts + 1;
        dispatch(loadGraphData({ attempts: newAttempts }));
      } else {
        if ([NetworkID.Mainnet, NetworkID.Testnet].includes(networkID)) {
          dispatch(error(`Failed to load app details. Please try refreshing the page.`));
        }
        throw e;
      }
    }
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    let index;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }

    if (state.app.index && state.app.index > 1) {
      index = state.app.index;
    } else {
      const stakingContract = new ethers.Contract(
        addresses[networkID].STAKING_ADDRESS as string,
        OlympusStakingv2ABI,
        provider,
      ) as OlympusStakingv2;
      try {
        index = await stakingContract.index();
      } catch (e) {
        // handle error here
        console.error("Returned a null response from stakingContract.index()");
        return;
      }
      index = ethers.utils.formatUnits(index, "gwei");
    }
    return { marketPrice, wsExodPrice: marketPrice * index };
  },
);

export const refreshRebaseTimer = createAsyncThunk(
  "app/loadRebaseTimer",
  async ({ networkID, provider, attempts = 0 }: IBaseAsyncThunk, { dispatch, getState }) => {
    try {
      const state: any = getState();
      let blockRateSeconds = state.app.blockRateSeconds;

      const stakingContract = new ethers.Contract(
        addresses[networkID].STAKING_ADDRESS as string,
        OlympusStakingv2ABI,
        provider,
      ) as OlympusStakingv2;

      const [currentBlock, epoch] = await Promise.all([provider.getBlockNumber(), stakingContract.epoch()]);

      if (!blockRateSeconds) {
        const blockFifteenEpochsAgo = await provider.getBlock(currentBlock - EPOCH_INTERVAL * 15);
        blockRateSeconds =
          (Date.now() / 1000 - blockFifteenEpochsAgo.timestamp) / (currentBlock - blockFifteenEpochsAgo.number);
      }

      const seconds = secondsUntilBlock(currentBlock, epoch.endBlock, blockRateSeconds);

      return { secondsUntilRebase: seconds };
    } catch (e) {
      if (attempts < MAX_RETRY_ATTEMPTS) {
        const newAttempts = attempts + 1;
        dispatch(loadGraphData({ attempts: newAttempts }));
      } else {
        if ([NetworkID.Mainnet, NetworkID.Testnet].includes(networkID)) {
          dispatch(error(`Failed to load rebase timer. Please try refreshing the page.`));
        }
        throw e;
      }
    }
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
    marketPrice = marketPrice / Math.pow(10, 9);
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly endBlock?: number;
  readonly blockRateSeconds?: number;
  readonly secondsUntilRebase?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadGraphData.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadGraphData.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadGraphData.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(refreshRebaseTimer.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
