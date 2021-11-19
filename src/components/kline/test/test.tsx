import React from "react";
import { init, dispose, Chart, KLineData } from "klinecharts";
import { useEffect } from "react";
import { Box, createStyles, makeStyles } from "@material-ui/core";
import { useState } from "react";
import { useClient } from "urql";
import {
  ChartDocument,
  ChartQuery,
  ChartQueryVariables,
  EntityType,
} from "../../../generated/graphql";
import { KLineChartDataModel } from "./chartData";

function getTooltipOptions() {
  return {
    // 网格线
    grid: {
      show: true,
      // 网格水平线
      horizontal: {
        show: true,
        size: 1,
        color: "#393939",
        // 'solid'|'dash'
        style: "dash",
        dashValue: [2, 2],
      },
      // 网格垂直线
      vertical: {
        show: false,
      },
    },
    candle: {
      // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
      type: "candle_solid",
      // 蜡烛柱
      bar: {
        upColor: "#26A69A",
        downColor: "#EF5350",
        noChangeColor: "#888888",
      },

      tooltip: {
        showType: "rect",
        showRule: "follow_cross",
        labels: [
          "日K",
          "开盘价: ",
          "收盘价: ",
          "最低价: ",
          "最高价: ",
          "涨跌幅: ",
        ],
        values: (kLineData: KLineData) => {
          const change =
            ((kLineData.close - kLineData.open) / kLineData.open) * 100;
          return [
            { value: "  " },
            { value: kLineData.open.toFixed(2) },
            { value: kLineData.close.toFixed(2) },
            { value: kLineData.low.toFixed(2) },
            { value: kLineData.high.toFixed(2) },
            {
              value: `${change.toFixed(2)}%`,
              color: change < 0 ? "#EF5350" : "#26A69A",
            },
          ];
        },
        rect: {
          offsetLeft: 8,
          offsetTop: 8,
          offsetRight: 8,
          borderRadius: 4,
          borderSize: 1,
          borderColor: "#3f4254",
          backgroundColor: "white",
        },
        text: {
          size: 12,
          family: "Helvetica Neue",
          weight: "normal",
          color: "black",
          marginTop: 6,
          marginRight: 16,
          marginBottom: 6,
          marginLeft: 16,
        },
      },
    },
    technicalIndicator: {
      tooltip: {
        // 'always' | 'follow_cross' | 'none'
        showRule: "follow_cross",
        // 'standard' | 'rect'
        showType: "rect",
        showName: true,
        showParams: true,
        text: {
          size: 12,
          family: "Helvetica Neue",
          weight: "normal",
          color: "#D9D9D9",
          marginTop: 6,
          marginRight: 16,
          marginBottom: 6,
          marginLeft: 16,
        },
      },
    },
    // x轴
    xAxis: {
      show: true,
      height: null,
      // x轴线
      axisLine: {
        show: true,
        color: "#888888",
        size: 1,
      },
      // x轴分割文字
      tickText: {
        show: true,
        color: "#888888",
        family: "Helvetica Neue",
        weight: "normal",
        size: 12,
        paddingTop: 3,
        paddingBottom: 6,
      },
      // x轴分割线
      tickLine: {
        show: true,
        size: 1,
        length: 3,
        color: "#888888",
      },
    },
    // y轴
    yAxis: {
      show: true,
      width: null,
      // 'left' | 'right'
      position: "left",
      // 'normal' | 'percentage' | 'log'
      type: "normal",
      inside: false,
      // y轴线
      axisLine: {
        show: true,
        color: "#888888",
        size: 1,
      },
      // x轴分割文字
      tickText: {
        show: true,
        color: "black",
        family: "Helvetica Neue",
        weight: "normal",
        size: 12,
        paddingLeft: 3,
        paddingRight: 6,
      },
      // x轴分割线
      tickLine: {
        show: true,
        size: 1,
        length: 3,
        color: "#888888",
      },
    },
    shape: {
      point: {
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
        borderSize: 1,
        radius: 4,
        activeBackgroundColor: "#2196F3",
        activeBorderColor: "#2196F3",
        activeBorderSize: 1,
        activeRadius: 6,
      },
      line: {
        // 'solid'|'dash'
        style: "solid",
        color: "#2196F3",
        size: 1,
        dashValue: [2, 2],
      },
      polygon: {
        // 'stroke'|'fill'
        style: "stroke",
        stroke: {
          // 'solid'|'dash'
          style: "solid",
          size: 1,
          color: "#2196F3",
          dashValue: [2, 2],
        },
        fill: {
          color: "rgba(33, 150, 243, 0.1)",
        },
      },
    },
  };
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      borderRadius: 2,
      boxShadow: "0 2px 4px rgba(0, 0, 0, .3)",
      backgroundColor: "#1f2126",
      margin: "0 20px",
      padding: "16px 6px 16px 16px",
      border: "1px solid red",
    },
    title: {
      margin: 0,
      color: "#E6E8EA",
      paddingBottom: 10,
    },
    chart: {
      // width: "100%",
      // minHeight: 200,
    },
    app: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      padding: 15,
      border: "1px solid red",
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

interface TooltipKLineChartProps {
  title: string;
}

const TooltipKLineChart: React.FunctionComponent<TooltipKLineChartProps> = (
  props
) => {
  const classes = useStyles();
  const { title } = props;
  const [kLineChart, setKLineChart] = useState<Chart | null>();
  const client = useClient();

  function query(endTimestamp: number) {
    return client
      .query<ChartQuery, ChartQueryVariables>(ChartDocument, {
        chartID: "secondary_market.k_line_a_share",
        entityID: "1056422353",
        entityType: EntityType.Organization,
        filters: {
          dateRangeSelectorFilterInput: [
            {
              filterID:
                "secondary_market.filter_listing_info_k_line_time_range",
              startTimestamp: endTimestamp - 100 * 24 * 60 * 60,
              endTimestamp: endTimestamp,
            },
          ],
        },
      })
      .toPromise();
  }

  async function initKLine(chart: Chart) {
    chart.createTechnicalIndicator("MA", false, { id: "candle_pane" });
    // chart.createTechnicalIndicator("KDJ", false, { height: 80 });
    // chart.createTechnicalIndicator("VOL", false);
    chart.setStyleOptions(getTooltipOptions());

    //设置单根蜡烛柱的宽度
    chart.setDataSpace(12);
    chart.setOffsetRightSpace(10);
    const res = await query(Math.round(Date.now() / 1000));
    const data = KLineChartDataModel.fromJSON(
      JSON.parse(res.data?.chart?.data as string)
    ).dataList;

    chart.applyNewData(data, true);
    chart.loadMore((timestamp) => {
      setTimeout(async () => {
        const res = await query(Math.round(timestamp / 1000));
        const kLineData = KLineChartDataModel.fromJSON(
          JSON.parse(res.data?.chart?.data as string)
        ).dataList;
        chart!.applyMoreData(kLineData, true);
      }, 100);
    });
  }

  useEffect(() => {
    let kLineChart: Chart | null = init("tooltip-k-line");
    if (!kLineChart) return;
    initKLine(kLineChart);
    setKLineChart(kLineChart);
    return () => {
      dispose("tooltip-k-line");
    };
  }, []);

  useEffect(() => {
    if (!kLineChart) return;
    window.addEventListener("resize", () => kLineChart.resize());
    return (): void => {
      window.removeEventListener("resize", () => kLineChart.resize());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kLineChart]);

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>{title}</Box>
      <div
        id="tooltip-k-line"
        className={classes.chart}
        style={{ minHeight: 500 }}
      />
    </Box>
  );
};

export default TooltipKLineChart;
