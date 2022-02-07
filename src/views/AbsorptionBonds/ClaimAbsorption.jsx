import { useEffect, useState } from "react";
import { t, Trans } from "@lingui/macro";
import styled from "styled-components";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import { TxnButtonTextGeneralPending } from "src/components/TxnButtonText";
import { redeemAllBonds, redeemBond } from "src/slices/BondSlice";
import { calculateUserBondDetails } from "src/slices/AccountSlice";
import CardHeader from "src/components/CardHeader/CardHeader";
import { useWeb3Context } from "src/hooks/web3Context";
import { useAppSelector } from "src/hooks";
import useBonds from "src/hooks/Bonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import {
  Button,
  Box,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Typography,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useSelector, useDispatch } from "react-redux";
import { ClaimBondTableData, ClaimBondCardData } from "../ChooseBond/ClaimRow";
import "../ChooseBond/choosebond.scss";

function ClaimAbsorption() {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const { absorptionBonds } = useBonds(chainID);
  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const activeBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0 && state.account.bonds[bond].isAbsorption) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  }, _.isEqual);

  const pendingClaim = () => {
    if (absorptionBonds.some(bond => isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name))) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    let bondCount = Object.keys(activeBonds || {}).length;
    if (bondCount !== numberOfBonds) setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <>
      {numberOfBonds > 0 && (
        <Zoom in={true}>
          <Paper className="ohm-card claim-bonds-card" style={{ marginTop: "24px" }}>
            <CardHeader title="Your Bonds" />
            <Box>
              {!isSmallScreen && (
                <TableContainer>
                  <Table aria-label="Claimable bonds">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          <Trans>Bond</Trans>
                        </TableCell>
                        <TableCell align="center">
                          <Trans>Claimable</Trans>
                        </TableCell>
                        <TableCell align="center">
                          <Trans>Pending</Trans>
                        </TableCell>
                        <TableCell align="right">
                          <Trans>Fully Vested</Trans>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(activeBonds).map((bond, i) => (
                        <ClaimBondTableData key={i} userBond={bond} pendingClaim={pendingClaim} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {isSmallScreen &&
                Object.entries(activeBonds).map((bond, i) => (
                  <ClaimBondCardData key={i} userBond={bond} pendingClaim={pendingClaim} isAbsorption />
                ))}
            </Box>
          </Paper>
        </Zoom>
      )}
    </>
  );
}

export default ClaimAbsorption;

const SingleAutoStake = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
