import { EChartsOption } from "echarts-for-react";
import { provinceMapping } from "../../provinceMap";
import { commonTooltip } from "./common";

/**
 * 仅中国省份
 * dataset 数据格式：[[省份, lineData1, lineData2, ..., lineDataN], ..., [省份, lineData1, lineData2, ..., lineDataN]]，
 */
export function chinaMapOption(): EChartsOption {
  return {
    grid: {
      left: 0,
      right: 0,
      bottom: 50,
    },
    tooltip: { ...commonTooltip },
    series: [
      {
        type: "map",
        map: "china",
        nameMap: provinceMapping,
        dimensions: ["地区分布", "数量"],
        layoutSize: 528,
        layoutCenter: ["50%", "50%"],
        emphasis: {
          label: {
            color: "white",
          },
          itemStyle: {
            areaColor: "#667889",
          },
        },
        label: {
          show: true,
          color: "#333",
        },
      },
    ],
    visualMap: {
      type: "continuous",
      left: 40,
      bottom: 10,
      itemWidth: 0,
      itemHeight: 0,
      splitNumber: 4,
      min: 0,
      max: 500,
      color: ["#4f709b", "#7192ba", "#86a2bf", "#9fbbd2", "#bad4e4", "#d6e9f5"],
      showLabel: true,
    },
  };
}
