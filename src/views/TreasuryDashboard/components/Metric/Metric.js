import { useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { Typography, Box, useMediaQuery, useTheme } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim, formatCurrency } from "../../../../helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import { getTokenBalances } from "../Graph/treasuryGraphHelpers";
import { tooltipInfoMessages } from "../../treasuryData";
import { useMyMetrics } from "../../hooks/useTreasuryMetrics";
import _ from "lodash";
import { OHM_TICKER, sOHM_TICKER, wsOHM_TICKER, EPOCH_INTERVAL } from "../../../../constants";

export const Metric = props => (
  <Box
    className={`metric ${props.className}`}
    display={props.isDashboard ? "flex" : undefined}
    flexDirection="column"
    alignItems="center"
    style={props.isDashboard ? { textAlign: "center", width: "100%", maxWidth: "unset" } : undefined}
  >
    {props.children}
  </Box>
);

Metric.Value = props => <Typography variant="h5">{props.children || <Skeleton type="text" />}</Typography>;

Metric.Title = props => (
  <Typography variant="h6" color="textSecondary">
    {props.children}
  </Typography>
);

Metric.SmallTitle = props => {
  const isSmallScreen = useMediaQuery("(max-width: 550px)");

  return (
    <Typography
      variant={isSmallScreen ? "body2" : "h6"}
      color="textSecondary"
      style={{
        width: "100%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "normal",
      }}
    >
      {props.children}
    </Typography>
  );
};

Metric.SmallValue = props => (
  <Typography variant="h6" style={{ width: "100%", textAlign: "center", whiteSpace: "normal" }}>
    {props.children || <Skeleton type="text" />}
  </Typography>
);

export const MarketCap = ({ isDashboard = false }) => {
  const marketCap = useSelector(state => state.app.marketCap);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="market" isDashboard={isDashboard}>
      <Title>Market Cap</Title>
      <Value>{marketCap && formatCurrency(marketCap, 0)}</Value>
    </Metric>
  );
};

export const OHMPrice = ({ isDashboard = false }) => {
  const marketPrice = useSelector(state => state.app.marketPrice);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="price" isDashboard={isDashboard}>
      <Title>{OHM_TICKER} Price</Title>
      <Value>{marketPrice && formatCurrency(marketPrice, 2)}</Value>
    </Metric>
  );
};

export const CircSupply = ({ isDashboard = false }) => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);

  const isDataLoaded = circSupply && totalSupply;
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="circ" isDashboard={isDashboard}>
      <Title>
        {isDashboard ? "Supply" : "Supply (Circulating / Total)"}
        <InfoTooltip message={tooltipInfoMessages.supply} />
      </Title>
      <Value>{isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}</Value>
    </Metric>
  );
};

export const BackingPerOHM = ({ isDashboard = false }) => {
  const theme = useTheme();
  const backingPerExod = useSelector(state => state.app.backingPerExod);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="bpo" isDashboard={isDashboard}>
      <Title>
        {isDashboard ? "Backing" : `Backing per ${OHM_TICKER}`}
        <InfoTooltip message={tooltipInfoMessages.backing} />
      </Title>
      <Value>{!isNaN(backingPerExod) && formatCurrency(backingPerExod, 2)}</Value>
    </Metric>
  );
};

export const CurrentIndex = ({ isDashboard = false }) => {
  const currentIndex = useSelector(state => state.app.currentIndex);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="index" isDashboard={isDashboard}>
      <Title>
        Current Index
        <InfoTooltip message="The current index tracks the amount of sEXOD accumulated since the beginning of staking. Basically, how much sEXOD one would have if they staked and held a single EXOD from day 1." />
      </Title>
      <Value>{currentIndex && trim(currentIndex, 2) + " " + sOHM_TICKER}</Value>
    </Metric>
  );
};

export const WSOHMPrice = ({ isDashboard = false }) => {
  const wsExodPrice = useSelector(state => state.app.wsExodPrice);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="wsoprice" isDashboard={isDashboard}>
      <Title>
        {wsOHM_TICKER} Price
        <InfoTooltip
          message={
            "wsEXOD = sEXOD * index\n\nThe price of wsEXOD is equal to the price of EXOD multiplied by the current index"
          }
        />
      </Title>
      <Value>{wsExodPrice && formatCurrency(wsExodPrice, 2)}</Value>
    </Metric>
  );
};

export const StakedPercentage = ({ isDashboard = false }) => {
  const stakedPercentage = useSelector(state => state.app.stakedPercentage);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="wsoprice" isDashboard={isDashboard}>
      <Title>
        Staked supply
        <InfoTooltip message={tooltipInfoMessages.staked} />
      </Title>
      <Value>{stakedPercentage && trim(stakedPercentage, 2)}%</Value>
    </Metric>
  );
};

export const CurrentRunway = ({ isDashboard = false }) => {
  const runway = useSelector(state => state.app.runway);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="wsoprice" isDashboard={isDashboard}>
      <Title>
        Runway
        <InfoTooltip message={tooltipInfoMessages.runway} />
      </Title>
      <Value>{runway && trim(runway, 1)} Days</Value>
    </Metric>
  );
};
