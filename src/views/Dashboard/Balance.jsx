import { useSelector } from "react-redux";
import { trim } from "../../helpers";
import { Box, SvgIcon, Typography, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Trans } from "@lingui/macro";
import { AccountBalanceWallet } from "@material-ui/icons";

const Balance = () => {
  const isSmallScreen = useMediaQuery("(max-width: 450px)");

  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const isAppLoading = useSelector(state => state.app.loading);

  return (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">
          <SvgIcon color="primary" component={AccountBalanceWallet} style={{ marginRight: "12px" }} />
          <Trans>Wallet</Trans>
        </Typography>
      </Box>
      {isAppLoading ? (
        <Skeleton />
      ) : (
        <Box
          display="flex"
          alignItems={isSmallScreen ? "flex-end" : "center"}
          flexDirection={isSmallScreen ? "column" : "row"}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" style={{ marginRight: "12px", marginLeft: "18px" }}>
              {trim(ohmBalance || 0, 2)}
            </Typography>
            <Typography variant="body1">EXOD</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" style={{ marginRight: "12px", marginLeft: "18px" }}>
              {trim(sohmBalance || 0, 2)}
            </Typography>
            <Typography variant="body1">sEXOD</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" style={{ marginRight: "12px", marginLeft: "18px" }}>
              {trim(wsohmBalance || 0, 3)}
            </Typography>
            <Typography variant="body1">wsEXOD</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Balance;
