import React, { PureComponent } from "react";
import { init, dispose, Chart, KLineData } from "klinecharts";
import generatedKLineDataList from "../utils/generatedKLineDataList";
import Layout from "../Layout";
import { useState } from "react";
import { useEffect } from "react";
import Kline from "..";

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

interface TooltipKLineChartProps extends PureComponent {}

const TooltipKLineChart: React.FunctionComponent = (props) => {
  useEffect(() => {
    let kLineChart: Chart | null = init("tooltip-k-line");
    if (kLineChart) {
      kLineChart.createTechnicalIndicator("MA", false, { id: "candle_pane" });
      // kLineChart.createTechnicalIndicator("KDJ", false, { height: 80 });
      kLineChart.createTechnicalIndicator("VOL", false);
      kLineChart.setStyleOptions(getTooltipOptions());

      //设置单根蜡烛柱的宽度
      kLineChart.setDataSpace(12);
      kLineChart.setOffsetRightSpace(10);
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
        }, 100);
      });
    }
    return () => {
      dispose("tooltip-k-line");
    };
  }, []);

  return (
    <Layout title="分页加载数据">
      <div
        id="tooltip-k-line"
        className="k-line-chart"
        style={{ minHeight: 500 }}
      />
    </Layout>
  );
};

export default TooltipKLineChart;
