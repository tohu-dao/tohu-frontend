import React from "react";
import styled from "styled-components";
import { ReactComponent as Info } from "src/assets/icons/info.svg";
import { Typography, SvgIcon, useTheme } from "@material-ui/core";
import { BEETS_LINK } from "src/constants";

const MigrationMessage = () => {
  const theme = useTheme();

  return (
    <BannerContainer theme={theme}>
      <SvgIcon component={Info}></SvgIcon>
      <Typography variant="body1">
        Exodia has migrated liquidity to{" "}
        <a href={BEETS_LINK} target="_blank" rel="nofollow noopener noreferrer">
          Beethoven-x
        </a>
        . Please use{" "}
        <a href={BEETS_LINK} target="_blank" rel="nofollow noopener noreferrer">
          Beethoven-x
        </a>{" "}
        to trade EXOD and wsEXOD.
      </Typography>
    </BannerContainer>
  );
};

export default MigrationMessage;

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  width: 100%;
  min-height: 3rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.primaryColorDimmed};
  color: ${({ theme }) => theme.palette.primaryButtonColor};
  svg {
    margin-right: 12px;
    path {
      fill: ${({ theme }) => theme.palette.primaryButtonColor};
    }
  }

  a {
    color: ${({ theme }) => theme.palette.chartColors[1]};
  }
`;
