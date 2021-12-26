import { useState } from "react";
import styled from "styled-components";
import {
  ExodiaLineChart,
  ExodiaStackedLineChart,
  ExodiaMultiLineChart,
  ExodiaPieChart,
  ExodiaComposedineChart,
  trimNumber,
} from "src/components/Chart/ExodiaChart.jsx";
import { Trans } from "@lingui/macro";
import { useSelector } from "react-redux";
import { FormControl, Select, MenuItem, SvgIcon, Grid, Container, Typography, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { trim, formatCurrency } from "../../../../helpers";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { useTreasuryRebases } from "../../hooks/useTreasuryRebases";
import { useDebtMetrics } from "../../hooks/useDebtMetrics";
import { bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData";
import { EPOCH_INTERVAL, OHM_TICKER } from "../../../../constants";
import { useTreasuryOhm } from "../../hooks/useTreasuryOhm";
import { parse } from "date-fns";
import { TrendingDown, TrendingUp, TrendingFlat, AccountBalance } from "@material-ui/icons";

export const Graph = ({ children }) => <>{children}</>;

export const TotalValueDepositedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <ExodiaLineChart
      data={data}
      dataKey={["totalValueLocked"]}
      dataFormat="$"
      itemType={itemType.dollar}
      itemNames={tooltipItems.tvl}
      headerText="Total Value Deposited"
      color={theme.palette.chartColors[0]}
      stroke={theme.palette.chartColors[0]}
      bulletpoints={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.tvl}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
    />
  );
};

export const MarketValueGraph = ({ isDashboard = false }) => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  let { data: ethData } = useTreasuryOhm({ refetchOnMount: false });

  const datalength = data && data.length;
  const ethDatalength = ethData && ethData.length;

  for (let i = 0; i < datalength - ethDatalength; i++) {
    ethData && ethData.push({ sOHMBalanceUSD: 0 });
  }

  const stats =
    ethData &&
    data &&
    data.map((e, i) => {
      const gOhmPrice = ethData[i].gOhmPrice ? ethData[i].gOhmPrice : 0;
      const gOhmBalance = e.treasuryGOhmBalance ? e.treasuryGOhmBalance : 0;
      const sOHMBalanceUSD = ethData[i].sOHMBalanceUSD + gOhmBalance * gOhmPrice;
      return {
        timestamp: e.id,
        ...e,
        sOHMBalanceUSD,
      };
    });

  console.log(stats);

  const value =
    ethData && stats && stats[0].treasuryDaiMarketValue + stats[0].treasuryWETHMarketValue + stats[0].sOHMBalanceUSD;
  const lastValue =
    ethData && stats && stats[1].treasuryDaiMarketValue + stats[1].treasuryWETHMarketValue + stats[1].sOHMBalanceUSD;
  const formattedValue = formatCurrency(value);

  return (
    <ExodiaStackedLineChart
      data={stats}
      dataKey={["treasuryDaiMarketValue", "treasuryWETHMarketValue", "sOHMBalanceUSD"]}
      colors={theme.palette.chartColors}
      dataFormat="$"
      headerText={
        isDashboard ? (
          <>Treasury {<Trend formattedValue={formatCurrency(value)} value={value} lastValue={lastValue} />}</>
        ) : (
          "Market Value of Treasury Assets"
        )
      }
      headerSubText={isDashboard ? "" : formattedValue}
      todayMessage={isDashboard ? "" : undefined}
      bulletpoints={bulletpoints.coin}
      itemNames={tooltipItems.coin}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.mvt}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      isDashboard={isDashboard}
    />
  );
};

export const RiskFreeValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <ExodiaStackedLineChart
      data={data}
      format="currency"
      dataKey={["treasuryDaiRiskFreeValue"]}
      colors={[theme.palette.chartColors[1], theme.palette.chartColors[2]]}
      dataFormat="$"
      headerText="Risk Free Value of Treasury Assets"
      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
      bulletpoints={bulletpoints.rfv}
      itemNames={tooltipItems.rfv}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.rfv}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const ProtocolOwnedLiquidityGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <ExodiaLineChart
      isPOL
      underglow
      data={data}
      dataFormat="percent"
      itemNames={tooltipItems.pol}
      itemType={itemType.percentage}
      dataKey={["treasuryOhmDaiPOL"]}
      bulletpoints={bulletpoints.pol}
      infoTooltipMessage={tooltipInfoMessages.pol}
      headerText="Protocol Owned Liquidity EXOD-DAI"
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
      color={theme.palette.chartColors[0]}
      stroke={theme.palette.chartColors[0]}
    />
  );
};

