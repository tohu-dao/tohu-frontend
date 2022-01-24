import { LPBond, NetworkID } from "src/lib/Bond";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/OHM-DAI.svg";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";

const ohm_dai = new LPBond({
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

export default ohm_dai;
