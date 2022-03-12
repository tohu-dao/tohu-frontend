import { getDefaultProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";

import { fns } from "fns-helper";

async function getFNS(address) {
  const fns2 = await fns.functions.getNameFromOwner(address);
  console.log("FNS::::")
  console.log(fns2);
  return fns2;
}


export function useENS(address: string | null | undefined) {
  const [ensName, setENSName] = useState<string | null>();

  useEffect(() => {
    async function resolveENS() {
      if (address) {
        const fnsResult = (await getFNS(address)).toString();
        let name;
        if (fnsResult.split('').length > 0) {
          name = fnsResult.toLowerCase();
        } else {
          const provider = await getDefaultProvider();
          name = await provider.lookupAddress(address);
        }
        if (name) setENSName(name);
      }
    }
    resolveENS();
  }, [address]);

  return { ensName };
}
