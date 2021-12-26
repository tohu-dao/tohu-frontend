import { useState, useCallback } from "react";
import { t, Trans } from "@lingui/macro";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import { TxnButtonTextGeneralPending } from "src/components/TxnButtonText";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { useAppSelector } from "src/hooks";
import useBonds from "src/hooks/Bonds";
import { error } from "../../slices/MessagesSlice";
import { IUserBondDetails } from "src/slices/AccountSlice";
import {
  Typography,
  Button,
  SvgIcon,
  Link,
  FormControl,
  OutlinedInput,
  Box,
  InputAdornment,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import { Skeleton } from "@material-ui/lab";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { trim } from "../../helpers";

const QuickStaking = () => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const [view, setView] = useState(0);

  const isAppLoading = useSelector(state => state.app.loading);

  const ohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });
  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your EXOD balance.`));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot unstake more than your sEXOD balance.`));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
    setQuantity(0);
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const setMax = () => {
    if (view === 0) {
      setQuantity(Number(ohmBalance));
    } else {
      setQuantity(Number(sohmBalance));
    }
  };

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  return isAppLoading ? (
    <Skeleton />
  ) : (
    <>
      <Header>
        <Typography variant="h5" style={{ display: "flex", alignItems: "center" }}>
          <SvgIcon color="primary" component={StakeIcon} style={{ marginRight: "12px" }} />
          <Trans>My Staking</Trans>
        </Typography>
        <Container>
          <FormControl
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              margin: "0",
              height: "24px",
              minWidth: "unset",
            }}
          >
            <Select
              value={view}
              onChange={e => {
                setView(e.target.value);
                setQuantity("");
              }}
              disableUnderline
            >
              <MenuItem value={0}>Stake</MenuItem>
              <MenuItem value={1}>Unstake</MenuItem>
            </Select>
          </FormControl>
          <Link to="/stake" component={NavLink}>
            <Trans>View Staking</Trans>
          </Link>
        </Container>
      </Header>
      <Container>
        <Balances>
          <>
            <Typography variant="body1">EXOD:</Typography>
            <Typography variant="body1">{trim(ohmBalance || 0, 2)}</Typography>
          </>
          <>
            <Typography variant="body1">sEXOD:</Typography>
            <Typography variant="body1">{trim(sohmBalance || 0, 2)}</Typography>
          </>
        </Balances>
        <InputContainer>
          {(!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1) ? (
            <Box className="help-text">
              <Typography variant="body1" className="stake-note" color="textSecondary">
                {view === 0 ? (
                  <>
                    <Trans>Please approve Exodia to use your</Trans> <b>EXOD</b> <Trans>for staking</Trans>.
                  </>
                ) : (
                  <>
                    <Trans>Please approve Exodia to use your</Trans> <b>sEXOD</b> <Trans>for unstaking</Trans>.
                  </>
                )}
              </Typography>
            </Box>
          ) : (
            <FormControl
              className="ohm-input"
              variant="outlined"
              color="primary"
              style={{ marginLeft: "0px !important" }}
            >
              <OutlinedInput
                id="amount-input"
                type="number"
                placeholder="Amount..."
                className="stake-input"
                value={quantity}
                onChange={e => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                labelWidth={0}
                autoFocus
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="text" onClick={setMax} color="inherit" style={{ margin: "0", padding: "0" }}>
                      <Trans>Max</Trans>
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
          {view === 0 ? (
            !hasAllowance("ohm") ? (
              <Button
                variant="outlined"
                color="primary"
                disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                onClick={() => {
                  onSeekApproval("ohm");
                }}
              >
                <TxnButtonTextGeneralPending
                  pendingTransactions={pendingTransactions}
                  type="approve_staking"
                  defaultText={<Trans>Approve</Trans>}
                />
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                disabled={isPendingTxn(pendingTransactions, "staking") || !quantity}
                onClick={() => {
                  onChangeStake("stake");
                }}
              >
                <TxnButtonTextGeneralPending
                  pendingTransactions={pendingTransactions}
                  type="staking"
                  defaultText={<Trans>Stake EXOD</Trans>}
                />
              </Button>
            )
          ) : !hasAllowance("sohm") ? (
            <Button
              variant="outlined"
              color="primary"
              disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
              onClick={() => {
                onSeekApproval("sohm");
              }}
            >
              <TxnButtonTextGeneralPending
                pendingTransactions={pendingTransactions}
                type="approve_unstaking"
                defaultText={<Trans>Approve</Trans>}
              />
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              disabled={isPendingTxn(pendingTransactions, "unstaking") || !quantity}
              onClick={() => {
                onChangeStake("unstake");
              }}
            >
              <TxnButtonTextGeneralPending
                pendingTransactions={pendingTransactions}
                type="unstaking"
                defaultText={<Trans>Unstake EXOD</Trans>}
              />
            </Button>
          )}
        </InputContainer>
      </Container>
    </>
  );
};

export default QuickStaking;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    font-size: 1rem;
    padding: 12px 12px;
  }
  .MuiInputBase-root {
    height: 34px;
    width: 100%;
  }
  .MuiFormControl-root {
    margin: 0 12px !important;
  }
`;

const InputContainer = styled(Container)`
  .help-text {
    margin-right: 12px;
  }
  @media (max-width: 450px) {
    flex-direction: column;

    button {
      width: 100%;
    }
    .ohm-input {
      margin-bottom: 12px !important;
    }
    .help-text {
      text-align: center;
    }
  }
`;

const Balances = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 12px;
  width: 104px;
  min-width: 104px;
  margin-right: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
  width: 100%;
`;
