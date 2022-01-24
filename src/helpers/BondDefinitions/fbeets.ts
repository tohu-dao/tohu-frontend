import { NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { ReactComponent as fBEETSImg } from "src/assets/tokens/fBEETS.svg";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import customTreasuryBalance from "./customTreasuryBalance";

const fbeets = new CustomBond({
  name: "fbeets",
  displayName: "fBEETS",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "fBEETS",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: fBEETSImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "",
      reserveAddress: "0x91fa20244Fb509e8289CA630E5db3E9166233FDc",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: customTreasuryBalance,
});

export default fbeets;
