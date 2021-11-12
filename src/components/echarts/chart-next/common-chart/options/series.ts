import { darken } from "@material-ui/core";
import { BarSeriesOption, MarkLineComponentOption as MarkLineOption, SeriesOption } from "echarts";
import "../../../../../assets/chart/china.js";
import { SeriesModel } from "../../../../../models/chart/chart";
import { getOptionType, OptionType } from "./optionType";

export const provinceMapping = {
  "山东": "山东省",
  "江苏": "江苏省",
  "安徽": "安徽省",
  "浙江": "浙江省",
  "江西": "江西省",
  "福建": "福建省",
  "四川": "四川省",
  "贵州": "贵州省",
  "云南": "云南省",
  "西藏": "西藏自治区",
  "内蒙古": "内蒙古自治区",
  "河北": "河北省",
  "山西": "山西省",
  "河南": "河南省",
  "湖北": "湖北省",
  "湖南": "湖南省",
  "广西": "广西壮族自治区",
  "广东": "广东省",
  "海南": "海南省",
  "台湾": "台湾地区",
  "香港": "香港特别行政区",
  "澳门": "澳门特别行政区",
  "陕西": "陕西省",
  "甘肃": "甘肃省",
  "宁夏": "宁夏回族自治区",
  "青海": "青海省",
  "新疆": "新疆维吾尔自治区",
  "黑龙江": "黑龙江省",
  "辽宁": "辽宁省",
  "吉林": "吉林省",
};

function getSeriesByOptionType(
  seriesModel: SeriesModel,
  withoutData: boolean,
  markLine?: MarkLineOption,
): SeriesOption {
  const type = getOptionType(seriesModel);
  switch (type) {
    case OptionType.bar:
      return {
        type: "bar",
        barMaxWidth: 41,
        stack: seriesModel.stack ? "stack" : undefined,
        xAxisIndex: seriesModel.xAxisIndex,
        yAxisIndex: seriesModel.yAxisIndex,
      } as BarSeriesOption;
    case OptionType.parallelBar:
      if (withoutData) {
        return {
          type: "bar",
          barMaxWidth: 41,
        };
      }
      return {
        type: "bar",
        barMaxWidth: 41,
        label: {
          show: true,
          color: "#666666",
          fontSize: 12,
          position: "right",
        },
      };
    case OptionType.line:
      if (seriesModel.encode && seriesModel.name) {
        return {
          type: "line",
          // 平滑
          smooth: true,
          // 是否连接空数据。
          connectNulls: true,
          //
          showSymbol: false,
          stack: seriesModel.stack ? "stack" : undefined,
          xAxisIndex: seriesModel.xAxisIndex,
          yAxisIndex: seriesModel.yAxisIndex,
          markLine: withoutData ? undefined : markLine,
          encode: { ...seriesModel.encode, tooltip: seriesModel.encode.y },
          name: seriesModel.name,
          lineStyle: {
            width: 1,
          },
        };
      }
      return {
        type: "line",
        // 平滑
        smooth: true,
        // 是否连接空数据。
        connectNulls: true,
        //
        showSymbol: false,
        stack: seriesModel.stack ? "stack" : undefined,
        xAxisIndex: seriesModel.xAxisIndex,
        yAxisIndex: seriesModel.yAxisIndex,
        markLine: withoutData ? undefined : markLine,
      };
    case OptionType.map:
      return {
        type: "map",
        map: "china",
        // 取消选择事件
        selectedMode: false,
        nameMap: provinceMapping,
        dimensions: ["地区分布", "数量"],
        emphasis: {
          label: {
            color: "#000",
            position: "top",
          },
          itemStyle: {
            areaColor: darken("#4F709B", 0.2),
          },
        },
        label: {
          // 地图文字
          show: false,
          color: "#000",
        },
      };
    case OptionType.pie:
      if (withoutData) {
        return {
          radius: "55%",
          type: "pie",
          label: {
            show: false,
          },
        };
      }
      return {
        radius: "55%",
        left: 80,
        // top: -20,
        type: "pie",
        label: {
          color: "#666666",
          formatter: "{d}%",
        },
        center: ["50%", "40%"],
      };
    case OptionType.radar:
      return {
        type: "radar",
        symbol: "none",
        lineStyle: {
          width: 2,
        },
        areaStyle: {
          opacity: 0.2,
        },
      };
    // TODO:
    case OptionType.scatter:
      return {
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
      };

    case OptionType.candlestick:
      return {
        type: "candlestick",
        name: seriesModel.name,
        barMinWidth: 2,
        large: true,
        itemStyle: {
          color: "#FD1050",
          color0: "#00CC00",
          borderColor: "#FD1050",
          borderColor0: "#00CC00",
        },
        encode: { ...seriesModel.encode, tooltip: seriesModel.encode.y },
      };
  }
  return {};
}

export { getSeriesByOptionType };
