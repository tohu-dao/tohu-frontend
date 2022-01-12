import CustomTooltip from "./CustomTooltip";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import ExpandedChart from "./ExpandedChart";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ReactComponent as Fullscreen } from "../../assets/icons/fullscreen.svg";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from "recharts";
import {
  Typography,
  Box,
  SvgIcon,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { trim } from "../../helpers";
import { format } from "date-fns";
import "./chart.scss";
import { tooltipItems } from "src/views/TreasuryDashboard/treasuryData";

const TICK_COUNT = 3;
const EXPANDED_TICK_COUNT = 5;

// All Charts are wrapped in this HOC. It provides a presentation layer for all charts.
const withChartCard = Component => {
  return ({
    headerText,
    infoTooltipMessage,
    headerSubText,
    todayMessage = "Current",
    SelectOptions,
    isDashboard,
    data,
    timeSelection = true,
    fullScreenDisabled = false,
    ...props
  }) => {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("all");
    const [filteredData, setFilteredData] = useState(data);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
      if (data) {
        setLoading(false);
      }
    }, [data]);

    useEffect(() => {
      if (time === "all") return setFilteredData(data);

      const [value, type] = time.includes(" ") ? time.split(" ") : [1, time];
      const cutOff = moment().subtract(value, type);
      const newData = data.filter(entry => moment(entry.timestamp * 1000).isAfter(cutOff));
      setFilteredData(newData);
    }, [time, data]);

    if (loading)
      return (
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );

    return (
      <Box style={{ width: "100%", height: "100%", paddingRight: "10px" }}>
        <div className="chart-card-header">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ width: "100%", overflow: "hidden" }}
          >
            {headerText && (
              <Box display="flex" width="90%" alignItems="center">
                <Typography
                  variant="h6"
                  color="textSecondary"
                  className="card-title-text"
                  style={{ fontWeight: 400, overflow: "hidden" }}
                >
                  {headerText}
                </Typography>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  className="card-title-text"
                  style={{ marginLeft: "6px" }}
                >
                  {!isDashboard && <InfoTooltip message={infoTooltipMessage} />}
                </Typography>
              </Box>
            )}
            {!fullScreenDisabled && (
              <SvgIcon
                component={Fullscreen}
                color="primary"
                onClick={handleOpen}
                style={{ fontSize: "1rem", cursor: "pointer" }}
              />
            )}
            <ExpandedChart
              open={open}
              handleClose={handleClose}
              renderChart={<Component {...props} data={filteredData} />}
              uid={props.dataKey}
              data={filteredData}
              infoTooltipMessage={infoTooltipMessage}
              headerText={headerText}
              headerSubText={headerSubText}
              todayMessage={todayMessage}
            />
          </Box>

          {loading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
                  {headerSubText}
                </Typography>
                <Typography variant="h6" color="textSecondary" style={{ fontWeight: 400, paddingLeft: "12px" }}>
                  {todayMessage}
                </Typography>
              </Box>
              <Box display="flex">
                {SelectOptions && <SelectOptions />}
                {timeSelection && (
                  <FormControl
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      margin: "0",
                      height: "33px",
                      minWidth: "unset",
                      paddingRight: "12px",
                    }}
                  >
                    <Select
                      id="time-select"
                      value={time}
                      label="Timeframe"
                      onChange={e => setTime(e.target.value)}
                      disableUnderline
                    >
                      <MenuItem value={"week"}>1 Week</MenuItem>
                      <MenuItem value={"2 week"}>2 Weeks</MenuItem>
                      <MenuItem value={"month"}>1 Month</MenuItem>
                      <MenuItem value={"3 month"}>3 Months</MenuItem>
                      <MenuItem value={"all"}>All</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          )}
        </div>
        <Box width="100%" minHeight={260} minWidth={220} className="ohm-chart">
          {loading || (data && data.length > 0) ? (
            <Component {...props} data={filteredData} />
          ) : (
            <Skeleton variant="rect" width="100%" height={260} />
          )}
        </Box>
      </Box>
    );
  };
};

