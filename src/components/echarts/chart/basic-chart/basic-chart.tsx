import { makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ReactEcharts, { EChartsOption } from "echarts-for-react";
import "../../../../assets/chart/china.js";
import _ from "lodash";
import React, { ReactNode, useEffect, useState } from "react";
import CommonChart from "../common-chart/common-chart";

const useStyles = makeStyles({
  root: {
    width: "100% !important",
    height: "100% !important",
    // tooltip
    "&>div:nth-child(2)": {
      verticalAlign: "middle",
      boxShadow:
        "0px 1px 18px 0px rgba(0, 0, 0, 0.12), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 3px 5px -1px rgba(0, 0, 0, 0.2)",
    },
    "&>div:nth-child(2) span": {
      width: "6px  !important",
      height: "6px !important",
      borderRadius: "0 !important",
      marginBottom: 2,
    },
  },
});

export type ChartType = "bar" | "map" | "pie" | "candlestick" | "chinaMap" | "radar";

export interface BasicChartProps {
  option: EChartsOption;
  download?: boolean;
  height?: string;
  getReactEcharts?: (chart: ReactEcharts) => void;
  placeholder?: string;
  showPlaceholder?: boolean;
  type?: ChartType;
  defaultXAxis?: string[];
  theme?: string;
  showSkeleton?: boolean;
}

/**
 * 在 CommonChart 的基础上，增加了无数据的展示
 * @param props
 */
const BasicChart: React.FunctionComponent<BasicChartProps> = (props) => {
  const classes = useStyles();
  const [reactEcharts, setReactEcharts] = useState<ReactEcharts>();

  const {
    defaultXAxis,
    download,
    placeholder,
    showPlaceholder = true,
    type = "bar",
    option,
    theme,
    showSkeleton = true,
  } = props;

  function chartResize(): void {
    if (reactEcharts) {
      const getEchartsInstance = _.get(reactEcharts, "getEchartsInstance");
      if (getEchartsInstance) {
        const chartInstance = getEchartsInstance.call(reactEcharts);
        const echartsResize = _.get(chartInstance, "resize");
        echartsResize.call?.(chartInstance);
      }
    }
  }

  useEffect(() => {
    if (reactEcharts) {
      window.addEventListener("resize", chartResize);
    }
    return (): void => {
      window.removeEventListener("resize", chartResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactEcharts]);

  function contentComponent(): ReactNode {
    if (option.series) {
      if (
        option &&
        (type === "radar" || (option.dataset && option.dataset.source && option.dataset.source.length !== 0))
      ) {
        if (download) {
          if (!option.toolbox) {
            option.toolbox = {
              show: true,
              right: "8%", //grid 的默认左边距
              feature: {
                saveAsImage: {
                  show: true,
                },
              },
            };
          }
        }
        option.graphic = [];

        return (
          <CommonChart
            options={option}
            height={props.height}
            getReactEcharts={(echarts: ReactEcharts): void => {
              setReactEcharts(echarts);
              props.getReactEcharts?.(echarts);
            }}
            theme={theme}
            className={classes.root}
          />
        );
      }
      if (showPlaceholder) {
        // 无数据显示，默认显示
        switch (type) {
          case "bar":
          case "candlestick":
            option.xAxis = {
              type: "category",
              data:
                defaultXAxis ??
                _.range(9)
                  .map((value) => {
                    const year: number = new Date().getFullYear();
                    return year - value;
                  })
                  .reverse(),
              axisLine: {
                show: true,
              },
            };
            option.yAxis = {
              type: "value",
              splitNumber: 5,
              min: 0,
              max: 500,
              axisLine: { show: false },
              axisTick: { show: false },
            };
            break;
          case "map":
            break;
          case "pie":
            break;
        }

        option.graphic = [
          {
            type: "group",
            bounding: "all",
            left: "center",
            top: "middle",
            z: 100,
            children: [
              type === "pie"
                ? {
                    type: "circle",
                    top: "center",
                    left: "center",
                    z: 99,
                    shape: {
                      r: 120,
                    },
                    style: {
                      fill: "#EEE",
                    },
                  }
                : undefined,
              {
                type: "text",
                left: "center",
                top: "center",
                z: 100,
                style: {
                  fill: "#999",
                  text: placeholder || "暂无数据",
                  fontSize: 18,
                },
              },
            ],
          },
        ];
      }

      return (
        <CommonChart
          options={option}
          height={props.height}
          getReactEcharts={(echarts: ReactEcharts): void => {
            if (echarts) {
              setReactEcharts(echarts);
              props.getReactEcharts?.(echarts);
            }
          }}
          theme={theme}
          className={classes.root}
        />
      );
    }
    return showSkeleton ? <Skeleton style={{ margin: 16 }} variant="rect" height={"100%"} /> : null;
  }

  return <>{contentComponent()}</>;
};

export default BasicChart;