export const OHMStakedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const staked =
    data &&
    data
      .map(metric => ({
        staked: (metric.sOhmCirculatingSupply / metric.ohmCirculatingSupply) * 100,
        timestamp: metric.timestamp,
      }))
      .filter(metric => metric.staked < 100);

  return (
    <ExodiaLineChart
      isStaked
      underglow
      data={staked}
      dataKey={["staked"]}
      dataFormat="percent"
      itemNames={tooltipItems.staked}
      itemType={itemType.percentage}
      headerText={`${OHM_TICKER} staked`}
      color={theme.palette.chartColors[2]}
      stroke={theme.palette.chartColors[2]}
      bulletpoints={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
    />
  );
};

export const APYOverTimeGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const blockRateSeconds = useSelector(state => {
    return state.app.blockRateSeconds;
  });

  const apy =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      apy: Math.floor(
        Math.pow(parseFloat(entry.nextEpochRebase / 100 + 1), (86400 * 365) / (blockRateSeconds * EPOCH_INTERVAL)) *
          100,
      ),
    }));

  return (
    <ExodiaLineChart
      type="line"
      data={apy}
      dataKey={["apy"]}
      dataFormat="percent"
      headerText="APY over time"
      itemNames={tooltipItems.apy}
      itemType={itemType.percentage}
      color={theme.palette.chartColors[1]}
      stroke={theme.palette.chartColors[1]}
      bulletpoints={bulletpoints.apy}
      infoTooltipMessage={tooltipInfoMessages.apy}
      headerSubText={`${apy && apy[0].apy.toLocaleString("en-us")}%`}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const RunwayAvailableGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const runway =
    data &&
    data.map(entry => {
      const epochLengthSeconds = EPOCH_INTERVAL * 0.9;
      return {
        timestamp: entry.timestamp,
        runwayCurrent: (entry.runwayCurrent * 3 * epochLengthSeconds) / 86400, //86400 is number of seconds in a day.
        runway7dot5k: (entry.runway7dot5k * 3 * epochLengthSeconds) / 86400,
      };
    });

  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current }, ...others];

  return (
    <ExodiaMultiLineChart
      data={runway}
      dataKey={["runwayCurrent", "runway7dot5k"]}
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[2]]}
      headerText="Runway Available"
      headerSubText={`${runway && trim(runway[0].runwayCurrent, 1)} Days`}
      dataFormat={["days"]}
      bulletpoints={runwayBulletpoints}
      itemNames={tooltipItems.runway}
      itemType={""}
      infoTooltipMessage={tooltipInfoMessages.runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const DilutionGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const dilution =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      percentage: (entry.index / (entry.ohmCirculatingSupply / 2000)) * 100, //initial total supply of 2000
      index: entry.index,
    }));

  return (
    <ExodiaMultiLineChart
      data={dilution}
      dataKey={["percentage", "index"]}
      dataAxis={["left", "right"]}
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[1]]}
      headerText="Dilution Over Time"
      dataFormat={["percent", "number"]}
      headerSubText={`${dilution && trim(dilution[0].percentage, 2)}%`}
      bulletpoints={bulletpoints.dilution}
      itemNames={tooltipItems.dilution}
      itemType={[itemType.percentage, "sEXOD"]}
      infoTooltipMessage={tooltipInfoMessages.dilution}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      isDilution
    />
  );
};