export const ExodiaStackedLineChart = withChartCard(
  ({
    data,
    dataKey,
    colors,
    stroke,
    dataFormat,
    bulletpoints,
    itemNames,
    itemType,
    isExpanded = false,
    expandedGraphStrokeColor,
    strokeWidth = 1.6,
    showTotal,
  }) => {
    const theme = useTheme();
    // Remove 0's
    const formattedData = data.map(dataEntry => {
      dataKey.forEach(key => (dataEntry[key] = dataEntry[key] || null));
      return dataEntry;
    });
    return (
      <ResponsiveContainer minHeight={260} width="100%">
        <ComposedChart data={formattedData}>
          <defs>
            {dataKey.map((key, index) => (
              <UnderGlow color={colors[index]} />
            ))}
          </defs>
          <XAxis
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
            reversed={true}
            connectNulls={true}
            padding={{ right: 20 }}
          />
          <YAxis
            tickCount={isExpanded ? EXPANDED_TICK_COUNT : TICK_COUNT}
            axisLine={false}
            tickLine={false}
            width={33}
            tickFormatter={number => tickFormatter(number, dataFormat)}
            domain={[0, "auto"]}
            connectNulls={true}
            allowDataOverflow={false}
          />
          <Tooltip
            formatter={value => trim(parseFloat(value), 2)}
            content={
              <CustomTooltip
                bulletpoints={bulletpoints}
                itemNames={itemNames}
                itemType={itemType}
                colors={colors}
                dataKey={dataKey}
                showTotal={showTotal}
              />
            }
          />
          <CartesianGrid stroke={theme.palette.border.primary} strokeDasharray="4 4" />

          {dataKey.map((key, index) => (
            <Area {...areaProps(key, colors[index], strokeWidth)} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  },
);

export const ExodiaMultiLineChart = withChartCard(
  ({
    data,
    dataKey,
    colors,
    dataFormat,
    bulletpoints,
    itemNames,
    itemType,
    isExpanded = false,
    expandedGraphStrokeColor,
    scale,
    domain,
    withoutGlow,
    glowDeviation = "6",
    strokeWidth = 1.6,
    dataAxis = [],
    isDilution = false,
    showTotal,
  }) => {
    const theme = useTheme();
    // Remove 0's
    const formattedData = data.map(dataEntry => {
      dataKey.forEach(key => (dataEntry[key] = dataEntry[key] || null));
      return dataEntry;
    });
    return (
      <ResponsiveContainer minHeight={260} width="100%">
        <ComposedChart data={formattedData}>
          <defs>
            {!withoutGlow &&
              dataKey.map((key, index) => (
                <LineShadow id={`color-${key}`} color={colors[index]} deviation={glowDeviation} />
              ))}
          </defs>
          <XAxis
            dataKey="timestamp"
            // interval={xInterval}
            axisLine={false}
            tickCount={3}
            tickLine={false}
            reversed={true}
            connectNulls={true}
            tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
            padding={{ right: 20 }}
          />
          <YAxis
            yAxisId="left"
            tickCount={scale == "log" ? 1 : isExpanded ? EXPANDED_TICK_COUNT : TICK_COUNT}
            axisLine={false}
            tickLine={false}
            width={33}
            scale={scale}
            tickFormatter={number => tickFormatter(number, dataFormat[0])}
            domain={domain || [scale == "log" ? "dataMin" : 0, "auto"]}
            connectNulls={true}
            allowDataOverflow={false}
          />
          {dataAxis.some(key => key === "right") && (
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tickCount={3}
              width={33}
              domain={["dataMin", "dataMax"]}
              allowDataOverflow={false}
              tickFormatter={number => tickFormatter(number, dataFormat[1])}
            />
          )}
          <Tooltip
            formatter={value => trim(parseFloat(value), 2)}
            content={
              <CustomTooltip
                bulletpoints={bulletpoints}
                itemNames={itemNames}
                itemType={itemType}
                colors={colors}
                dataKey={dataKey}
                isDilution={isDilution}
                showTotal={showTotal}
              />
            }
          />
          <CartesianGrid stroke={theme.palette.border.primary} strokeDasharray="4 4" />

          {dataKey.map((key, index) => (
            <Line {...lineProps(key, colors[index], dataAxis[index], strokeWidth, withoutGlow)} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  },
);

export const ExodiaLineChart = withChartCard(
  ({
    data,
    dataKey,
    stroke,
    color,
    dataFormat,
    bulletpoints,
    itemNames,
    itemType,
    isExpanded,
    expandedGraphStrokeColor,
    scale,
    xInterval = 100,
    domain,
    underglow,
    withoutGlow,
    glowDeviation,
    isPOL,
    isStaked,
    strokeWidth = 1.6,
  }) => {
    const theme = useTheme();
    const renderGlow = () => {
      return underglow ? (
        <UnderGlow color={color} />
      ) : (
        <LineShadow id={`shadow-${color.replace("#", "")}`} color={color} deviation={glowDeviation} />
      );
    };

    return (
      <ResponsiveContainer minHeight={260} width="100%">
        <ComposedChart data={data}>
          <defs>{!withoutGlow && renderGlow()}</defs>
          <XAxis
            dataKey="timestamp"
            // interval={xInterval}
            axisLine={false}
            tickCount={3}
            tickLine={false}
            reversed={true}
            connectNulls={true}
            tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
            padding={{ right: 20 }}
          />
          <YAxis
            tickCount={scale == "log" ? 1 : isExpanded ? EXPANDED_TICK_COUNT : TICK_COUNT}
            axisLine={false}
            tickLine={false}
            width={33}
            scale={scale}
            tickFormatter={number => tickFormatter(number, dataFormat)}
            domain={domain || [scale == "log" ? "dataMin" : 0, "auto"]}
            connectNulls={true}
            allowDataOverflow={false}
          />
          <Tooltip
            content={
              <CustomTooltip
                bulletpoints={bulletpoints}
                itemNames={itemNames}
                itemType={itemType}
                colors={[color]}
                isPOL={isPOL}
                isStaked={isStaked}
                dataKey={dataKey}
              />
            }
          />
          <CartesianGrid stroke={theme.palette.border.primary} strokeDasharray="4 4" />
          <Line
            type="monotone"
            strokeLinecap="round"
            dataKey={dataKey[0]}
            stroke={stroke ? stroke : "none"}
            color={color}
            dot={false}
            strokeWidth={strokeWidth}
            filter={underglow || withoutGlow ? undefined : `url(#shadow-${color.replace("#", "")})`}
          />
          {underglow && (
            <Area
              type="monotone"
              dataKey={dataKey[0]}
              stroke={false}
              strokeWidth={strokeWidth}
              fillOpacity={1}
              fill={`url(#underglow-${color.replace("#", "")})`}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  },
);

export const ExodiaPieChart = withChartCard(
  ({
    data,
    dataKey,
    colors,
    dataFormat,
    bulletpoints,
    itemNames,
    itemType,
    isExpanded,
    expandedGraphStrokeColor,
    scale,
    xInterval = 100,
    domain,
    underglow,
    withoutGlow,
    glowDeviation,
    isPOL,
    isStaked,
    strokeWidth = 1.6,
  }) => {
    const isSmallScreen = useMediaQuery("(max-width: 550px)");
    const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

    return (
      <ResponsiveContainer minHeight={260} width="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={isVerySmallScreen ? "29%" : isSmallScreen ? "32%" : "42%"}
            cy="45%"
            innerRadius={isVerySmallScreen ? 35 : isSmallScreen ? 40 : 50}
            outerRadius={isVerySmallScreen ? 55 : isSmallScreen ? 65 : 80}
            fill="transparent"
            dataKey="value"
            stroke="#c1c1c1"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} filter={`drop-shadow(0px 0px 6px ${colors[index]})`} />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                bulletpoints={bulletpoints}
                itemNames={itemNames}
                itemType={itemType}
                isPie
                colors={colors}
                dataKey={dataKey}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
    );
  },
);

export const trimNumber = number => {
  if (Number(number) > 1000000) return `${parseFloat(number) / 100000}M`;
  else if (Number(number) > 1000) return `${parseFloat(number) / 1000}k`;
  return number;
};

const tickFormatter = (number, dataFormat) => {
  if (number !== 0) {
    if (dataFormat === "percent") {
      return `${trimNumber(number)}%`;
    }
    if (dataFormat === "$") {
      return `$${trimNumber(number)}`;
    }
    return trim(number, 2);
  }
  return "";
};

const LineShadow = ({ id, color, deviation = "12" }) => {
  return (
    <filter id={id} height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation={deviation} result="blur" />
      <feOffset in="blur" dx="0" dy={deviation} result="offsetBlur" />
      <feFlood floodColor={color} floodOpacity="1" result="offsetColor" />
      <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
};

const UnderGlow = ({ color }) => {
  const theme = useTheme();

  return (
    <linearGradient id={`underglow-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
      <stop offset="100%" stopColor={theme.palette.background.paper} stopOpacity={0.3} />
    </linearGradient>
  );
};

const areaProps = (dataKey, color, strokeWidth) => {
  return {
    type: "monotone",
    strokeLinecap: "round",
    dataKey: dataKey,
    stroke: color,
    dot: false,
    strokeWidth: strokeWidth,
    fill: `url(#underglow-${color.replace("#", "")})`,
    color: color,
    fillOpacity: 1,
    stackId: "1",
  };
};

const lineProps = (dataKey, color, yAxis, strokeWidth, withoutGlow = false) => {
  return {
    type: "monotone",
    strokeLinecap: "round",
    dataKey: dataKey,
    stroke: color ? color : "none",
    color: color,
    dot: false,
    strokeWidth: strokeWidth,
    filter: withoutGlow ? undefined : `url(#color-${dataKey})`,
    yAxisId: yAxis === "right" ? "right" : "left",
  };
};
