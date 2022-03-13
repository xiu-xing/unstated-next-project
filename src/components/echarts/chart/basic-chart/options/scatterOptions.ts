import { EChartsOption } from "echarts-for-react";
import { commonAxis, commonTooltip } from "./common";

/**
 * 散点图，坐标值一般为数值
 * dataset 数据格式：[[xAxis, yAxis], ..., [xAxis, yAxis]]，如果有额外的信息，可以放在数组后面，tooltip 展示的时候可以获取到
 */
export function scatterOption(): EChartsOption {
  return {
    grid: {
      left: 70,
      right: 10,
      top: 30,
      bottom: 30,
    },
    tooltip: { ...commonTooltip },
    xAxis: {
      ...commonAxis,
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      ...commonAxis,
      splitLine: {
        show: true,
      },
    },
    series: [
      {
        symbolSize: 8,
        type: "scatter",
        selectedMode: "single",
        color: "#738daf66",
        select: {
          itemStyle: {
            color: "#4f709b",
          },
        },
        emphasis: {
          scale: false,
          itemStyle: {
            color: "#4f709b",
          },
        },
      },
    ],
  };
}
