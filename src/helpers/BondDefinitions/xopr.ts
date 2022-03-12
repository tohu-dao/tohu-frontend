import { NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { XOprImage } from "src/assets/tokens/xopr_svg";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import customTreasuryBalance from "./customTreasuryBalance";

const xopr = new CustomBond({
  name: "xopr",
  displayName: "xOPR",
  bondToken: "xopr",
  bondType: BondType.StableAsset,
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: XOprImage,
  isMonolith: false,
  bondContractABI: EthBondContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x0000000000000000000000000000000000000000",
      reserveAddress: "0x9E7f8D1E52630d46e8749C8f81e91D4e934f3589",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: customTreasuryBalance,
  lpUrl: "https://staking.fantoms.art/",
});

export default xopr;
