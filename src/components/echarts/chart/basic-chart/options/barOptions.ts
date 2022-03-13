import { EChartsOption } from "echarts-for-react";
import { commonAxis, commonBarSeries, commonLegend, commonTooltip } from "./common";

/**
 * x 轴柱状图，如果需要配置其余的选项，在处理函数的地方进行处理
 * dataset 数据格式：[[xAixs, barData1, barData2, ..., barDataN], ..., [xAixs, barData1, barData2, ..., barDataN]]，
 * series 应与 bar 的个数对应：[{ type: "bar", name: "bar1"}, ..., { type: "bar", name: "barN"}]
 */
export function xBarOption(): EChartsOption {
  return {
    grid: {
      left: 50,
      right: 50,
      top: 20,
      bottom: 60,
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
      ...commonAxis,
      type: "category",
      show: true,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      ...commonAxis,
    },
    series: [
      {
        ...commonBarSeries,
      },
    ],
  };
}

/**
 * Y 轴柱状图
 * dataset 数据格式：[[yAixs, barData1, barData2, ..., barDataN], ..., [yAixs, barData1, barData2, ..., barDataN]]，
 * series 应与 bar 的个数对应：[{ type: "bar", name: "bar1"}, ..., { type: "bar", name: "barN"}]
 */
export function yBarOption(): EChartsOption {
  return {
    grid: {
      left: 50,
      right: 50,
      top: 0,
      bottom: 0,
    },
    legend: {
      show: false,
      ...commonLegend,
    },
    tooltip: { ...commonTooltip },
    yAxis: {
      type: "category",
      ...commonAxis,
    },
    xAxis: {
      type: "value",
      ...commonAxis,
    },
    series: [
      {
        ...commonBarSeries,
        label: {
          show: true,
          position: "right",
        },
      },
    ],
  };
}

/**
 * 叠加的柱状图
 * 可以使用 dataset 的模式
 * dataset 数据格式：[[xAixs, barData1, barData2, ..., barDataN], ..., [xAixs, barData1, barData2, ..., barDataN]]，
 * series 应与 bar 的个数对应：[{ type: "bar", stack: "total", name: "bar1"}, ..., { type: "bar", stack: "total", name: "barN"}]
 */
export function xStackBarOption(): EChartsOption {
  return {
    grid: {
      left: 50,
      right: 50,
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
      show: true,
      ...commonLegend,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      ...commonLegend,
    },
    series: [
      {
        ...commonBarSeries,
        stack: "total",
      },
      {
        ...commonBarSeries,
        stack: "total",
      },
    ],
  };
}
