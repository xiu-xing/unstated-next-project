import { EChartsOption } from "echarts-for-react";
import { commonTooltip } from "./common";

/**
 * 雷达图
 * 需要给定 indicator
 * 不支持 dataset 格式，所以数据只能定义在 series 里边
 */
export function radarOption(): EChartsOption {
  return {
    grid: {
      bottom: 0,
    },
    tooltip: { ...commonTooltip },
    legend: {
      show: false,
    },
    radar: {
      splitNumber: 3,
      name: {
        textStyle: {
          color: "#666",
          // backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5],
        },
      },
      // indicator: [
      //   { name: "a", max: 100 },
      //   { name: "b", max: 100 },
      //   { name: "c", max: 100 },
      //   { name: "d", max: 100 },
      //   { name: "e", max: 100 },
      // ],
      splitLine: {
        lineStyle: {
          color: ["#E7E9F5"],
        },
      },
      splitArea: {
        areaStyle: {
          color: ["#fff"],
        },
      },
    },
    series: [
      {
        type: "radar",
        symbol: "none",
        // data: [
        //   {
        //     value: [0, 0, 0, 0, 0],
        //   },
        // ],
        // dimension: ["a", "b", "c", "d", "e"],
        lineStyle: {
          width: 2,
        },
        // areaStyle: {
        //   color: "rgba(129, 164, 161, 0.8)",
        // },
      },
    ],
  };
}
