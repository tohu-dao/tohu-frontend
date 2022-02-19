import { getColor } from "./graphHelpers";

export const getBondDiscountDetails = (data, theme, truncate = false) => {
  if (!data || !data.bonds) return { dataKeys: [], colors: [], debtRatios: [], currentDebtRatio: "-" };

  const dataKeys = extractUniqKeys(data);
  const colors = dataKeys.map(key => getColor(key, theme));

  const timestamps = initializeDataArrayWithTimeStamps(data);
  const populatedDebtRatios = populateDebtRatios(data, timestamps);
  const debtRatiosArray = convertToSortedArray(populatedDebtRatios, truncate);
  const joinedDebtRatios = connectSurroundingValues(debtRatiosArray, dataKeys);
  const currentDebtRatio = getCurrentValue(joinedDebtRatios, dataKeys);

  return { dataKeys, colors, currentDebtRatio, debtRatios: joinedDebtRatios };
};

export const getBondValuesPerDay = (data, theme, truncate = false) => {
  if (!data || !data.bonds)
    return { dataKeys: [], colors: [], bondValues: [], mintedPerDay: [], currentValue: "-", bondedToday: "-" };

  const dataKeys = extractUniqKeys(data);
  const colors = dataKeys.map(key => getColor(key, theme));

  const timestamps = initializeDataArrayWithTimeStamps(data);
  const populatedBondValues = populateBondValues(data, timestamps);
  const bondValuesArray = convertToSortedArray(populatedBondValues, truncate);
  const currentValue = getCurrentValue(bondValuesArray, dataKeys);
  const mintedPerDay = bondValuesArray.map(entry => {
    return { timestamp: entry.timestamp, totalMinted: entry.totalMinted };
  });
  const bondedToday = dataKeys.reduce((sum, key) => sum + (bondValuesArray[0][key] || 0), 0);

  return { dataKeys, colors, currentValue, bondValues: bondValuesArray, mintedPerDay, bondedToday };
};

const initializeDataArrayWithTimeStamps = data => {
  return data.bonds.reduce((obj, entry) => {
    obj[entry.timestamp] = { timestamp: entry.timestamp };
    return obj;
  }, {});
};

const extractUniqKeys = data => {
  return Object.keys(
    data.bonds.reduce((keys, entry) => {
      const ticker = convertTickerName(entry.tokenIn.ticker);
      keys[ticker] = ticker;
      return keys;
    }, {}),
  );
};

const populateDebtRatios = (data, debtRatios) => {
  data.bonds.forEach(entry => {
    let ticker = convertTickerName(entry.tokenIn.ticker);

    if (ticker === "DAI-EXOD") {
      debtRatios[entry.timestamp][ticker] = entry.debtRatio / 1e18;
    } else {
      debtRatios[entry.timestamp][ticker] = entry.debtRatio / 1e9;
    }
  }, []);

  return debtRatios;
};

const populateBondValues = (data, bondValues) => {
  data.bonds.forEach(entry => {
    let ticker = convertTickerName(entry.tokenIn.ticker);

    bondValues[entry.timestamp][ticker] = entry.valueIn;
    if (bondValues[entry.timestamp].totalMinted) {
      bondValues[entry.timestamp].totalMinted += entry.amountOut;
    } else {
      bondValues[entry.timestamp].totalMinted = entry.amountOut;
    }
  }, []);

  return bondValues;
};

const convertTickerName = ticker => {
  if (ticker === "spLP") return "DAI-EXOD";
  else if (ticker === "BPT-MNLT") return "The Monolith";
  else return ticker;
};

const convertToSortedArray = (data, truncate) => {
  return _.sortBy(Object.values(data), ["timestamp"])
    .reverse()
    .filter(entry => (truncate ? entry.timestamp > 1639526400 : true)); // Remove the trash
};

const connectSurroundingValues = (debtRatios, dataKeys) => {
  return debtRatios.map((entry, index) => {
    dataKeys.map(key => {
      if (entry[key]) return entry;
      const [lastValue, nextValue] = getSurroundingValues(debtRatios, key, entry, index);
      if (!nextValue && !!lastValue && index - 3 < 0) entry[key] = lastValue[key];
      else if (lastValue && nextValue) entry[key] = (lastValue[key] + nextValue[key]) / 2;
    });

    return entry;
  });
};

const getSurroundingValues = (debtRatios, key, entry, index) => {
  const lastValue = debtRatios.slice(index, Math.min(index + 3, debtRatios.length)).find(entry => !!entry[key]);
  const nextValue = debtRatios
    .slice(Math.max(index - 3, 0), index)
    .reverse()
    .find(entry => !!entry[key]);

  return [lastValue, nextValue];
};

const getCurrentValue = (data, dataKeys) => {
  return dataKeys.reduce((sum, key) => {
    const lastValue = data[0][key];
    if (!lastValue) return sum;
    return sum + lastValue;
  }, 0);
};
