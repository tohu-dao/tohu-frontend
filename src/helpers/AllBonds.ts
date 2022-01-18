import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/OHM-DAI.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as BeetsPoolImg } from "src/assets/tokens/BeetsPool.svg";
import { ReactComponent as gOHMImg } from "src/assets/tokens/gOHM.svg";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { BigNumberish } from "ethers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xc43db16ed7b57597170b76d3aff29708bc608483",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x1B6F86BC319e3B363aC5299c045Ae29D95d7A623",
      reserveAddress: "0xEF6834b5a29D75a883406B19f3eEefbF87b5031A",
    },
  },
});

export const eth = new CustomBond({
  name: "ftm",
  displayName: "wFTM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wFTM",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: wETHImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xd7cbA20A464C10FB03Bbc265D962ADa8e29af118",
      reserveAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    const token = this.getContractForReserve(networkID, provider);

    let [ethPrice, ethAmount]: [BigNumberish, BigNumberish] = await Promise.all([
      ethBondContract.assetPrice(),
      token.balanceOf(addresses[networkID].TREASURY_ADDRESS),
    ]);

    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const ohm_dai = new LPBond({
  name: "exod_dai_lp",
  displayName: "EXOD-DAI LP",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x5b7e66542800ca1a27402dd00f4325460553c5eb",
      reserveAddress: "0xc0c1dff0fe24108586e11ec9e20a7cbb405cb769",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x3b57f3FeAaF1e8254ec680275Ee6E7727C7413c7",
});

export const the_monolith_lp = new CustomBond({
  name: "the_monolith_lp",
  displayName: "The Monolith LP",
  bondToken: "the-monolith-lp",
  bondType: BondType.StableAsset,
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: BeetsPoolImg,
  isMonolith: true,
  bondContractABI: EthBondContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x86E21dB31c154aE777e0C126999e89Df0C01D9Fa",
      reserveAddress: "0xa216aa5d67ef95dde66246829c5103c7843d1aab",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const monolithContract = this.getContractForBond(networkID, provider);
    const token = this.getContractForReserve(networkID, provider);

    let [monolithPrice, monolithAmount]: [BigNumberish, BigNumberish] = await Promise.all([
      monolithContract.assetPrice(),
      token.balanceOf(addresses[networkID].TREASURY_ADDRESS),
    ]);

    monolithPrice = Number(monolithPrice.toString()) / Math.pow(10, 8);
    monolithAmount = Number(monolithAmount.toString()) / Math.pow(10, 18);
    return monolithAmount * monolithPrice;
  },
  lpUrl: "https://beets.fi/#/pool/0xa216aa5d67ef95dde66246829c5103c7843d1aab000100000000000000000112",
});

export const gohm = new CustomBond({
  name: "gohm",
  displayName: "gOHM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "gOHM",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: gOHMImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xcf69ba319ff0f8e2481de13d16ce7f74b063533e",
      reserveAddress: "0x91fa20244Fb509e8289CA630E5db3E9166233FDc",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const gohmBondContract = this.getContractForBond(networkID, provider);
    const token = this.getContractForReserve(networkID, provider);

    let [gohmPrice, gohmAmount]: [BigNumberish, BigNumberish] = await Promise.all([
      gohmBondContract.assetPrice(),
      token.balanceOf(addresses[networkID].TREASURY_ADDRESS),
    ]);

    gohmPrice = Number(gohmPrice.toString()) / Math.pow(10, 8);
    gohmAmount = Number(gohmAmount.toString()) / Math.pow(10, 18);
    return gohmAmount * gohmPrice;
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [dai, eth, the_monolith_lp, gohm];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds: (StableBond | CustomBond | LPBond)[] = [ohm_dai];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
