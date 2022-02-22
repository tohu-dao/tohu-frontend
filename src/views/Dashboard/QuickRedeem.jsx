import { useEffect, useState } from "react";
import { t, Trans } from "@lingui/macro";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import { TxnButtonTextGeneralPending } from "src/components/TxnButtonText";
import { redeemAllBonds, redeemBond } from "src/slices/BondSlice";
import { calculateUserBondDetails } from "src/slices/AccountSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { useAppSelector } from "src/hooks";
import useBonds from "src/hooks/Bonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { Typography, Button, SvgIcon, Link } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Skeleton } from "@material-ui/lab";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { trim } from "../../helpers";

const QuickRedeem = () => {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(chainID);
  const [numberOfBonds, setNumberOfBonds] = useState(0);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const isAppLoading = useSelector(state => state.app.loading);

  const activeBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    [...bonds, ...expiredBonds].forEach(bond => {
      if (bond.interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond.name]);
      }
    });
    return withInterestDue;
  }, _.isEqual);

  useEffect(() => {
    let bondCount = Object.keys(activeBonds || {}).length;
    if (bondCount !== numberOfBonds) setNumberOfBonds(bondCount);
  }, [activeBonds]);

  const pendingClaim = () => {
    if (
      isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
      isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake") ||
      [...bonds, ...expiredBonds].some(bond => isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name)) ||
      [...bonds, ...expiredBonds].some(bond =>
        isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name + "_autostake"),
      )
    ) {
      return true;
    }

    return false;
  };

  const onRedeemAll = async ({ autostake }) => {
    const bondsToRedeem = [...bonds, ...expiredBonds].filter(bond =>
      activeBonds.some(activeBond => activeBond.bond === bond.name),
    );
    await dispatch(redeemAllBonds({ address, bonds: bondsToRedeem, networkID: chainID, provider, autostake }));
  };

  const totalVesting = activeBonds.reduce((total, bond) => total + Number(bond?.interestDue || 0), 0);
  const totalPending = activeBonds.reduce((total, bond) => total + Number(bond?.pendingPayout || 0), 0);

  return isAppLoading ? (
    <Skeleton />
  ) : (
    <>
      <Header>
        <Typography variant="h5" style={{ display: "flex", alignItems: "center" }}>
          <SvgIcon color="primary" component={BondIcon} style={{ marginRight: "12px" }} />
          <Trans>My Bonds</Trans>
        </Typography>
        <Link to="/bonds" component={NavLink}>
          <Trans>View all Bonds</Trans>
        </Link>
      </Header>
      <Container>
        <Balances>
          <>
            <Typography variant="body1">
              <Trans>Claimable:</Trans>
            </Typography>
            <Typography variant="body1">{trim(totalPending, 4)}</Typography>
          </>
          <>
            <Typography variant="body1">
              <Trans>Pending:</Trans>
            </Typography>
            <Typography variant="body1">{trim(totalVesting, 4)}</Typography>
          </>
        </Balances>

        <InputContainer>
          <Button
            variant="outlined"
            className="redeem-bonds"
            color="primary"
            disabled={pendingClaim() || !activeBonds.length}
            onClick={() => {
              onRedeemAll({ autostake: false });
            }}
          >
            <TxnButtonTextGeneralPending
              pendingTransactions={pendingTransactions}
              type="redeem_all_bonds"
              defaultText={<Trans>Claim</Trans>}
            />
          </Button>

          <Button
            variant="outlined"
            color="primary"
            disabled={pendingClaim() || !activeBonds.length}
            onClick={() => {
              onRedeemAll({ autostake: true });
            }}
          >
            <TxnButtonTextGeneralPending
              pendingTransactions={pendingTransactions}
              type="redeem_all_bonds_autostake"
              defaultText={<Trans>Claim and Stake</Trans>}
            />
          </Button>
        </InputContainer>
      </Container>
    </>
  );
};

export default QuickRedeem;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    font-size: 1rem;
    padding: 12px 12px;
    margin-left: 12px;
  }
`;

const InputContainer = styled(Container)`
  @media (max-width: 500px) {
    flex-direction: column;

    button {
      width: 100%;
    }

    .redeem-bonds {
      margin-bottom: 12px;
    }
  }
`;

const Balances = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 12px;
  width: 124px;
  min-width: 124px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
  width: 100%;
`;
