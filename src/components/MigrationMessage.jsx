import React from "react";
import styled from "styled-components";
import { ReactComponent as Info } from "src/assets/icons/info.svg";
import { Typography, SvgIcon, useTheme } from "@material-ui/core";

const MESSAGE =
  "Exodia is currently migrating liquidity to Beethoven. Please note that during this time, frontend metrics may be inaccurate.";

const MigrationMessage = () => {
  const theme = useTheme();

  return (
    <BannerContainer background={theme.palette.primaryColorDimmed} textColor={theme.palette.primaryButtonColor}>
      <SvgIcon component={Info}></SvgIcon>
      <Typography variant="body1">{MESSAGE}</Typography>
    </BannerContainer>
  );
};

export default MigrationMessage;

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  width: 100%;
  height: 3rem;
  padding: 1rem;
  background-color: ${({ background }) => background};
  color: ${({ textColor }) => textColor};
  svg {
    margin-right: 12px;
    path {
      fill: ${({ textColor }) => textColor};
    }
  }
`;
