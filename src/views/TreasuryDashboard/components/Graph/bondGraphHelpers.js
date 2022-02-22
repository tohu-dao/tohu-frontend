export const getBondDebtRatios = (data, theme, truncate = false) => {
  if (!data || !data.dailyBondRevenues) return { dataKeys: [], colors: [], debtRatios: [], currentDebtRatio: "-" };

  const [dataKeysMapping, dataKeys, colors] = getDataKeys(data, theme);
  const bondValues = populateValues(data, dataKeysMapping, truncate);
  const joinedDebtRatios = connectSurroundingValues(bondValues, dataKeys);
  const currentDebtRatio = getCurrentValue(joinedDebtRatios, dataKeys);

  return { dataKeys, colors, currentDebtRatio, debtRatios: joinedDebtRatios };
};

export const getBondValuesPerDay = (data, theme, truncate = false) => {
  if (!data || !data.dailyBondRevenues)
    return { dataKeys: [], colors: [], bondValues: [], mintedPerDay: [], currentValue: "-", bondedToday: "-" };

  const [dataKeysMapping, dataKeys, colors] = getDataKeys(data, theme);
  const bondValues = populateValues(data, dataKeysMapping, truncate, false);
  const bondedToday = data.dailyBondRevenues[0].valueIn;

  return { dataKeys, colors, bondValues, bondedToday };
};

export const getMintedPerDay = (data, theme, truncate = false) => {
  if (!data || !data.dailyBondRevenues) return { mintedPerDay: [] };

  const mintedPerDay = data.dailyBondRevenues.map(entry => {
    const totalSupply = data.protocolMetrics.find(metric => metric.timestamp === entry.timestamp).totalSupply;
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

export const getBondDiscounts = data => {
  if (!data || !data.bondDeposits) return { bondDiscounts: [] };

  const discounts = data.bondDeposits.map(entry => {
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

const getDataKeys = (data, theme) => {
  const dataKeysMapping = data.dailyBondRevenues.reduce((keys, entry) => {
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

const populateValues = (data, dataKeysMapping, truncate, isDebtRatio = true) => {
  return truncateData(data.dailyBondRevenues, truncate).map(entry => {
    return entry.bonds.reduce((object, bond) => {
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
