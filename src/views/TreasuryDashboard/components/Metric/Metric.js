import { useSelector } from "react-redux";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { trim, formatCurrency } from "../../../../helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
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

Metric.SmallTitle = props => (
  <Typography variant="h6" color="textSecondary" style={{ width: "100%", textAlign: "center" }}>
    {props.children}
  </Typography>
);

Metric.SmallValue = props => (
  <Typography variant="h6" style={{ width: "100%", textAlign: "center" }}>
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
      <Title> {isDashboard ? "Supply" : "Circulating Supply (total)"}</Title>
      <Value>{isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}</Value>
    </Metric>
  );
};

export const BackingPerOHM = ({ isDashboard = false }) => {
  const backingPerOhm = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="bpo" isDashboard={isDashboard}>
      <Title>{isDashboard ? "Backing" : `Backing per ${OHM_TICKER}`}</Title>
      <Value>{!isNaN(backingPerOhm) && formatCurrency(backingPerOhm, 2)}</Value>
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
        {!isDashboard && (
          <InfoTooltip message="The current index tracks the amount of sEXOD accumulated since the beginning of staking. Basically, how much sEXOD one would have if they staked and held a single EXOD from day 1." />
        )}
      </Title>
      <Value>{currentIndex && trim(currentIndex, 2) + " " + sOHM_TICKER}</Value>
    </Metric>
  );
};

export const WSOHMPrice = ({ isDashboard = false }) => {
  const wsOhmPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="wsoprice" isDashboard={isDashboard}>
      <Title>
        {wsOHM_TICKER} Price
        {!isDashboard && (
          <InfoTooltip
            message={
              "wsEXOD = sEXOD * index\n\nThe price of wsEXOD is equal to the price of EXOD multiplied by the current index"
            }
          />
        )}
      </Title>
      <Value>{wsOhmPrice && formatCurrency(wsOhmPrice, 2)}</Value>
    </Metric>
  );
};

export const StakedPercentage = ({ isDashboard = false }) => {
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;

  return (
    <Metric className="wsoprice" isDashboard={isDashboard}>
      <Title>Staked supply</Title>
      <Value>{data && trim((data[0].sOhmCirculatingSupply / data[0].ohmCirculatingSupply) * 100, 2)}%</Value>
    </Metric>
  );
};

export const CurrentRunway = ({ isDashboard = false }) => {
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const Title = isDashboard ? Metric.SmallTitle : Metric.Title;
  const Value = isDashboard ? Metric.SmallValue : Metric.Value;
  const epochLengthSeconds = EPOCH_INTERVAL * 0.9;

  return (
    <Metric className="wsoprice" isDashboard={isDashboard}>
      <Title>Runway</Title>
      <Value>{data && trim((data[0].runwayCurrent * 3 * epochLengthSeconds) / 86400, 2)} days</Value>
    </Metric>
  );
};
