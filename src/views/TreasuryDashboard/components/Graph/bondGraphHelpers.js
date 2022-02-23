export const getBondDebtRatios = (dailyBondRevenues, theme, truncate = false) => {
  if (!dailyBondRevenues) return { dataKeys: [], colors: [], debtRatios: [], currentDebtRatio: "-" };

  const [dataKeysMapping, dataKeys, colors] = getDataKeys(dailyBondRevenues, theme);
  const bondValues = populateValues(dailyBondRevenues, dataKeysMapping, truncate);
  const joinedDebtRatios = connectSurroundingValues(bondValues, dataKeys);
  const currentDebtRatio = getCurrentValue(joinedDebtRatios, dataKeys);

  return { dataKeys, colors, currentDebtRatio, debtRatios: joinedDebtRatios };
};

export const getBondValuesPerDay = (dailyBondRevenues, theme, truncate = false) => {
  if (!dailyBondRevenues)
    return { dataKeys: [], colors: [], bondValues: [], mintedPerDay: [], currentValue: "-", bondedToday: "-" };

  const [dataKeysMapping, dataKeys, colors] = getDataKeys(dailyBondRevenues, theme);
  const bondValues = populateValues(dailyBondRevenues, dataKeysMapping, truncate, false);
  const bondedToday = dailyBondRevenues[0].valueIn;

  return { dataKeys, colors, bondValues, bondedToday };
};

export const getMintedPerDay = (dailyBondRevenues, protocolMetrics, theme, truncate = false) => {
  if (!dailyBondRevenues || !protocolMetrics) return { mintedPerDay: [] };

  const mintedPerDay = dailyBondRevenues.map(entry => {
    const totalSupply = protocolMetrics.find(metric => metric.timestamp === entry.timestamp).totalSupply;
    const minted = entry.bonds.reduce((sum, bond) => sum + bond.amountOut, 0);
    return {
      timestamp: entry.timestamp,
      minted: minted,
      mintedPercent: (minted / totalSupply) * 100,
    };
  });

  const mintedWithAverages = mintedPerDay.map((entry, index) => {
    const lastFiveDays = mintedPerDay.slice(index, Math.min(index + 5, mintedPerDay.length));
    const fiveDayAverage = lastFiveDays.reduce((previous, current) => current.minted + previous, 0).toFixed(2) / 5;
    const fiveDayAveragePercent =
      lastFiveDays.reduce((previous, current) => current.mintedPercent + previous, 0).toFixed(2) / 5;
    return {
      ...entry,
      fiveDayAverage: index < mintedPerDay.length - 5 ? fiveDayAverage : null,
      fiveDayAveragePercent: index < mintedPerDay.length - 5 ? fiveDayAveragePercent : null,
    };
  });

  return { mintedPerDay: mintedWithAverages };
};

export const getBondDiscounts = bondDeposits => {
  if (!bondDeposits) return { bondDiscounts: [] };

  const discounts = bondDeposits.map(entry => {
    const value = ((entry.valueOut - entry.valueIn) / entry.valueIn) * 100;
    return {
      timestamp: entry.timestamp,
      discount: value,
    };
  });

  const discountsWithEma = discounts.map((entry, index) => {
    if (index > discounts.length - 50) return entry;
    const last50 = discounts.slice(index, index + 50);
    const ma = last50.reduce((sum, current) => sum + current.discount, 0) / 50;
    return { ...entry, last50Ma: ma };
  });

  return { bondDiscounts: discountsWithEma };
};

const getDataKeys = (dailyBondRevenues, theme) => {
  const dataKeysMapping = dailyBondRevenues.reduce((keys, entry) => {
    entry.bonds.forEach(bond => {
      const ticker = convertTickerName(bond.tokenIn.ticker);
      keys[bond.tokenIn.ticker] = ticker;
    });
    return keys;
  }, {});
  const dataKeys = Object.values(dataKeysMapping);
  const colors = dataKeys.map(key => theme.palette.treasuryColors[key] || theme.palette.treasuryColors.NONE);

  return [dataKeysMapping, dataKeys, colors];
};

const convertTickerName = ticker => {
  if (ticker === "spLP") return "DAI-EXOD";
  else if (ticker === "BPT-MNLT") return "The Monolith";
  else return ticker;
};

const populateValues = (dailyBondRevenues, dataKeysMapping, truncate, isDebtRatio = true) => {
  return truncateData(dailyBondRevenues, truncate).map(entry => {
    return entry.bonds.reduce((object, bond) => {
      object.timestamp = entry.timestamp;
      const ticker = dataKeysMapping[bond.tokenIn.ticker];
      object[ticker] = isDebtRatio ? debtRatioValue(bond, ticker) : bond.valueIn;
      return object;
    }, {});
  });
};

const debtRatioValue = (entry, ticker) => {
  if (ticker === "DAI-EXOD") {
    return entry.debtRatio / 1e18;
  } else {
    return entry.debtRatio / 1e9;
  }
};

const truncateData = (data, truncate) => {
  if (!truncate) return data;
  return data.filter(entry => entry.timestamp > 1639526400); // Remove the trash
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
