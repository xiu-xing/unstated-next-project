import React, { PureComponent } from "react";
import { init, dispose, Chart, KLineData } from "klinecharts";
import generatedKLineDataList from "../utils/generatedKLineDataList";
import Layout from "../Layout";
import { useState } from "react";
import { useEffect } from "react";

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
        size: 1,
        color: "#393939",
        // 'solid'|'dash'
        style: "dash",
        dashValue: [2, 2],
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
        color: "#D9D9D9",
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
        color: "#D9D9D9",
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
  };
}

const rules = [
  { key: "always", text: "总是显示" },
  { key: "follow_cross", text: "跟随十字光标" },
  { key: "none", text: "不显示" },
];
interface TooltipKLineChartProps extends PureComponent {}

const TooltipKLineChart: React.FunctionComponent = (props) => {
  const [candleShowType, setCandleShowType] = useState("standard");
  const [candleShowRule, setCandleShowRule] = useState("always");
  const [technicalIndicatorShowRule, setTechnicalIndicatorShowRule] =
    useState("always");
  const [kLineChart, setKlineChart] = useState<Chart | null>();

  useEffect(() => {
    let kLineChart: Chart | null = init("tooltip-k-line");
    setKlineChart(kLineChart);
    if (kLineChart) {
      kLineChart.createTechnicalIndicator("MA", false, { id: "candle_pane" });
      // kLineChart.createTechnicalIndicator("KDJ", false, { height: 80 });
      // kLineChart.createTechnicalIndicator("VOL", false);
      kLineChart.setStyleOptions(getTooltipOptions());
      kLineChart.applyNewData(
        generatedKLineDataList(Date.now(), 300, 100),
        true
      );
      kLineChart.loadMore((timestamp) => {
        setTimeout(() => {
          const firstData = kLineChart!.getDataList()[0];
          kLineChart!.applyMoreData(
            generatedKLineDataList(timestamp, firstData.close, 100),
            true
          );
        }, 2000);
      });
    }
    return () => {
      dispose("tooltip-k-line");
    };
  }, []);

  return (
    <Layout title="十字光标文字提示">
      <div
        id="tooltip-k-line"
        className="k-line-chart"
        style={{ minHeight: 500 }}
      />
    </Layout>
  );
};

export default TooltipKLineChart;
