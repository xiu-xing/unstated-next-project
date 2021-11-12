import { EChartsOption } from "echarts-for-react";
import { xBarOption } from "../../../common/chart/basic-chart/options/barOptions";

export function getThreeBarOption(): EChartsOption {
  const option = xBarOption();

  option.title = {
    text: "创投市场回顾",
    left: 20,
    top: 20,
    textStyle: {
      fontSize: 16,
      color: "#333",
      fontWeight: 400,
    },
  };

  option.grid = {
    left: 65,
    right: 10,
    top: 70,
    bottom: 50,
  };

  option.legend = {
    right: 20,
    top: 20,
    itemWidth: 10,
    itemHeight: 10,
  };

  option.tooltip.formatter = (chartParam: EChartsOption): string => {
    try {
      if (Array.isArray(chartParam)) {
        const activeItem = chartParam[0];
        return `${activeItem.data[0]}<br/>投资事件：${activeItem.data[1] || 0}<br/>退出事件：${activeItem.data[2] ||
          0}<br/>IPO：${activeItem.data[3] || 0}`;
      }

      return `${chartParam.data[0]}<br/>投资事件：${chartParam.data[1] || 0}<br/>退出事件：${chartParam.data[2] ||
        0}<br/>IPO：${chartParam.data[3] || 0}`;
    } catch (e) {
      return "";
    }
  };

  option.series = [
    {
      type: "bar",
      barMaxWidth: 24,
      name: "投资事件数",
      color: "#51A9DC",
      stack: "Ad",
    },
    {
      type: "bar",
      barMaxWidth: 24,
      name: "退出事件数",
      color: "#7ADFEF",
      stack: "Ad",
    },
    {
      type: "bar",
      barMaxWidth: 24,
      name: "IPO",
      color: " #6EBFE0",
      stack: "Ad",
    },
  ];

  option.yAxis = {
    splitLine: {
      lineStyle: {
        color: "#eee",
      },
    },
  };

  return option;
}
