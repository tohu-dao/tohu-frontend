import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";
import { treasuryDataQuery } from "../treasuryData";
import _ from "lodash";

export const useTreasuryMetrics = options => {
  return useQuery(
    "treasury_metrics_v2",
    async () => {
      const response = await apollo(treasuryDataQuery);

      const data = response.data;

      return {
        bonds: data.bonds.slice(0, -2).map(entry => transformStringsToFloats(entry)),
        protocolMetrics: data.protocolMetrics.slice(0, -2).map(entry => transformStringsToFloats(entry)),
        simpleStakings: data.simpleStakings.slice(0, -2).map(entry => transformStringsToFloats(entry)),
        treasuries: data.treasuries.slice(0, -2).map(entry => transformStringsToFloats(entry)),
        bondDeposits: data.bondDeposits.slice(0, -2).map(entry => transformStringsToFloats(entry)),
      };
    },
    { ...options, refetchInterval: 60000 },
  );
};

const transformStringsToFloats = entry => {
  return _.transform(entry, iterateValue);
};

const iterateValue = (result, value, key) => {
  if (_.isObject(value)) {
    result[key] = transformStringsToFloats(value);
  } else if (_.isArray(value)) {
    result[key] = value.map(entry => iterateValue(result, value, key));
  } else {
    if (key === "id") {
      result["timestamp"] = parseFloat(value);
    }
    const parsedValue = parseFloat(value);
    result[key] = isNaN(parsedValue) ? value : parsedValue;
  }
};
