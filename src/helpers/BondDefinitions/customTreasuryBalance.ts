import { NetworkID, CustomBond } from "src/lib/Bond";
import { addresses } from "src/constants";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { BigNumberish } from "ethers";

const customTreasuryBalance = async function (this: CustomBond, networkID: NetworkID, provider: StaticJsonRpcProvider) {
  const bondContract = this.getContractForBond(networkID, provider);
  const token = this.getContractForReserve(networkID, provider);

  let [price, balance]: [BigNumberish, BigNumberish] = await Promise.all([
    bondContract.assetPrice(),
    token.balanceOf(addresses[networkID].TREASURY_ADDRESS),
  ]);

  price = Number(price.toString()) / Math.pow(10, 8);
  balance = Number(balance.toString()) / Math.pow(10, 18);
  return balance * price;
};

export default customTreasuryBalance;
