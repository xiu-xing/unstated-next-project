import { EChartsOption } from "echarts-for-react";
import { commonAxis, commonLegend, commonLineSeries, commonTooltip } from "./common";

/**
 * 折线图，如果需要配置其余的选项，在处理函数的地方进行处理，如 tooltip 的 formatter
 * dataset 数据格式：[[xAixs, lineData1, lineData2, ..., lineDataN], ..., [xAixs, lineData1, lineData2, ..., lineDataN]]，
 * series 应与 line 的个数对应：[{ type: "line", name: "line1"}, ..., { type: "line", name: "lineN"}]
 */
export function lineOption(): EChartsOption {
  return {
    grid: {
      left: 30,
      right: 10,
      top: 30,
      bottom: 60,
    },
    legend: {
      show: false,
      ...commonLegend,
    },
    tooltip: { ...commonTooltip },
    xAxis: {
      type: "category",
      ...commonAxis,
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
      },
      ...commonAxis,
    },
    series: [
      {
        ...commonLineSeries,
      },
    ],
  };
}
