import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  Zoom,
  Slider,
} from "@material-ui/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { Trans } from "@lingui/macro";
import { useAppSelector } from "src/hooks";
import styled from "styled-components";
import CalcHeader from "./CalcHeader";
import ImportantValues from "./ImportantValues";
import EstimatedValues from "./EstimatedValues";
import PriceMultiplier from "./PriceMultiplier";
import { useTreasuryMetrics } from "../TreasuryDashboard/hooks/useTreasuryMetrics";

function Calc() {
  const [exodAmountInput, setExodAmountInput] = useState(0);
  const [rebaseRateInput, setRebaseRateInput] = useState(0);
  const [exodPriceInput, setExodPriceInput] = useState(0);
  const [finalExodPriceInput, setFinalExodPriceInput] = useState(0);
  const [calcDays, setCalcDays] = useState(90);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const marketPrice = useAppSelector(state => state.app.marketPrice || 0);
  const stakingRebase = useAppSelector(state => state.app.stakingRebase || 0);
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohmAsSohm;
  });
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const runway = data && data.filter((metric: any) => metric.runway10k > 5);
  const currentRunway = runway && runway[0].runwayCurrent;

  const trimmedBalance = Number(
    [sohmBalance, wsohmAsSohm]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  useEffect(() => {
    setExodAmountInput(trimmedBalance);
  }, [trimmedBalance]);

  useEffect(() => {
    setRebaseRateInput(stakingRebase * 100);
  }, [stakingRebase]);

  useEffect(() => {
    if (marketPrice) {
      setFinalExodPriceInput(marketPrice);
      setExodPriceInput(marketPrice);
    }
  }, [marketPrice]);

  return (
    <CalcContainer id="stake-view">
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Grid container direction="column" spacing={2}>
            <CalcHeader />
            <ImportantValues {...{ marketPrice, stakingRebase, isAppLoading, trimmedBalance }} />
            <CalcArea>
              <FieldInput
                fieldName="sEXOD amount"
                value={exodAmountInput}
                maxName="Max"
                onChange={setExodAmountInput}
                onMax={() => setExodAmountInput(trimmedBalance)}
              />
              <FieldInput
                fieldName="Rebase rate"
                value={Number(rebaseRateInput.toFixed(4))}
                maxName="Current"
                onChange={setRebaseRateInput}
                onMax={() => setRebaseRateInput(stakingRebase)}
              />
              <FieldInput
                fieldName="Price of EXOD at purchase ($)"
                value={Number(exodPriceInput.toFixed(2))}
                maxName="Current"
                onChange={setExodPriceInput}
                onMax={() => setExodPriceInput(marketPrice)}
              />
              <CalcRow>
                <PriceMultiplier currentPrice={marketPrice} setFinalExodPriceInput={setFinalExodPriceInput} />
              </CalcRow>
              <FieldInput
                fieldName="Final market price of EXOD ($)"
                value={Number(finalExodPriceInput.toFixed(2))}
                maxName="Current"
                onChange={setFinalExodPriceInput}
                onMax={() => setFinalExodPriceInput(marketPrice)}
              />
              <SliderContainer>
                <SliderHeader
                  currentRunway={currentRunway}
                  calcDays={calcDays}
                  onClick={() => setCalcDays(Math.floor(Number(currentRunway)))}
                />
                <Slider
                  aria-label="Days"
                  max={365}
                  value={calcDays}
                  color="primary"
                  onChange={(_e, newValue) => setCalcDays(Number(newValue))}
                />
              </SliderContainer>
            </CalcArea>
            {/* 
              TODO: 
              Replace these hard coded values with calls to functions aka: 
              estimatedROI={estimatedROI(input1, input2, ..etc)}
            */}
            <EstimatedValues estimatedROI={3.65} estimatedProfits={-267.65} breakEvenDays={36} minimumPrice={29.28} />
          </Grid>
        </Paper>
      </Zoom>
    </CalcContainer>
  );
}

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <Calc />
  </QueryClientProvider>
);

type FieldInputProps = {
  fieldName: string;
  value: number;
  onChange: (value: number) => void;
  maxName: string;
  onMax: (value: any) => void;
};

const FieldInput = ({ fieldName, value, onChange, maxName, onMax }: FieldInputProps) => {
  return (
    <CalcRow>
      <Typography variant="h6" color="textSecondary">
        <Trans>{fieldName}</Trans>
      </Typography>
      <FormControl variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          type="number"
          placeholder={`Enter ${fieldName}`}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          labelWidth={0}
          endAdornment={
            <InputAdornment position="end">
              <Button variant="text" onClick={onMax} color="inherit">
                {maxName}
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>
    </CalcRow>
  );
};

const SliderHeader = ({
  currentRunway,
  calcDays,
  onClick,
}: {
  currentRunway: number;
  calcDays: number;
  onClick: () => void;
}) => {
  return (
    <SliderHeaderContainer onClick={!!currentRunway ? onClick : undefined} runwayLoaded={!!currentRunway}>
      <Typography variant="h6" color="textSecondary">
        <Trans>{calcDays} Days</Trans>
      </Typography>
      <Typography variant="h6" color="textSecondary">
        <Trans>Current runway: {currentRunway ? `${currentRunway?.toFixed(2)} Days` : "Loading..."} </Trans>
      </Typography>
    </SliderHeaderContainer>
  );
};

const CalcContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CalcArea = styled.div`
  display: flex;
  flex-direction: column;
  .calc-input {
    width: 100%;
    max-width: revert;
  }
`;

const CalcRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  margin: 12px 0;
  input[type] {
    font-size: 1rem;
  }
`;

const SliderContainer = styled.div`
  margin: 24px 0;
`;

const SliderHeaderContainer = styled.div<{ runwayLoaded: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  ${({ runwayLoaded }) => runwayLoaded && "cursor: pointer;"}
`;
