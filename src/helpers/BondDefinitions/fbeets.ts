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
      bondAddress: "0xe2eA15E992455972Ae11De0a543C48DbeAb9E5Ce",
      reserveAddress: "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: customTreasuryBalance,
});

export default fbeets;