export const OhmMintedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const minted =
    data &&
    data
      .map(entry => ({
        timestamp: entry.timestamp,
        ohmMinted: entry.ohmMinted,
      }))
      .slice(0, data.length - 1);

  const fiveDaySlice = minted && minted.slice(0, 5);
  //react-query is so weird why won't it let me use .reduce() T_T
  let fiveDayTotal = 0;
  for (let i = 0; i < 5; i++) {
    fiveDayTotal += fiveDaySlice && fiveDaySlice[i].ohmMinted;
  }

  return (
    <ExodiaLineChart
      glowDeviation="2"
      dataFormat="OHM"
      data={minted}
      dataKey={["ohmMinted"]}
      itemNames={tooltipItems.minted}
      itemType={itemType.OHM}
      headerText={`${OHM_TICKER} minted`}
      color={theme.palette.chartColors[0]}
      stroke={theme.palette.chartColors[0]}
      bulletpoints={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.minted}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${(fiveDayTotal && fiveDayTotal / 5).toFixed(2)} EXOD`}
      todayMessage="5-day Average"
    />
  );
};

export const OhmMintedPerTotalSupplyGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const minted =
    data &&
    data
      .map(entry => ({
        timestamp: entry.timestamp,
        percentage: (entry.ohmMinted / entry.totalSupply) * 100,
      }))
      .slice(0, data.length - 1);
  const fiveDaySlice = minted && minted.slice(0, 5);
  let fiveDayTotal = 0;
  for (let i = 0; i < 5; i++) {
    fiveDayTotal += fiveDaySlice && fiveDaySlice[i].percentage;
  }
  return (
    <ExodiaLineChart
      glowDeviation="2"
      dataFormat="percent"
      data={minted}
      dataKey={["percentage"]}
      itemNames={tooltipItems.mcs}
      itemType={itemType.percentage}
      headerText={`${OHM_TICKER} Minted/Total Supply`}
      color={theme.palette.chartColors[1]}
      stroke={theme.palette.chartColors[1]}
      bulletpoints={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.mcs}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${(fiveDayTotal && fiveDayTotal / 5).toFixed(2)}%`}
      todayMessage="5-day Average"
    />
  );
};

export const DebtRatioGraph = () => {
  const theme = useTheme();
  const { data } = useDebtMetrics({ refetchOnMount: false });

  const debtRatios =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      daiDebtRatio: entry.dai_debt_ratio / 1e10,
      ethDebtRatio: entry.eth_debt_ratio / 1e10,
      ohmDaiDebtRatio: entry.ohmdai_debt_ratio / 1e19,
    }));

  return (
    <ExodiaMultiLineChart
      deviation="2"
      data={debtRatios}
      dataKey={["daiDebtRatio", "ethDebtRatio", "ohmDaiDebtRatio"]}
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[2], theme.palette.chartColors[1]]}
      stroke={[theme.palette.chartColors[0], theme.palette.chartColors[2], theme.palette.chartColors[1]]}
      headerText="Debt Ratios"
      headerSubText={`Total ${
        debtRatios && trim(debtRatios[0].daiDebtRatio + debtRatios[0].ethDebtRatio + debtRatios[0].ohmDaiDebtRatio, 2)
      }%`}
      dataFormat={["percent"]}
      bulletpoints={bulletpoints.runway}
      itemNames={tooltipItems.debtratio}
      itemType={itemType.percentage}
      infoTooltipMessage={tooltipInfoMessages.debtratio}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      isDebt={true}
    />
  );
};

