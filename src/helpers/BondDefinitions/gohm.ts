import { NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { ReactComponent as gOHMImg } from "src/assets/tokens/gOHM.svg";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import customTreasuryBalance from "./customTreasuryBalance";

const gohm = new CustomBond({
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
  customTreasuryBalanceFunc: customTreasuryBalance,
});

export default gohm;
