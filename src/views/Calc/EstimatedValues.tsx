import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import styled from "styled-components";

type EstimatedValuesProps = {
  initialInvestment: number;
  estimatedROI: number;
  estimatedProfits: number;
  totalSExod: number;
  totalReturns: number;
  breakEvenDays: number;
  minimumPrice: number;
};

const EstimatedValues = ({
  initialInvestment,
  estimatedROI,
  estimatedProfits,
  totalSExod,
  breakEvenDays,
  minimumPrice,
  totalReturns,
}: EstimatedValuesProps) => {
  return (
    <>
      <EstimationColumn>
        <FieldValue
          fieldName="Initial investment"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(initialInvestment)}
        />
        <div />
        <FieldValue fieldName="Estimated ROI" value={`${estimatedROI ? estimatedROI.toFixed(2) : 0}x`} />
        <FieldValue fieldName="Total sEXOD" value={`${totalSExod.toFixed(2)}`} />
        <FieldValue
          fieldName="Estimated profits"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(estimatedProfits)}
        />
        <FieldValue
          fieldName="Total returns"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(totalReturns)}
        />
      </EstimationColumn>
      <EstimationColumn>
        <FieldValue
          fieldName="Break even price"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(minimumPrice || 0)}
        />
        <FieldValue fieldName="Days to break even" value={`${breakEvenDays}`} />
      </EstimationColumn>
    </>
  );
};

export default EstimatedValues;

const FieldValue = ({ fieldName, value }: { fieldName: string; value: string }) => {
  return (
    <EstimationRow>
      <Typography variant="h6" color="textSecondary">
        <Trans>{fieldName}</Trans>
      </Typography>
      <Typography variant="h6" color="textPrimary">
        <Trans>{value}</Trans>
      </Typography>
    </EstimationRow>
  );
};

const EstimationColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-column-gap: 24px;
  border-top: 1px solid #424242;
  width: 100%;
  padding: 12px;
`;

const EstimationRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0px;
`;
