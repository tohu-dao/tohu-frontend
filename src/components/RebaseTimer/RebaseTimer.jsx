import { useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { prettifySeconds } from "../../helpers";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { Trans } from "@lingui/macro";

const RebaseTimer = () => {
  const secondsUntilRebase = useSelector(state => {
    return state.app.secondsUntilRebase;
  });

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  return (
    <Box className="rebase-timer">
      <Typography variant="body2" color="textPrimary">
        {currentBlock ? (
          secondsUntilRebase > 0 ? (
            <>
              <strong>{prettifySeconds(secondsUntilRebase) || <Trans>Less than a minute</Trans>}&nbsp;</strong>
              <Trans>to next rebase</Trans>
            </>
          ) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
};

export default RebaseTimer;
