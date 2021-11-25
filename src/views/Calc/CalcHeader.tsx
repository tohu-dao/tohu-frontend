import React from "react";
import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";

const CalcHeader = () => {
  return (
    <Grid item>
      <Heading variant="h5">OBLITERATOR (🧪 + 🧪 = ?)</Heading>
      <Typography variant="body1">Estimate your returns</Typography>
    </Grid>
  );
};

export default CalcHeader;

const Heading = styled(Typography)`
  font-weight: 600 !important;
  margin-bottom: 2px !important;
`;
