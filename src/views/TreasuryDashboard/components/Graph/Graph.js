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
import {
  FormControl,
  Select,
  MenuItem,
  SvgIcon,
  Grid,
  Container,
  Typography,
  useMediaQuery,
  Box,
} from "@material-ui/core";
import gOhmData from "./gohmHistory";
import { useTheme } from "@material-ui/core/styles";
import { trim, formatCurrency } from "../../../../helpers";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { useTreasuryRebases } from "../../hooks/useTreasuryRebases";
import { useDebtMetrics } from "../../hooks/useDebtMetrics";
import { bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData";
import { EPOCH_INTERVAL, OHM_TICKER } from "../../../../constants";
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
      todayMessage=""
    />
  );
};

export const MarketValueGraph = ({ isDashboard = false }) => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const reversedData = data && data.reverse();
  data &&
    reversedData.forEach((entry, index) => {
      if (gOhmData[index]) reversedData[index].treasuryGOhmMarketValue = gOhmData[index];
      reversedData[index].treasuryExodMarketValue = entry.treasuryMonolithExodValue + entry.treasuryMonolithWsExodValue;
    });

  const stats = data && reversedData.reverse();

  const value = stats && stats[0].treasuryMarketValue;
  const lastValue = stats && stats[1].treasuryMarketValue;
  const formattedValue = formatCurrency(value);

  return (
    <ExodiaStackedLineChart
      data={stats}
      dataKey={[
        "treasuryExodMarketValue",
        "treasuryDaiMarketValue",
        "treasuryMaiBalance",
        "treasuryWETHMarketValue",
        "treasuryGOhmMarketValue",
        "treasuryfBeetsValue",
      ]}
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
      todayMessage=""
      showTotal
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
      dataKey={["treasuryDaiRiskFreeValue", "treasuryMaiRiskFreeValue"]}
      colors={[theme.palette.chartColors[1], theme.palette.chartColors[2]]}
      dataFormat="$"
      headerText="Risk Free Value of Treasury Assets"
      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
      bulletpoints={bulletpoints.rfv}
      itemNames={tooltipItems.rfv}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.rfv}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      todayMessage=""
      showTotal
    />
  );
};

export const ProtocolOwnedLiquidityGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  // Remove 0's
  const formattedData =
    data &&
    data.reduce((formatting, dataEntry) => {
      if (dataEntry["treasuryMonolithPOL"]) formatting.push(dataEntry);
      return formatting;
    }, []);

  return (
    <ExodiaLineChart
      isPOL
      underglow
      data={formattedData}
      dataFormat="percent"
      itemNames={tooltipItems.pol}
      itemType={itemType.percentage}
      dataKey={["treasuryMonolithPOL"]}
      bulletpoints={bulletpoints.pol}
      infoTooltipMessage={tooltipInfoMessages.pol}
      headerText="Protocol Owned Liquidity The Monolith LP"
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && trim(data[0].treasuryMonolithPOL, 2)}% `}
      color={theme.palette.chartColors[0]}
      stroke={theme.palette.chartColors[0]}
      todayMessage=""
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
      headerText="Staked Supply"
      color={theme.palette.chartColors[4]}
      stroke={theme.palette.chartColors[4]}
      bulletpoints={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
      todayMessage=""
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
    blockRateSeconds &&
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
      color={theme.palette.chartColors[3]}
      stroke={theme.palette.chartColors[3]}
      bulletpoints={bulletpoints.apy}
      infoTooltipMessage={tooltipInfoMessages.apy}
      headerSubText={`${apy && apy[0].apy.toLocaleString("en-us")}%`}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      todayMessage=""
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
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[4]]}
      headerText="Runway Available"
      headerSubText={`${runway && trim(runway[0].runwayCurrent, 1)} Days`}
      dataFormat={["days"]}
      bulletpoints={runwayBulletpoints}
      itemNames={tooltipItems.runway}
      itemType={""}
      infoTooltipMessage={tooltipInfoMessages.runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      todayMessage=""
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
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[3]]}
      headerText="Dilution Over Time"
      dataFormat={["percent", "number"]}
      headerSubText={`${dilution && trim(dilution[0].percentage, 2)}%`}
      bulletpoints={bulletpoints.dilution}
      itemNames={tooltipItems.dilution}
      itemType={[itemType.percentage, "sEXOD"]}
      infoTooltipMessage={tooltipInfoMessages.dilution}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      todayMessage=""
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
      .map((entry, index) => {
        const lastFiveDays = data.slice(index, Math.min(index + 5, data.length));
        const fiveDayAverage =
          lastFiveDays.reduce((previous, current) => current.ohmMinted + previous, 0).toFixed(2) / 5;
        return {
          timestamp: entry.timestamp,
          ohmMinted: entry.ohmMinted,
          fiveDayAverage: index < data.length - 5 ? fiveDayAverage : null,
        };
      })
      .slice(0, data.length - 1);

  const fiveDaySlice = minted && minted.slice(0, 5);
  //react-query is so weird why won't it let me use .reduce() T_T
  let fiveDayTotal = 0;
  for (let i = 0; i < 5; i++) {
    fiveDayTotal += fiveDaySlice && fiveDaySlice[i].ohmMinted;
  }

  return (
    <ExodiaMultiLineChart
      dataFormat={["OHM", "OHM"]}
      data={minted}
      dataKey={["ohmMinted", "fiveDayAverage"]}
      itemNames={tooltipItems.minted}
      itemType={itemType.OHM}
      headerText={`${OHM_TICKER} minted`}
      colors={[theme.palette.chartColors[4], theme.palette.chartColors[0]]}
      stroke={[theme.palette.chartColors[4], theme.palette.chartColors[0]]}
      bulletpoints={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.minted}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${(fiveDayTotal && fiveDayTotal / 5).toFixed(2)} EXOD`}
      todayMessage="5-day Average"
      glowDeviation="4"
      showNulls
    />
  );
};

export const OhmMintedPerTotalSupplyGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const minted =
    data &&
    data
      .map((entry, index) => {
        const lastFiveDays = data.slice(index, Math.min(index + 5, data.length));
        const fiveDayAverage =
          lastFiveDays
            .reduce((previous, current) => (current.ohmMinted / current.totalSupply) * 100 + previous, 0)
            .toFixed(2) / 5;
        return {
          timestamp: entry.timestamp,
          mintedPercent: (entry.ohmMinted / entry.totalSupply) * 100,
          fiveDayAveragePercent: index < data.length - 5 ? fiveDayAverage : null,
        };
      })
      .slice(0, data.length - 1);

  const fiveDaySlice = minted && minted.slice(0, 5);
  let fiveDayTotal = 0;
  for (let i = 0; i < 5; i++) {
    fiveDayTotal += fiveDaySlice && fiveDaySlice[i].mintedPercent;
  }
  return (
    <ExodiaMultiLineChart
      glowDeviation="4"
      dataFormat={["percent", "percent"]}
      data={minted}
      dataKey={["mintedPercent", "fiveDayAveragePercent"]}
      itemNames={tooltipItems.mcs}
      itemType={itemType.percentage}
      headerText={`${OHM_TICKER} Minted/Total Supply`}
      colors={[theme.palette.chartColors[3], theme.palette.chartColors[0]]}
      stroke={[theme.palette.chartColors[3], theme.palette.chartColors[0]]}
      bulletpoints={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.mcs}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${(fiveDayTotal && fiveDayTotal / 5).toFixed(2)}%`}
      todayMessage="5-day Average"
      showNulls
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
      daiDebtRatio: entry.dai_debt_ratio / 1e8,
      ethDebtRatio: entry.eth_debt_ratio / 1e8,
      ohmDaiDebtRatio: entry.ohmdai_debt_ratio / 1e17,
      monolithDebtRatio: Math.max(entry.monolith_debt_ratio / 1e8 || 0, entry.monolithV2_debt_ratio / 1e8 || 0),
      gOhmDebtRatio: entry.gOhm_debt_ratio / 1e8,
      fBeetsDebtRatio: entry.fBeets_debt_ratio / 1e8,
    }));

  return (
    <ExodiaMultiLineChart
      deviation="2"
      data={debtRatios}
      dataKey={[
        "daiDebtRatio",
        "ethDebtRatio",
        "ohmDaiDebtRatio",
        "monolithDebtRatio",
        "gOhmDebtRatio",
        "fBeetsDebtRatio",
      ]}
      colors={[
        theme.palette.chartColors[1],
        theme.palette.chartColors[3],
        theme.palette.chartColors[6],
        theme.palette.chartColors[0],
        theme.palette.chartColors[4],
        theme.palette.chartColors[5],
      ]}
      stroke={[
        theme.palette.chartColors[1],
        theme.palette.chartColors[3],
        theme.palette.chartColors[6],
        theme.palette.chartColors[0],
        theme.palette.chartColors[4],
        theme.palette.chartColors[5],
      ]}
      headerText="Debt Ratios"
      headerSubText={`Total ${
        debtRatios &&
        trim(
          debtRatios[0].daiDebtRatio +
            debtRatios[0].ethDebtRatio +
            debtRatios[0].ohmDaiDebtRatio +
            debtRatios[0].monolithDebtRatio +
            debtRatios[0].gOhmDebtRatio,
          2,
        )
      }%`}
      dataFormat={["percent"]}
      bulletpoints={bulletpoints.runway}
      itemNames={tooltipItems.debtratio}
      itemType={itemType.percentage}
      infoTooltipMessage={tooltipInfoMessages.debtratio}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      isDebt={true}
      todayMessage=""
      showTotal
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
      colors={[theme.palette.chartColors[0], theme.palette.chartColors[4]]}
      stroke={[theme.palette.chartColors[0], theme.palette.chartColors[4]]}
      headerText="Index Adjusted Price"
      headerSubText={`$${indexAdjustedPrice && trim(indexAdjustedPrice[0].indexAdjustedPrice, 2)}`}
      dataFormat={["$"]}
      bulletpoints={bulletpoints.indexAdjustedPrice}
      itemNames={tooltipItems.indexAdjustedPrice}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.indexAdjustedPrice}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      todayMessage=""
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
      colors={[theme.palette.chartColors[4], theme.palette.chartColors[0]]}
      stroke={[theme.palette.chartColors[4], theme.palette.chartColors[0]]}
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
      todayMessage=""
      isGrowthOfSupply
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
  const isVerySmallScreen = useMediaQuery("(max-width: 450px)");

  const exodValue = data && data[0].treasuryMonolithExodValue + data[0].treasuryMonolithWsExodValue;
  const daiValue = data && data[0].treasuryDaiMarketValue;
  const maiValue = data && data[0].treasuryMaiBalance;
  const ftmValue = data && data[0].treasuryWETHMarketValue;
  const gOhmValue = data && data[0].treasuryGOhmMarketValue;
  const fBeetsValue = data && data[0].treasuryfBeetsValue;

  const exodValuePrevious = data && data[1].treasuryMonolithExodValue + data[1].treasuryMonolithWsExodValue;
  const daiValuePrevious = data && data[1].treasuryDaiMarketValue;
  const maiValuePrevious = data && data[1].treasuryMaiBalance;
  const ftmValuePrevious = data && data[1].treasuryWETHMarketValue;
  const gOhmValuePrevious = data && data[1].treasuryGOhmMarketValue;
  const fBeetsValuePrevious = data && data[1].treasuryfBeetsValue;

  const totalValue = data && data[0].treasuryMarketValue;
  const lastValue = data && data[1].treasuryMarketValue;

  const formattedValue = formatCurrency(totalValue);

  const pieData = totalValue && [
    { value: Number(trim((exodValue / totalValue) * 100, 2)), name: "EXOD" },
    { value: Number(trim((daiValue / totalValue) * 100, 2)), name: "DAI" },
    { value: Number(trim((maiValue / totalValue) * 100, 2)), name: "MAI" },
    { value: Number(trim((ftmValue / totalValue) * 100, 2)), name: "wFTM" },
    { value: Number(trim((gOhmValue / totalValue) * 100, 2)), name: "gOHM" },
    { value: Number(trim((fBeetsValue / totalValue) * 100, 2)), name: "fBEETS" },
  ];

  return (
    <Grid container>
      <Box display="flex" justifyContent="space-between" style={{ width: "100%" }}>
        <Typography
          variant="h6"
          color="textPrimary"
          style={{
            marginBottom: "6px",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <SvgIcon
            color="textPrimary"
            component={AccountBalance}
            style={{ marginRight: "10px", overflow: "visible" }}
          />
          Treasury Breakdown
        </Typography>
        <Typography variant="h6" style={{ textAlign: "right" }}>
          <Trend formattedValue={formattedValue} value={totalValue} lastValue={lastValue} />
        </Typography>
      </Box>

      <Grid
        xs={isVerySmallScreen ? 12 : 5}
        sm={5}
        md={5}
        lg={5}
        style={{ margin: "0", height: isVerySmallScreen ? "140px" : "auto" }}
      >
        <ExodiaPieChart
          data={pieData}
          colors={theme.palette.chartColors}
          headerText=""
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
      <Grid xs={isVerySmallScreen ? 12 : 7} sm={7} md={7} lg={7} style={{ height: "50%" }}>
        <TreasuryTable
          currentData={[exodValue, daiValue, maiValue, ftmValue, gOhmValue, fBeetsValue]}
          previousData={[
            exodValuePrevious,
            daiValuePrevious,
            maiValuePrevious,
            ftmValuePrevious,
            gOhmValuePrevious,
            fBeetsValuePrevious,
          ]}
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
  const isSmallScreen = useMediaQuery("(max-width: 550px)");

  return (
    <div>
      <TableGrid header isSmallScreen={isSmallScreen}>
        <Cell>
          <Typography variant="body1" color="textSecondary">
            <Trans>Asset</Trans>
          </Typography>
        </Cell>
        <Cell center>
          <Typography variant="body1" color="textSecondary">
            <Trans>Value</Trans>
          </Typography>
        </Cell>
        <Cell center>
          <Typography variant="body1" color="textSecondary">
            <Trans>%</Trans>
          </Typography>
        </Cell>
        <Cell center>
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
              <Cell center>
                <Typography variant="body1">
                  {isSmallScreen ? `$${trimNumber(currentData[index])}` : formatCurrency(currentData[index])}
                </Typography>
              </Cell>
              <Cell center>
                <Typography variant="body1">
                  {trim((currentData[index] / totalValue) * 100, isSmallScreen ? 0 : 1)}%
                </Typography>
              </Cell>
              <Cell center>
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

  ${({ header }) => header && "padding-bottom: 12px;  margin-top: 32px;"}
  ${({ header, isSmallScreen }) => header && isSmallScreen && "margin-top: 42px;"}
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
  ${({ center }) => center && "justify-self: center;"}
`;
