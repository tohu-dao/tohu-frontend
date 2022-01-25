import { StableBond, NetworkID } from "src/lib/Bond";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";

const dai = new StableBond({
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

export default dai;