export const IndexAdjustedPrice = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const indexAdjustedPrice =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      price: entry.ohmPrice,
      indexAdjustedPrice: entry.ohmPrice * entry.index,
    }));

  return (
    <ExodiaMultiLineChart
      data={indexAdjustedPrice}
      dataKey={["price", "indexAdjustedPrice"]}
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[2]]}
      stroke={[theme.palette.chartColors[0], theme.palette.chartColors[2]]}
      headerText="Index Adjusted Price"
      headerSubText={`$${indexAdjustedPrice && trim(indexAdjustedPrice[0].indexAdjustedPrice, 2)}`}
      dataFormat={["$"]}
      bulletpoints={bulletpoints.indexAdjustedPrice}
      itemNames={tooltipItems.indexAdjustedPrice}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.indexAdjustedPrice}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const GrowthOfSupply = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const formattedData =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      circSupply: entry.ohmCirculatingSupply,
      indexCircSupply: entry.index * 2000,
    }));

  return (
    <ExodiaMultiLineChart
      data={formattedData}
      dataKey={["indexCircSupply", "circSupply"]}
      colors={[theme.palette.chartColors[2], theme.palette.chartColors[0]]}
      stroke={[theme.palette.chartColors[2], theme.palette.chartColors[0]]}
      headerText="Growth of Supply"
      headerSubText={`${
        formattedData && trim(Math.abs(1 - formattedData[0].indexCircSupply / formattedData[0].circSupply) * 100, 2)
      }%`}
      dataFormat={["number"]}
      bulletpoints={bulletpoints.growthOfSupply}
      itemNames={tooltipItems.growthOfSupply}
      itemType={itemType.OHM}
      infoTooltipMessage={tooltipInfoMessages.growthOfSupply}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const DashboardPriceGraph = ({ isDashboard = false }) => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const [selectedData, setSelectedData] = useState("marketCap");

  const entries = { price: 0, wsEXOD: 1, marketCap: 2 };
  const formattedData =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      price: entry.ohmPrice,
      wsEXOD: entry.ohmPrice * entry.index,
      marketCap: entry.marketCap,
    }));

  const value =
    formattedData &&
    (selectedData == "price"
      ? formattedData[0].price
      : selectedData == "wsEXOD"
      ? formattedData[0].wsEXOD
      : formattedData[0].marketCap);

  const lastValue =
    formattedData &&
    (selectedData == "price"
      ? formattedData[1].price
      : selectedData == "wsEXOD"
      ? formattedData[1].wsEXOD
      : formattedData[1].marketCap);

  const SelectDataType = () => (
    <FormControl
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        margin: "0 10px",
        height: "33px",
        minWidth: "69px",
      }}
    >
      <Select
        id="time-select"
        value={selectedData}
        label="Timeframe"
        onChange={e => setSelectedData(e.target.value)}
        disableUnderline
      >
        <MenuItem value={"price"}>EXOD</MenuItem>
        <MenuItem value={"wsEXOD"}>wsEXOD</MenuItem>
        <MenuItem value={"marketCap"}>Market Cap</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <ExodiaLineChart
      data={formattedData}
      dataKey={[selectedData]}
      SelectOptions={SelectDataType}
      color={theme.palette.chartColors[0]}
      stroke={theme.palette.chartColors[0]}
      headerText={
        <>
          {selectedData == "price" ? "EXOD Price" : selectedData == "wsEXOD" ? "wsEXOD Price" : "Market Cap"}{" "}
          {<Trend formattedValue={formatCurrency(value)} value={value} lastValue={lastValue} />}
        </>
      }
      headerSubText=""
      todayMessage=""
      dataFormat="$"
      bulletpoints={bulletpoints.indexAdjustedPrice}
      itemNames={[tooltipItems.dashboardPrice[entries[selectedData]]]}
      itemType={itemType.dollar}
      infoTooltipMessage=""
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      isDashboard={isDashboard}
    />
  );
};

export const TreasuryBreakdownPie = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  let { data: ethData } = useTreasuryOhm({ refetchOnMount: false });

  const gOhmPrice = ethData && ethData[0].gOhmPrice ? ethData[0].gOhmPrice : 0;
  const gOhmBalance = data && ethData && data[0].treasuryGOhmBalance ? data[0].treasuryGOhmBalance : 0;
  const gOhmPricePrevious = ethData && ethData[1].gOhmPrice ? ethData[1].gOhmPrice : 0;
  const gOhmBalancePrevious = data && ethData && data[1].treasuryGOhmBalance ? data[1].treasuryGOhmBalance : 0;

  const daiValue = data && data[0].treasuryDaiMarketValue;
  const ftmValue = data && data[0].treasuryWETHMarketValue;
  const gOhmValue = ethData && ethData[0].sOHMBalanceUSD + gOhmBalance * gOhmPrice;

  const daiValuePrevious = data && data[1].treasuryDaiMarketValue;
  const ftmValuePrevious = data && data[1].treasuryWETHMarketValue;
  const gOhmValuePrevious = ethData && ethData[1].sOHMBalanceUSD + gOhmBalancePrevious * gOhmPricePrevious;

  const totalValue = ethData && data && daiValue + ftmValue + gOhmValue;
  const lastValue = ethData && data && daiValuePrevious + ftmValuePrevious + gOhmValuePrevious;

  const pieData = totalValue && [
    { value: Number(trim((daiValue / totalValue) * 100, 2)), name: "DAI" },
    { value: Number(trim((ftmValue / totalValue) * 100, 2)), name: "wFTM" },
    { value: Number(trim((gOhmValue / totalValue) * 100, 2)), name: "gOHM" },
  ];

  return (
    <Grid container>
      <Grid xs={5} sm={5} md={5} lg={5} style={{ margin: "0" }}>
        <ExodiaPieChart
          data={pieData}
          colors={theme.palette.chartColors}
          headerText={
            <Typography
              variant="h6"
              color="textPrimary"
              style={{ marginBottom: "6px", display: "flex", alignItems: "flex-start" }}
            >
              <SvgIcon
                color="textPrimary"
                component={AccountBalance}
                style={{ marginRight: "10px", overflow: "visible" }}
              />
              Treasury Breakdown
            </Typography>
          }
          todayMessage=""
          dataFormat="$"
          bulletpoints={bulletpoints.coin}
          itemNames={tooltipItems.coin}
          itemType={itemType.percentage}
          timeSelection={false}
          isDashboard
          fullScreenDisabled
        />
      </Grid>
      <Grid xs={7} sm={7} md={7} lg={7}>
        <TreasuryTable
          currentData={[daiValue, ftmValue, gOhmValue]}
          previousData={[daiValuePrevious, ftmValuePrevious, gOhmValuePrevious]}
          itemNames={tooltipItems.coin}
          colors={theme.palette.chartColors}
          totalValue={totalValue}
          lastValue={lastValue}
        />
      </Grid>
    </Grid>
  );
};

