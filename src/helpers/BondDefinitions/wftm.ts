import { NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import customTreasuryBalance from "./customTreasuryBalance";

const wftm = new CustomBond({
  name: "wftm",
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
      bondAddress: "0x39086c3e5979d6f0ab0a54e3135d6e3edd53c395",
      reserveAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: customTreasuryBalance,
});

export default wftm;
