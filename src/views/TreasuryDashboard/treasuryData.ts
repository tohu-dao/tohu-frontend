import { t } from "@lingui/macro";

// TODO: add paramaterization
export const treasuryDataQuery = `
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedOhm
    treasuryDaiRiskFreeValue
    treasuryDaiMarketValue
    treasuryWETHMarketValue
    treasuryGOhmBalance
    treasuryGOhmMarketValue
    treasuryMaiBalance
    treasuryMonolithTotalPoolValue
    treasuryMonolithMaiValue
    treasuryMonolithMaiBalance
    treasuryMonolithExodValue
    treasuryMonolithExodBalance
    treasuryMonolithWsExodValue
    treasuryMonolithWsExodBalance
    treasuryMonolithWFtmValue
    treasuryMonolithWFtmBalance
    treasuryMonolithGOhmValue
    treasuryMonolithGOhmBalance
    currentAPY
    runway10k
    runway20k
    runway50k
    runway7dot5k
    runway5k
    runway2dot5k
    runwayCurrent
    holders
    treasuryOhmDaiPOL
    index
    ohmMinted
  }
}
`;

export const rebasesDataQuery = `
query {
  rebases(orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}
`;

export const treasuryOhmQuery = `
query {
  balances(first: 100, orderBy: timestamp, orderDirection: desc) {
    sOHMBalanceUSD
    gOhmPrice
  }
}
`;

export const debtQuery = `
query {
  bondDiscounts(first: 1000, orderBy: timestamp, orderDirection: desc) {
    dai_debt_ratio
    eth_debt_ratio
    ohmdai_debt_ratio
    timestamp
  }
}
`;

// export default treasuryData;
export const bulletpoints = {
  tvl: [
    {
      right: 20,
      top: -12,
    },
  ],
  coin: [
    {
      right: 15,
      top: -12,
    },
    {
      right: 25,
      top: -12,
    },
    {
      right: 29,
      top: -12,
    },
    {
      right: 29,
      top: -12,
    },
    {
      right: 29,
      top: -12,
    },
  ],
  rfv: [
    {
      right: 15,
      top: -12,
    },
    {
      right: 25,
      top: -12,
    },
    {
      right: 29,
      top: -12,
    },
  ],
  holder: [
    {
      right: 40,
      top: -12,
    },
  ],
  apy: [
    {
      right: 20,
      top: -12,
    },
  ],
  runway: [
    {
      right: 45,
      top: -12,
    },
    {
      right: 48,
      top: -12,
    },
    {
      right: 48,
      top: -12,
    },
    {
      right: 48,
      top: -12,
    },
  ],
  staked: [
    {
      right: 45,
      top: -11,
    },
    {
      right: 68,
      top: -12,
      border: "1px solid rgba(54, 56, 64, 0.5)",
    },
  ],
  pol: [
    {
      right: 15,
      top: -12,
    },
    {
      right: 25,
      top: -12,
      border: "1px solid rgba(118, 130, 153, 1)",
    },
  ],
  dilution: [
    {
      right: 15,
      top: -12,
    },
    {
      right: 25,
      top: -12,
    },
  ],
  indexAdjustedPrice: [
    {
      right: 10,
      top: -12,
    },
    {
      right: 10,
      top: -12,
    },
  ],
  growthOfSupply: [
    {
      right: 15,
      top: -12,
    },
    {
      right: 15,
      top: -12,
    },
  ],
};

export const tooltipItems = {
  tvl: [t`Total Value Deposited`],
  coin: [t`DAI`, t`wFTM`, t`gOHM`],
  rfv: [t`DAI`],
  holder: [t`Exodians`],
  apy: [t`APY`],
  staked: [t`Staked`],
  runway: [t`Current`, t`7.5K APY`, t`5K APY`, t`2.5K APY`],
  pol: [t`spLP Treasury`, t`Market spLP`],
  dilution: [t`Dilution Percentage`, t`Current Index`],
  minted: [t`EXOD minted`],
  mcs: [t`EXOD Minted/Total Supply`],
  debtratio: [t`DAI Debt Ratio`, t`wFTM Debt Ratio`, t`EXOD-DAI spLP Debt Ratio`],
  indexAdjustedPrice: [t`Market Price`, t`Index Adjusted Price`],
  growthOfSupply: [t`Index Adjusted Supply`, t`Circulating Supply`],
  dashboardPrice: [t`EXOD Price`, t`wsEXOD Price`, t`Market Cap`],
};

export const tooltipInfoMessages = {
  tvl: t`Total Value Deposited, is the dollar amount of all EXOD staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
  mvt: t`Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury.`,
  rfv: t`Risk Free Value, is the amount of funds the treasury guarantees to use for backing EXOD.`,
  pol: t`Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.`,
  holder: t`Holders, represents the total number of Exodians (sEXOD holders)`,
  staked: t`Staked supply is the percentage of circulating EXOD tokens which are currently staked.`,
  backing: t`Backing is the dollar value of assets from the treasury backing a single EXOD.`,
  supply: t`Supply (Circulating/Total) represents the circulating and total amount of EXOD in existence. The circulating supply includes all staked EXOD, wsEXOD and EXOD in liquidity pools while the total also includes EXOD in the DAO treasury.`,
  apy: t`Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.`,
  runway: t`Runway, is the number of days sEXOD emissions can be sustained at a given rate. Lower APY = longer runway`,
  dilution: t`Dilution, is the ratio between index growth and total supply growth. It indicates how much stakers have been diluted. Slower decline is better.`,
  minted: t`EXOD Minted, is the number of EXOD minted each day from bonds`,
  mcs: t`EXOD minted/Total Supply, is the number of EXOD minted from bonds over total supply of EXOD.`,
  debtratio: t`Debt ratio, is a metric that tells you how much EXOD is currently vesting in relation to the total EXOD supply. The numbers dont reflect the actual values, but, it can be used to form an impression of how much EXOD is being minted from bonding in relation to the total supply.`,
  indexAdjustedPrice: t`Index adjusted price is the market price of EXOD times the index.`,
  growthOfSupply: t`Growth of Supply, is the growth of supply from bonding vs the growth of supply through the index/rebasing.`,
};

export const itemType = {
  dollar: "$",
  percentage: "%",
  OHM: "EXOD",
};
