export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/exodiafinance/exodia-subgraph";
export const THE_GRAPH_URL_ETH = "https://api.thegraph.com/subgraphs/name/exodiafinance/exodia-eth-treasury";
export const EPOCH_INTERVAL = 28800;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 0.9;

export const TOKEN_DECIMALS = 9;

export const OHM_TICKER = "EXOD";
export const sOHM_TICKER = "sEXOD";
export const wsOHM_TICKER = "wsEXOD";

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  250: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  250: {
    // EXODIAAAAAAAAA
    DAI_ADDRESS: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", // OKAY
    OHM_ADDRESS: "0x3b57f3feaaf1e8254ec680275ee6e7727c7413c7", // OKAY
    STAKING_ADDRESS: "0x8b8d40f98a2f14e2dd972b3f2e2a2cc227d1e3be", // The new staking contract // OKAY
    STAKING_HELPER_ADDRESS: "0x43CdFC01C2DEF98C595b28E72b58D2575AA05E9B", // Helper contract used for Staking only // OKAY
    SOHM_ADDRESS: "0x8de250c65636ef02a75e4999890c91cecd38d03d", // OKAY
    DISTRIBUTOR_ADDRESS: "0xd8DA31efE8d83A8ae511D858A93524F14e66dd80", // OKAY
    BONDINGCALC_ADDRESS: "0x01884c8fba9e2c510093d2af308e7a8ba7060b8f", // OKAY
    CIRCULATING_SUPPLY_ADDRESS: "0x571ef9199c3559d2450d509a4bda1127f729d205", // OKAY
    TREASURY_ADDRESS: "0x6a654d988eebcd9ffb48ecd5af9bd79e090d8347", // OKAY
    REDEEM_HELPER_ADDRESS: "0x9d1530475b6282Bd92da5628E36052f70C56A208", // OKAY
    PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS // xxxIGNORExxx
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW // xxxIGNORExxx
    PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW // xxxIGNORExxx
  },
  4002: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    OHM_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    SOHM_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
    OLD_SOHM_ADDRESS: "0x8Fc4167B0bdA22cb9890af2dB6cB1B818D6068AE",
    MIGRATE_ADDRESS: "0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b", // NEW
  },
};
