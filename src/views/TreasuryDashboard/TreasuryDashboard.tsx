import { memo } from "react";
import "./treasury-dashboard.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { MarketCap, OHMPrice, WSOHMPrice, CircSupply, BackingPerOHM, CurrentIndex } from "./components/Metric/Metric";

import {
  TotalValueDepositedGraph,
  MarketValueGraph,
  RiskFreeValueGraph,
  ProtocolOwnedLiquidityGraph,
  OHMStakedGraph,
  APYOverTimeGraph,
  RunwayAvailableGraph,
  DilutionGraph,
  DebtRatioGraph,
  OhmMintedGraph,
  OhmMintedPerTotalSupplyGraph,
  IndexAdjustedPrice,
  GrowthOfSupply,
  TokenQuantities,
  Holders,
  AssetTypeBreakdown,
  BondRevenue,
  BondDiscounts,
  BackingPerExod,
  Premium,
} from "./components/Graph/Graph";
import MigrationMessage from "src/components/MigrationMessage";

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className="hero-metrics">
          <Paper className="ohm-card" style={{ maxHeight: "auto" }}>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <MarketCap />
              <OHMPrice />
              <WSOHMPrice />
              <CircSupply />
              <BackingPerOHM />
              <CurrentIndex />
            </Box>
          </Paper>
        </Box>
        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
              <MigrationMessage />
            </Grid> */}
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <TotalValueDepositedGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <MarketValueGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <RiskFreeValueGraph />
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <TokenQuantities />
              </Paper>
            </Grid>

            {/* Will add when it looks better :') */}
            {/* <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Holders />
              </Paper>
            </Grid> */}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <ProtocolOwnedLiquidityGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <AssetTypeBreakdown />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <OHMStakedGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <RunwayAvailableGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <APYOverTimeGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <GrowthOfSupply />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <IndexAdjustedPrice />
              </Paper>
            </Grid>

            {/* Will turn on when looks better */}
            {/* <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <BackingPerExod />
              </Paper>
            </Grid> */}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <DilutionGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card bar-chart">
                <BondRevenue />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card bar-chart">
                <BondDiscounts />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <OhmMintedPerTotalSupplyGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card bar-chart">
                <Premium />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <OhmMintedGraph />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <DebtRatioGraph />
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
    <TreasuryDashboard />
  </QueryClientProvider>
);
