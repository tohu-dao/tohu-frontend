import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import styled from "styled-components";

type EstimatedValuesProps = {
  initialInvestment: number;
  estimatedROI: number;
  estimatedProfits: number;
  totalSExod: number
  totalReturns: number;
  breakEvenDays: number;
  minimumPrice: number;
};

const EstimatedValues = ({ initialInvestment, estimatedROI, estimatedProfits, totalSExod, breakEvenDays, minimumPrice, totalReturns }: EstimatedValuesProps) => {
  return (
    <EstimationContainer>
      <FieldValue fieldName="Initial investment" value={`$${initialInvestment.toFixed(2).toLocaleString()}x`} />
      <FieldValue fieldName="Estimated ROI" value={`${estimatedROI.toFixed(2)}x`} />
      <FieldValue fieldName="Total returns" value={`$${totalReturns.toFixed(2)}`} />
      <FieldValue fieldName="Estimated profits" value={`$${estimatedProfits.toFixed(2).toLocaleString()}`} />
      <FieldValue fieldName="Total sEXOD" value={`${totalSExod.toFixed(2)}`} />
      <FieldValue fieldName="Min days to break even" value={`${breakEvenDays}`} />
      <FieldValue fieldName="Min price" value={`$${minimumPrice.toFixed(2)}`} />
    </EstimationContainer>
  );
};

export default EstimatedValues;

const FieldValue = ({ fieldName, value }: { fieldName: string; value: string }) => {
  return (
    <EstimationColumn>
      <Typography variant="h6" color="textSecondary">
        <Trans>{fieldName}</Trans>
      </Typography>
      <Typography variant="h5" color="textPrimary">
        <Trans>{value}</Trans>
      </Typography>
    </EstimationColumn>
  );
};

const EstimationContainer = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  border-top: 1px solid #424242;
  width: 100%;
  padding: 24px 12px 0px 12px;
`;

const EstimationColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
