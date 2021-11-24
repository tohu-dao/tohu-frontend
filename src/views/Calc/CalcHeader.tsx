import React from "react";
import { Grid, Typography } from "@material-ui/core";

const CalcHeader = () => {
  return (
    <Grid item>
      <Typography variant="h5">Calc (🧪, 🧪)</Typography>
      <Typography variant="body1">Estimate your returns</Typography>
    </Grid>
  );
};

export default CalcHeader;
