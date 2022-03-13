import { EChartsOption } from "echarts-for-react";
import { commonAxis, commonBarSeries, commonLegend, commonLineSeries, commonTooltip } from "./common";

/**
 * 多个坐标，图型通常是混合类型的
 * dataset 数据格式：[[xAxis, series1Data, series2Data, ..., seriesNData], ..., [xAxis, series1Data, series2Data, ..., seriesNData]]，
 * series 应与 dataset 的个数对应：[{ type: "bar", name: "bar1"}, ..., { type: "line", name: "line"}]
 */
export function mutiAxisOption(): EChartsOption {
  return {
    grid: {
      top: 30,
      bottom: 60,
      left: 66,
      right: 66,
    },
    legend: {
      show: true,
      ...commonLegend,
    },
    tooltip: {
      trigger: "axis",
      ...commonTooltip,
    },
    xAxis: {
      type: "category",
      ...commonAxis,
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: { color: "rgba(65, 97, 128, 0.15)" },
      },
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        // 如果需要设定固定的 n 条数据分割线，则需要根据最大最小值手动设置 interval 的值
        // min: 0,
        // max: 5000,
        // interval: 5,
        splitNumber: 5,
        nameLocation: "end",
        nameTextStyle: {
          align: "center",
          fontWeight: 500,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#666",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          inside: false,
        },
        splitLine: {
          show: true,
        },
      },
      {
        type: "value",
        position: "right",
        // 如果需要设定固定的 n 条数据分割线，则需要根据最大最小值手动设置 interval 的值
        // min: 0,
        // max: 5000,
        // interval: 5,
        splitNumber: 5,
        nameLocation: "end",
        nameTextStyle: {
          align: "center",
          fontWeight: 500,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#666",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          inside: false,
        },
        splitLine: {
          show: true,
        },
      },
    ],
    series: [
      {
        ...commonBarSeries,
        yAxisIndex: 0,
      },
      {
        ...commonLineSeries,
      },
    ],
  };
}
