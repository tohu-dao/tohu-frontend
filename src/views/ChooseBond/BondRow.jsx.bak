import BondLogo from "../../components/BondLogo";
import { DisplayBondPrice, DisplayBondDiscount } from "../Bond/Bond";
import { trim } from "../../helpers";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";
import useBonds from "src/hooks/Bonds";
import { useWeb3Context } from "../../hooks/web3Context";

export function BondDataCard({ bond, upcoming }) {
  const { chainID } = useWeb3Context();
  const { loading } = useBonds(chainID);
  const isBondLoading = (!bond.bondPrice && !upcoming) ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.name}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <Typography>{bond.displayName}</Typography>
            {bond.lpUrl && (
              <div>
                <Link href={bond.lpUrl} target="_blank" rel="nofollow noopener noreferrer">
                  <Typography variant="body1">
                    <Trans>View Pool</Trans>
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </Typography>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Price</Trans>
          </Typography>
          <Typography className="bond-price">
            <>
              {isBondLoading ? (
                <Skeleton width="50px" />
              ) : upcoming ? (
                "Coming Soon!"
              ) : (
                <DisplayBondPrice key={bond.name} bond={bond} />
              )}
            </>
          </Typography>
        </div>
        {!bond.isAbsorption && (
          <div className="data-row">
            <Typography>
              <Trans>ROI</Trans>
            </Typography>
            <Typography>
              {isBondLoading ? (
                <Skeleton width="50px" />
              ) : upcoming ? (
                "-"
              ) : (
                <DisplayBondDiscount key={bond.name} bond={bond} />
              )}
            </Typography>
          </div>
        )}

        <div className="data-row">
          <Typography>
            <Trans>Purchased</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : upcoming ? (
              "-"
            ) : bond.isAbsorption ? (
              <>
                {trim(bond.purchased, 2)} {bond.displayName}
              </>
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </Typography>
        </div>
        {upcoming ? (
          <Button variant="outlined" color="primary" fullWidth disabled>
            <Typography variant="h5">{t`Bond ${bond.displayName}`}</Typography>
          </Button>
        ) : (
          <Link component={NavLink} to={`/${bond.isAbsorption ? "absorption" : "bonds"}/${bond.name}`}>
            <Button variant="outlined" color="primary" fullWidth disabled={!bond.isAvailable[chainID]}>
              <Typography variant="h5">
                {!bond.isAvailable[chainID] ? t`Sold Out` : t`Bond ${bond.displayName}`}
              </Typography>
            </Button>
          </Link>
        )}
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond, upcoming }) {
  const { chainID } = useWeb3Context();
  // Use BondPrice as indicator of loading.
  const isBondLoading = (!bond.bondPrice && !upcoming) ?? true;
  // const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  return (
    <TableRow id={`${bond.name}--bond`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bond.displayName}</Typography>
          {bond.lpUrl && (
            <Link color="primary" href={bond.lpUrl} target="_blank" rel="nofollow noopener noreferrer">
              <Typography variant="body1">
                <Trans>View Pool</Trans>
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        <Typography>
          <>
            {isBondLoading ? (
              <Skeleton width="50px" />
            ) : upcoming ? (
              "Coming Soon!"
            ) : (
              <DisplayBondPrice key={bond.name} bond={bond} />
            )}
          </>
        </Typography>
      </TableCell>
      {!bond.isAbsorption && (
        <TableCell align="left">
          {" "}
          {isBondLoading ? (
            <Skeleton width="50px" />
          ) : upcoming ? (
            "-"
          ) : (
            <DisplayBondDiscount key={bond.name} bond={bond} upcoming />
          )}
        </TableCell>
      )}
      <TableCell align="right">
        {isBondLoading ? (
          <Skeleton />
        ) : upcoming ? (
          "-"
        ) : bond.isAbsorption ? (
          <>
            {trim(bond.purchased, 2)} {bond.displayName}
          </>
        ) : (
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(bond.purchased)
        )}
      </TableCell>
      <TableCell>
        {upcoming ? (
          <Button variant="outlined" color="primary" disabled>
            <Typography variant="h6">{t`do_bond`}</Typography>
          </Button>
        ) : (
          <Link component={NavLink} to={`/${bond.isAbsorption ? "absorption" : "bonds"}/${bond.name}`}>
            <Button variant="outlined" color="primary" disabled={!bond.isAvailable[chainID]}>
              <Typography variant="h6">{!bond.isAvailable[chainID] ? t`Sold Out` : t`do_bond`}</Typography>
            </Button>
          </Link>
        )}
      </TableCell>
    </TableRow>
  );
}
