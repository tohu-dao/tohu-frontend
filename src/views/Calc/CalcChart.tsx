import React, { useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Chart from "src/components/Chart/Chart";
import { trim, formatCurrency } from "src/helpers";
import { darkTheme } from "src/themes/dark.js";
import { Trans } from "@lingui/macro";
import { calcYieldPercent, calcTotalExod } from "./formulas";
import styled from "styled-components";

type CalcChartProps = {
  calcDays: number;
  exodAmountInput: number;
  rebaseRateInput: number;
  finalExodPriceInput: number;
  exodPriceInput: number;
};

const infoTooltipMessage = (
  <Trans>
    Your projected staked EXOD balance over time. You can use this to estimate the growth of your sEXOD balance.
  </Trans>
);

const usdTooltip = (
  <Trans>
    Your projected USD balance over time. Price increases/decreases by the same percentage each day to finally reach the
    target price.
  </Trans>
);

const CalcChart = ({
  calcDays,
  exodAmountInput,
  rebaseRateInput,
  finalExodPriceInput,
  exodPriceInput,
}: CalcChartProps) => {
  const theme = useTheme();
  const [mode, setMode] = useState("sEXOD");
  const data =
    mode === "sEXOD"
      ? calcSExodChart(calcDays, exodAmountInput, rebaseRateInput)
      : calcUsdChart(calcDays, exodAmountInput, rebaseRateInput, finalExodPriceInput, exodPriceInput);

  const switchMode = () => {
    setMode(mode === "sEXOD" ? "USD" : "sEXOD");
  };

  const profits =
    mode === "sEXOD"
      ? `${trim(data[0][mode], 2)} sEXOD`
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(data[0][mode]);

  return (
    <Chart
      type="line"
      domain={["dataMin", "auto"]}
      data={data}
      dataKey={[mode]}
      headerText={[
        <HeaderContainer>
          <SwitchToUSD onClick={switchMode}>
            <Trans>Switch to</Trans> {mode === "sEXOD" ? "USD" : "sEXOD"}
          </SwitchToUSD>
        </HeaderContainer>,
      ]}
      headerSubText={
        <Trans>
          {profits} after {calcDays} days
        </Trans>
      }
      itemNames={[mode]}
      todayMessage=""
      itemType=""
      color={darkTheme.gold}
      stroke={[darkTheme.gold]}
      infoTooltipMessage={mode === "sEXOD" ? infoTooltipMessage : usdTooltip}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      xInterval={30}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: darkTheme.gold,
        },
      ]}
    />
  );
};

export default CalcChart;

const calcSExodChart = (calcDays: number, exodAmountInput: number, rebaseRateInput: number) => {
  const data = [];

  for (let day = 0; day <= calcDays; day++) {
    const yeildPercent = calcYieldPercent(rebaseRateInput, day);
    const sEXOD = calcTotalExod(exodAmountInput, yeildPercent);
    data.unshift({ sEXOD, timestamp: nowPlusDays(day) });
  }
  return data;
};

const calcUsdChart = (
  calcDays: number,
  exodAmountInput: number,
  rebaseRateInput: number,
  finalExodPriceInput: number,
  exodPriceInput: number,
) => {
  const data = [];

  // Instead of linear change in price per day, price changes by same percentage each day to reach final price.
  const changePerDay = Math.pow(finalExodPriceInput / exodPriceInput, 1 / calcDays) - 1;
  let price = exodPriceInput;

  for (let day = 0; day <= calcDays; day++) {
    const yeildPercent = calcYieldPercent(rebaseRateInput, day);
    const sEXOD = calcTotalExod(exodAmountInput, yeildPercent);
    const USD = sEXOD * price;
    price = price + price * changePerDay;

    data.unshift({ USD, timestamp: nowPlusDays(day) });
  }
  return data;
};

const nowPlusDays = (days: number) => {
  return Date.now() / 1000 + 86400 * days;
};

const HeaderContainer = styled.div`
  display: flex;
`;

const SwitchToUSD = styled.div`
  cursor: pointer;
`;
