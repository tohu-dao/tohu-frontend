import React, { useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Chart from "src/components/Chart/Chart";
import { trim, formatCurrency } from "src/helpers";
import { darkTheme } from "src/themes/dark.js";
import { Trans, t } from "@lingui/macro";
import { calcYieldPercent, calcTotalExod } from "../../views/Calc/formulas";
import styled from "styled-components";

type PersonalExodChartProps = {
  calcDays: number;
  exodAmount: number;
  rebaseRate: number;
  finalExodPrice: number;
  exodPrice: number;
  stakingView?: boolean;
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

const PersonalExodChart = ({
  calcDays,
  exodAmount,
  rebaseRate,
  finalExodPrice,
  exodPrice,
  stakingView,
}: PersonalExodChartProps) => {
  const theme = useTheme();
  const [mode, setMode] = useState(stakingView ? "USD" : "sEXOD");
  const defaultExod = stakingView ? 1 : 0;
  const data =
    mode === "sEXOD"
      ? calcSExodChart(calcDays, exodAmount || defaultExod, rebaseRate)
      : calcUsdChart(calcDays, exodAmount || defaultExod, rebaseRate, finalExodPrice, exodPrice);

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
  console.log(exodAmount);
  return (
    <Chart
      type="line"
      domain={["dataMin", "auto"]}
      data={data}
      dataKey={[mode]}
      headerText={[<HeaderText mode={mode} switchMode={switchMode} />]}
      headerSubText={
        <HeaderSubText
          profits={profits}
          calcDays={calcDays}
          stakingView={stakingView}
          mode={mode}
          exodAmount={exodAmount}
        />
      }
      itemNames={[mode]}
      todayMessage=""
      itemType=""
      color={darkTheme.gold}
      stroke={[darkTheme.gold]}
      infoTooltipMessage={mode === "sEXOD" ? infoTooltipMessage : usdTooltip}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      xInterval={30}
      bulletpointColors={bulletpointColors}
    />
  );
};

export default PersonalExodChart;

const calcSExodChart = (calcDays: number, exodAmount: number, rebaseRate: number) => {
  const data = [];

  for (let day = 0; day <= calcDays; day++) {
    const yeildPercent = calcYieldPercent(rebaseRate, day);
    const sEXOD = calcTotalExod(exodAmount, yeildPercent);
    data.unshift({ sEXOD, timestamp: nowPlusDays(day) });
  }
  return data;
};

const calcUsdChart = (
  calcDays: number,
  exodAmount: number,
  rebaseRate: number,
  finalExodPrice: number,
  exodPrice: number,
) => {
  const data = [];

  // Instead of linear change in price per day, price changes by same percentage each day to reach final price.
  const changePerDay = Math.pow(finalExodPrice / exodPrice, 1 / calcDays) - 1;
  let price = exodPrice;

  for (let day = 0; day <= calcDays; day++) {
    const yeildPercent = calcYieldPercent(rebaseRate, day);
    const sEXOD = calcTotalExod(exodAmount, yeildPercent);
    const USD = sEXOD * price;
    price = price + price * changePerDay;

    data.unshift({ USD, timestamp: nowPlusDays(day) });
  }
  return data;
};

const nowPlusDays = (days: number) => {
  return Date.now() / 1000 + 86400 * days;
};

const HeaderText = ({ mode, switchMode }: { mode: string; switchMode: () => void }) => {
  return (
    <HeaderContainer>
      <SwitchToUSD onClick={switchMode}>
        <Trans>Switch to</Trans> {mode === "sEXOD" ? "USD" : "sEXOD"}
      </SwitchToUSD>
    </HeaderContainer>
  );
};

const HeaderSubText = ({
  profits,
  calcDays,
  stakingView,
  mode,
  exodAmount,
}: {
  profits: number;
  calcDays: number;
  stakingView: boolean;
  mode: string;
  exodAmount: number;
}) => {
  return (
    <>
      <Trans>
        {profits} after {calcDays} days
      </Trans>
      {stakingView && mode === "USD" && (
        <>
          {" "}
          <Trans>if price remains stable</Trans>
        </>
      )}
      {!exodAmount && stakingView && <> ({t`Staking`} 1 EXOD)</>}
    </>
  );
};

const bulletpointColors = [
  {
    right: 20,
    top: -12,
    background: darkTheme.gold,
  },
];

const HeaderContainer = styled.div`
  display: flex;
`;

const SwitchToUSD = styled.div`
  cursor: pointer;
`;
