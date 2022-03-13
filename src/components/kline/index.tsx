import {
  Box,
  createStyles,
  makeStyles,
  NoSsr,
  Typography,
} from "@material-ui/core";
import React from "react";
import BasicKLineChart from "./chart/BasicKLineChart";
import ChartTypeKLineChart from "./chart/ChartTypeKLineChart";
import CustomCandleMarkKLineChart from "./chart/CustomCandleMarkKLineChart";
import DrawShapeKLineChart from "./chart/DrawShapeKLineChart";
import DynamicTooltipKLineChart from "./chart/DynamicTooltipKLineChart";
import LoadMoreKLineChart from "./chart/LoadMoreKLineChart";
import TooltipKLineChart from "./chart/TooltipKLineChart";

const useStyle = makeStyles(() =>
  createStyles({
    app: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      padding: 15,

      "& .k-line-chart-container": {
        display: "flex",
        flexDirection: "column",
        margin: 15,
        borderRadius: 2,
        boxShadow: "0 2px 4px rgba(0, 0, 0, .3)",
        backgroundColor: "#1f2126",
        width: "100%",
        padding: "16px 6px 16px 16px",
        "& .k-line-chart-title": {
          margin: 0,
          color: "#E6E8EA",
          paddingBottom: 10,
        },
        "& .k-line-chart": {
          display: "flex",
          flex: 1,
          minHeight: 200,
        },
        "& .k-line-chart-menu-container": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          fontSize: 12,
          color: "#929AA5",
          "& button": {
            cursor: "pointer",
            backgroundColor: "#2196F3",
            borderRadius: 2,
            marginRight: 8,
            height: 24,
            lineHeight: " 26px",
            padding: "0 6px",
            fontSize: 12,
            color: "#fff",
            border: "none",
            outline: "none",
          },
        },
      },
    },
  })
);

const Kline: React.FunctionComponent = () => {
  const classes = useStyle();
  return (
    <Box className={classes.app}>
      {/* <Typography>Kline</Typography> */}
      {/* <ChartTypeKLineChart />
      <CustomCandleMarkKLineChart />
      <DrawShapeKLineChart />
      <BasicKLineChart /> */}
      <DynamicTooltipKLineChart />
      {/* <LoadMoreKLineChart /> */}
    </Box>
  );
};

export default Kline;
