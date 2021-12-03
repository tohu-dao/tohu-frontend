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
  rebases(where: {contract: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}
`;

export const treasuryOhmQuery = `
query {
  balances(first: 100, orderBy: timestamp, orderDirection: desc) {
    sOHMBalanceUSD
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
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
  ],
  coin: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, #F5AC37 -10%, #EA9276 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #DC30EB -10%, #EA98F1 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #4C8C2A -10%, #8BFF4D 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #c9184a -10%, #ff758f 100%)",
    },
  ],
  rfv: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, #F5AC37 -10%, #EA9276 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #c9184a -10%, #ff758f 100%)",
    },
  ],
  holder: [
    {
      right: 40,
      top: -12,
      background: "#A3A3A3",
    },
  ],
  apy: [
    {
      right: 20,
      top: -12,
      background: "#49A1F2",
    },
  ],
  runway: [
    {
      right: 45,
      top: -12,
      background: "#000000",
    },
    {
      right: 48,
      top: -12,
      background: "#2EC608",
    },
    {
      right: 48,
      top: -12,
      background: "#49A1F2",
    },
    {
      right: 48,
      top: -12,
      background: "#c9184a",
    },
  ],
  staked: [
    {
      right: 45,
      top: -11,
      background: "linear-gradient(180deg, #55EBC7 -10%, rgba(71, 172, 235, 0) 100%)",
    },
    {
      right: 68,
      top: -12,
      background: "rgba(151, 196, 224, 0.2)",
      border: "1px solid rgba(54, 56, 64, 0.5)",
    },
  ],
  pol: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, rgba(56, 223, 63, 1) -10%, rgba(182, 233, 152, 1) 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "rgba(219, 242, 170, 1)",
      border: "1px solid rgba(118, 130, 153, 1)",
    },
  ],
  dilution: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, #F5AC37 -10%, #EA9276 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "linear-gradient(180deg, #55EBC7 -10%, #47ACEB 100%)",
    },
  ]
};

export const tooltipItems = {
  tvl: ["Total Value Deposited"],
  coin: ["DAI", "wFTM", "sOHM"],
  rfv: ["DAI"],
  holder: ["Exodians"],
  apy: ["APY"],
  runway: ["Current", "7.5K APY", "5K APY", "2.5K APY"],
  pol: ["spLP Treasury", "Market spLP"],
  dilution: ["Dilution Percentage", "wsEXOD Price"],
  minted: ["EXOD minted"],
  mcs: ["EXOD Minted/Total Supply"],
  debtratio: ["DAI Debt Ratio", "ETH Debt Ratio", "OHM-DAI spLP Debt Ratio"]
};

export const tooltipInfoMessages = {
  tvl: "Total Value Deposited, is the dollar amount of all EXOD staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.",
  mvt: "Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury.",
  rfv: "Risk Free Value, is the amount of funds the treasury guarantees to use for backing EXOD.",
  pol: "Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.",
  holder: "Holders, represents the total number of Exodians (sEXOD holders)",
  staked: "EXOD Staked, is the ratio of sEXOD to EXOD (staked vs unstaked)",
  apy: "Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.",
  runway: "Runway, is the number of days sEXOD emissions can be sustained at a given rate. Lower APY = longer runway",
  dilution: "Dilution, is the ratio between index growth and total supply growth. It indicates how much stakers have been diluted. Slower decline is better.",
  minted: "EXOD Minted, is the number of EXOD minted each day from bonds",
  mcs: "EXOD minted/Total Supply, is the number of EXOD minted per total supply of EXOD. As total supply increases, this percentage decreases."
};

export const itemType = {
  dollar: "$",
  percentage: "%",
  OHM: "EXOD"
};