const TreasuryTable = ({ currentData, previousData, totalValue, lastValue, itemNames, colors }) => {
  const formattedValue = formatCurrency(totalValue);
  const isSmallScreen = useMediaQuery("(max-width: 550px)");

  return (
    <div>
      <Typography variant="h6" style={{ textAlign: "right" }}>
        <Trend formattedValue={formattedValue} value={totalValue} lastValue={lastValue} />
      </Typography>

      <TableGrid header isSmallScreen={isSmallScreen}>
        <Cell>
          <Typography variant="body1" color="textSecondary">
            <Trans>Asset</Trans>
          </Typography>
        </Cell>
        <Cell>
          <Typography variant="body1" color="textSecondary">
            <Trans>Value</Trans>
          </Typography>
        </Cell>
        <Cell>
          <Typography variant="body1" color="textSecondary">
            <Trans>%</Trans>
          </Typography>
        </Cell>
        <Cell>
          <Typography variant="body1" color="textSecondary">
            <Trans>Change</Trans>
          </Typography>
        </Cell>
      </TableGrid>
      <TableGrid isSmallScreen={isSmallScreen}>
        {itemNames.map((name, index) => {
          return (
            <>
              <Cell>
                <ColorMark color={colors[index]} />
                <Typography variant="body1">{name}</Typography>
              </Cell>
              <Cell>
                <Typography variant="body1">
                  {isSmallScreen ? trimNumber(currentData[index]) : formatCurrency(currentData[index])}
                </Typography>
              </Cell>
              <Cell>
                <Typography variant="body1">
                  {trim((currentData[index] / totalValue) * 100, isSmallScreen ? 0 : 1)}%
                </Typography>
              </Cell>
              <Cell>
                <Typography variant="body1">
                  <Trend
                    value={currentData[index]}
                    lastValue={previousData[index]}
                    small
                    isSmallScreen={isSmallScreen}
                  />
                </Typography>
              </Cell>
            </>
          );
        })}
      </TableGrid>
    </div>
  );
};

const Trend = ({ value, lastValue, formattedValue, small, isSmallScreen = false }) => {
  const theme = useTheme();
  const pctChange = trim((value / lastValue - 1) * 100, small ? 1 : 2);

  if (value > lastValue) {
    return (
      <span style={{ color: theme.palette.trendUp }}>
        {formattedValue}{" "}
        <SvgIcon
          component={TrendingUp}
          color="green"
          style={{ fontSize: isSmallScreen ? "0.75rem" : "1rem", width: isSmallScreen ? "16px" : "24px" }}
        />{" "}
        {pctChange}%
      </span>
    );
  }
  if (value < lastValue) {
    return (
      <span style={{ color: theme.palette.trendDown }}>
        {formattedValue}
        <SvgIcon
          component={TrendingDown}
          color="green"
          style={{ fontSize: isSmallScreen ? "0.75rem" : "1rem", width: isSmallScreen ? "16px" : "24px" }}
        />{" "}
        {pctChange}%
      </span>
    );
  }
  return (
    <span>
      {formattedValue}
      <SvgIcon
        component={TrendingFlat}
        color="primary"
        style={{ fontSize: isSmallScreen ? "0.75rem" : "1rem", width: isSmallScreen ? "16px" : "24px" }}
      />
    </span>
  );
};

const TableGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 25% 35% 15% 30%;
  ${({ isSmallScreen }) => isSmallScreen && "grid-template-columns: 30% 25% 15% 35%;"}
  padding-left: 12px;
  grid-row-gap: 12px;
  ${({ header }) => header && "padding-bottom: 12px; margin-top: 64px;"}
`;

const ColorMark = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background: ${({ color }) => color};
  margin-right: 8px;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
`;
