import { useSelector } from "react-redux";
import { Box, Container, SvgIcon, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Trans } from "@lingui/macro";
import { ShowChart } from "@material-ui/icons";
import { trim } from "../../helpers";

const ApyMetric = () => {
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY || 0;
  });
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  return (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="h5">
        <SvgIcon color="primary" component={ShowChart} style={{ marginRight: "12px" }} />
        <Trans>APY</Trans>
      </Typography>
      {trimmedStakingAPY > 0 ? (
        <Typography variant="h5">{new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%</Typography>
      ) : (
        <Skeleton />
      )}
    </Box>
  );
};

export default ApyMetric;
