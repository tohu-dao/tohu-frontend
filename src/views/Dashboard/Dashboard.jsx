import { memo } from "react";
import { useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { trim } from "../../helpers";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import {
  OHMPrice,
  CurrentRunway,
  WSOHMPrice,
  CircSupply,
  BackingPerOHM,
  CurrentIndex,
  StakedPercentage,
} from "../TreasuryDashboard/components/Metric/Metric";
import { TwitterTimelineEmbed } from "react-twitter-embed";

import { Paper, Grid, Box, Zoom, Container, useMediaQuery, SvgIcon, Typography, useTheme } from "@material-ui/core";
import "../TreasuryDashboard/treasury-dashboard.scss";
import {
  DashboardPriceGraph,
  MarketValueGraph,
  TreasuryBreakdownPie,
} from "../TreasuryDashboard/components/Graph/Graph";
import { Skeleton } from "@material-ui/lab";
import { t, Trans } from "@lingui/macro";
import { ShowChart, AccountBalanceWallet, AccessTime } from "@material-ui/icons";
import QuickRedeem from "./QuickRedeem";
import QuickStaking from "./QuickStaking";
import RebaseTimer from "src/components/RebaseTimer/RebaseTimer";
import TwitterFeed from "./TwitterFeed";
import ApyMetric from "./ApyMetric";
import Balance from "./Balance";
import MigrationMessage from "src/components/MigrationMessage";

const Dashboard = memo(() => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 450px)");
  // Use marketPrice as indicator of loading.
  const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Zoom in={true}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card" style={{ paddingBottom: "20px" }}>
                <ApyMetric />
              </Paper>
            </Grid>
            {isSmallScreen && (
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Paper className="ohm-card" style={{ paddingBottom: "20px" }}>
                  <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h5">
                      <SvgIcon
                        color="primary"
                        component={AccessTime}
                        style={{ marginRight: "12px", overflow: "visible" }}
                      />
                      <Trans>Rebase Timer</Trans>
                    </Typography>
                    <RebaseTimer />
                  </Box>
                </Paper>
              </Grid>
            )}
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card" style={{ paddingBottom: "20px" }}>
                <Balance />
              </Paper>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card" style={{ paddingBottom: "20px", height: "100%" }}>
                <QuickStaking />
              </Paper>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper
                className="ohm-card"
                style={{
                  paddingBottom: "20px",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <QuickRedeem />
              </Paper>
            </Grid>
            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
              <MigrationMessage />
            </Grid> */}
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card" style={{ paddingBottom: "5px" }}>
                <DashboardPriceGraph isDashboard />
              </Paper>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card" style={{ paddingBottom: "5px" }}>
                <MarketValueGraph isDashboard />
              </Paper>
            </Grid>
            {isVerySmallScreen ? <SmallMetrics /> : <Metrics />}

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper
                className="ohm-card"
                style={{ paddingBottom: "5px", maxHeight: "450px", height: isVerySmallScreen ? "450px" : "auto" }}
              >
                <TreasuryBreakdownPie />
              </Paper>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card twitter-feed" style={{ paddingBottom: "5px", height: "100%" }}>
                <TwitterFeed />
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
});

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <Dashboard />
  </QueryClientProvider>
);

const Metrics = () => {
  return (
    <>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Paper className="ohm-card" style={{ width: "calc(33% - 8px)", margin: "0", padding: "10px 6px" }}>
            <OHMPrice isDashboard />
          </Paper>
          <Paper className="ohm-card" style={{ width: "calc(33% - 8px)", margin: "0", padding: "10px 6px" }}>
            <StakedPercentage isDashboard />
          </Paper>
          <Paper className="ohm-card" style={{ width: "calc(33% - 8px)", margin: "0", padding: "10px 6px" }}>
            <CurrentRunway isDashboard />
          </Paper>
        </Box>
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Paper className="ohm-card" style={{ width: "calc(33% - 8px)", margin: "0", padding: "10px 6px" }}>
            <BackingPerOHM isDashboard />
          </Paper>
          <Paper className="ohm-card" style={{ width: "calc(33% - 8px)", margin: "0", padding: "10px 6px" }}>
            <CurrentIndex isDashboard />
          </Paper>
          <Paper className="ohm-card" style={{ width: "calc(33% - 8px)", margin: "0", padding: "10px 6px" }}>
            <CircSupply isDashboard />
          </Paper>
        </Box>
      </Grid>
    </>
  );
};

const SmallMetrics = () => {
  return (
    <>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Paper className="ohm-card" style={{ width: "calc(50% - 8px)", margin: "0", padding: "10px 6px" }}>
            <OHMPrice isDashboard />
          </Paper>
          <Paper className="ohm-card" style={{ width: "calc(50% - 8px)", margin: "0", padding: "10px 6px" }}>
            <StakedPercentage isDashboard />
          </Paper>
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Paper className="ohm-card" style={{ width: "calc(50% - 8px)", margin: "0", padding: "10px 6px" }}>
            <CurrentRunway isDashboard />
          </Paper>

          <Paper className="ohm-card" style={{ width: "calc(50% - 8px)", margin: "0", padding: "10px 6px" }}>
            <BackingPerOHM isDashboard />
          </Paper>
        </Box>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Paper className="ohm-card" style={{ width: "calc(50% - 8px)", margin: "0", padding: "10px 6px" }}>
            <CurrentIndex isDashboard />
          </Paper>
          <Paper className="ohm-card" style={{ width: "calc(50% - 8px)", margin: "0", padding: "10px 6px" }}>
            <CircSupply isDashboard />
          </Paper>
        </Box>
      </Grid>
    </>
  );
};
