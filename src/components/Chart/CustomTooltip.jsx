import { Paper, Box, Typography, useTheme } from "@material-ui/core";
import { bulletpoints } from "src/views/TreasuryDashboard/treasuryData";
import _ from "lodash";
import { trim } from "../../helpers";
import "./customtooltip.scss";

const renderDate = (index, payload, item) => {
  const filteredPayloads = _.uniqBy(payload, "name");

  return index === filteredPayloads.length - 1 && item.payload.timestamp ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()}, {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ""
  );
};

const renderItem = (type, item) => {
  return type === "$" ? (
    <Typography variant="body2">{`${type}${Math.round(item).toLocaleString("en-US")}`}</Typography>
  ) : type === "%" ? (
    <Typography variant="body2">{`${item.toLocaleString("en-us")}${type}`}</Typography>
  ) : (
    <Typography variant="body2">{`${item.toFixed(2)} ${type}`}</Typography>
  );
};

const renderTooltipItems = (
  payload,
  bulletpoints,
  itemNames,
  itemType,
  isStaked = false,
  isPOL = false,
  isDilution = false,
  isGrowthOfSupply = false,
  isPie = false,
  colors,
  dataKey,
  showTotal,
) => {
  const theme = useTheme();

  return isStaked ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={{ backgroundColor: colors[0], ...bulletpoints[0] }}></span>
          Staked
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={{ backgroundColor: colors[1], ...bulletpoints[1] }}></span>
          Not staked
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : isPOL ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={{ backgroundColor: colors[0], ...bulletpoints[0] }}></span>
          {itemNames[0]}
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={{ backgroundColor: colors[1], ...bulletpoints[1] }}></span>
          {itemNames[1]}
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : isPie ? (
    <Box>
      <Box className="item" display="flex">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" className="field-name">
            <span
              className="tooltip-bulletpoint"
              style={{
                ...bulletpoints[itemNames.findIndex(item => item === payload[0].name)],
                backgroundColor: colors[itemNames.findIndex(item => item === payload[0].name)],
              }}
            ></span>
            {payload[0].name}
          </Typography>
        </Box>
        {renderItem(itemType, payload[0].value)}
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : (
    <>
      {payload.map((item, index) => {
        const itemIndex = dataKey.findIndex(name => name === item.dataKey);
        return (
          <Box key={index}>
            <Box className="item" display="flex">
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" className="field-name">
                  <span
                    className="tooltip-bulletpoint"
                    style={{ backgroundColor: colors[itemIndex], ...bulletpoints[itemIndex] }}
                  ></span>
                  {`${itemNames[itemIndex]}`}
                </Typography>
              </Box>
              {renderItem(isDilution ? itemType[itemIndex] : itemType, item.value)}
            </Box>
            <Box>{!showTotal && !isGrowthOfSupply && renderDate(itemIndex, payload, item)}</Box>
          </Box>
        );
      })}
      {showTotal && <br />}
      {showTotal && (
        <Box key={payload.length}>
          <Box className="item" display="flex">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" className="field-name">
                <span className="tooltip-bulletpoint" style={{ backgroundColor: theme.palette.text.secondary }}></span>
                Total
              </Typography>
            </Box>
            {renderItem(
              itemType,
              payload.reduce((total, item) => total + item.value, 0),
            )}
          </Box>
          <Box>{renderDate(payload.length - 1, payload, payload[0])}</Box>
        </Box>
      )}
      {isGrowthOfSupply && <br />}
      {isGrowthOfSupply && (
        <Box key={payload.length}>
          <Box className="item" display="flex">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" className="field-name">
                <span className="tooltip-bulletpoint" style={{ backgroundColor: theme.palette.text.secondary }}></span>
                Growth vs Index
              </Typography>
            </Box>
            {renderItem("%", trim(Math.abs(1 - payload[0].value / payload[1].value) * 100, 2))}
          </Box>
          <Box>{renderDate(payload.length - 1, payload, payload[0])}</Box>
        </Box>
      )}
    </>
  );
};

function CustomTooltip({
  active,
  dataKey,
  payload,
  bulletpoints,
  itemNames,
  itemType,
  isStaked,
  isPOL,
  isDilution,
  isGrowthOfSupply,
  isPie,
  colors,
  showTotal = false,
}) {
  if (active && payload && payload.length) {
    return (
      <Paper className={`ohm-card tooltip-container`}>
        {renderTooltipItems(
          payload,
          bulletpoints,
          itemNames,
          itemType,
          isStaked,
          isPOL,
          isDilution,
          isGrowthOfSupply,
          isPie,
          colors,
          dataKey,
          showTotal,
        )}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
