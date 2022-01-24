import { NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { ReactComponent as BeetsPoolImg } from "src/assets/tokens/BeetsPool.svg";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import customTreasuryBalance from "./customTreasuryBalance";

const the_monolith_lp_old = new CustomBond({
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
  customTreasuryBalanceFunc: customTreasuryBalance,
  lpUrl: "https://beets.fi/#/pool/0xa216aa5d67ef95dde66246829c5103c7843d1aab000100000000000000000112",
});

export default the_monolith_lp_old;
