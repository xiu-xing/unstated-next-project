import { Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  DatasetComponentOption as DatasetOption,
  DataZoomComponentOption as DataZoomOption,
  EChartsOption,
  EChartsType,
  GridComponentOption as GridOption,
  LegendComponentOption as LegendOption,
  MarkLineComponentOption as MarkLineOption,
  RadarComponentOption as RadarOption,
  SeriesOption,
  ToolboxComponentOption as ToolboxOption,
  TooltipComponentOption as TooltipOption,
  VisualMapComponentOption as VisualMapOption,
  XAXisComponentOption as XAXisOption,
  YAXisComponentOption as YAXisOption,
} from "echarts";
import _, { isEqual } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { AxisesModel, ChartModel } from "../../../../models/chart/chart";
import { ChartDataModel } from "../../chart/common-chart/models/chartData";
import Chart, { ChartProps } from "../chart";
import { handleBottomLayout } from "./bottomLayout";
import { getXAxis, getYAxis } from "./options/axes";
import {
  commonDataZoom,
  commonGrid,
  commonLegend,
  commonPieLegend,
  commonRadar,
  commonToolbox,
  commonTooltip,
  commonVisualMap,
  commonWithoutDataGraphic,
  commonWithoutDataRadar,
  markLineGrid,
  wave,
} from "./options/common";
import { getDataSetSource } from "./options/dataset";
import { radarTooltipFormatter, tooltipFormatter } from "./options/formatter";
import { getOptionType, OptionType } from "./options/optionType";
import { getSeriesByOptionType } from "./options/series";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100% !important",
      height: "100% !important",
    },
    leftChartTitle: {
      position: "absolute",
      top: "40%",
      left: "0%",
      transform: "translate(0, -50%)",
      writingMode: "vertical-lr",
      color: "#666",
      fontSize: 12,
      letterSpacing: "4px",
    },
    rightChartTitle: {
      position: "absolute",
      right: "0%",
      top: "40%",
      transform: "translate(0, -50%)",
      writingMode: "vertical-lr",
      color: "#666",
      fontSize: 12,
      letterSpacing: "4px",
    },
    noData: {
      fontSize: 14,
      color: "#666",
      display: "grid",
      placeItems: "center",
      width: "100%",
      height: "100%",
    },
  })
);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CandlesTickProps {
  id: string;
  min?: number;
  max?: number;
  theme?: string;
  className?: string;
  chartData: ChartDataModel;
  getChartRef?: (ref: React.MutableRefObject<EChartsType | undefined>) => void;
  lock?: boolean;
  chartConfig: ChartModel;

  handleSeries?: (series: SeriesOption[]) => SeriesOption[];
  handleDataset?: (dataset?: DatasetOption) => DatasetOption;
  handleGrid?: (grid?: GridOption) => GridOption;
  handleRadar?: (radar?: RadarOption) => RadarOption;
  handleXAxes?: (xAxes: XAXisOption[]) => XAXisOption[];
  handleYXAxes?: (yAxes: YAXisOption[]) => YAXisOption[];
  handleTooltip?: (tooltip?: TooltipOption) => TooltipOption;
  handleDataZoom?: (dataZoom?: DataZoomOption) => DataZoomOption;
  handleLegend?: (legend?: LegendOption) => LegendOption;
  handleToolbox?: (toolbox?: ToolboxOption) => ToolboxOption;
  handleVisualMap?: (visualMap?: VisualMapOption) => VisualMapOption;
  handleOption?: (option: EChartsOption) => void;
}

const CandlesTick: React.FunctionComponent<CandlesTickProps> = (props) => {
  const classes = useStyles(props);
  const { id, theme, chartData, lock, chartConfig, handleOption, min, max } =
    props;
  const [chartProps, setChartProps] = useState<ChartProps>();
  const [yAxisNames, setYAxisNames] = useState<string[]>([]);

  function initMarkLine(chartConfig: ChartModel, chartData: ChartDataModel) {
    const markLineData = chartData.markLineData;
    const markLine: MarkLineOption = {
      symbol: "none",
      data: chartConfig.markLines.map((v) => {
        return {
          yAxis: markLineData[v.id],
          lineStyle: {
            color: v.color,
            width: 2,
            type: v.type,
          },
          label: {
            position: "end",
            formatter: `${v.label}：${markLineData[v.id]}`,
            fontSize: 12,
          },
        };
      }),
    };

    return markLine;
  }

  function initSeries(
    chartConfig: ChartModel,
    hasData: boolean,
    chartData: ChartDataModel
  ) {
    // const newSeries: SeriesOption[] = [];
    // const markLine = initMarkLine(chartConfig, chartData);
    // newSeries.push(
    //   ...chartConfig.series.map(series => {
    //     if (series.encode.y) {
    //       if (series.type == "candlestick") {
    //         return { name: chartData.dataset[0][series.encode.x], ...getSeriesByOptionType(series, hasData, markLine) };
    //       }
    //       return {
    //         name: chartData.dataset[0][series.encode.y[0]],
    //         ...getSeriesByOptionType(series, hasData, markLine),
    //       };
    //     }
    //     return getSeriesByOptionType(series, hasData, markLine);
    //   }),
    // );
    // return newSeries;
    const newSeries: SeriesOption[] = [];
    const markLine = initMarkLine(chartConfig, chartData);
    newSeries.push(
      ...chartConfig.series.map((series) =>
        getSeriesByOptionType(series, hasData, markLine)
      )
    );
    return newSeries;
  }

  function initXAxes(chartConfig: ChartModel, hasData: boolean) {
    const newXAxes: XAXisOption[] = [];
    if (chartConfig.series.length > 0) {
      const type = getOptionType(chartConfig.series[0]);
      const axis =
        chartConfig.xAxises.length > 0
          ? chartConfig.xAxises[0]
          : new AxisesModel();
      newXAxes.push(getXAxis(type, axis, chartData.unit, hasData));
    }
    return newXAxes;
  }

  function initYAxes(
    chartConfig: ChartModel,
    hasData: boolean,
    chartData: ChartDataModel
  ) {
    setYAxisNames(chartConfig.yAxises.map((axis) => axis.name));
    const newYAxes: YAXisOption[] = [];

    if (chartConfig.series.length > 0) {
      const type = getOptionType(chartConfig.series[0]);
      if (chartConfig.yAxises.length == 0) {
        newYAxes.push(
          getYAxis(type, new AxisesModel(), chartData.unit, hasData, chartData)
        );
      }
      newYAxes.push(
        ...chartConfig.yAxises.map((axis) =>
          getYAxis(type, axis, chartData.unit, hasData, chartData)
        )
      );

      if (newYAxes.length > 1) {
        newYAxes.forEach((_, i) => {
          newYAxes[i].splitLine = {
            ...newYAxes[i].splitLine,
            show: false,
          };
        });
      }

      return newYAxes;
    }
  }

  function initVisualMap(chartConfig: ChartModel) {
    if (chartConfig.series.length > 0) {
      if (chartConfig.series[0].type == "map") {
        return { ...commonVisualMap, min: min ?? 0, max: max ?? 200 };
      }
    }
  }

  function initGrid(chartConfig: ChartModel) {
    if (chartConfig.series.length > 0) {
      const type = getOptionType(chartConfig.series[0]);
      if (
        type == OptionType.line ||
        type == OptionType.bar ||
        type == OptionType.candlestick
      ) {
        if (chartConfig.markLines.length > 0) {
          return { ...markLineGrid };
        }
        return { ...commonGrid };
      }
    }
  }

  function initRadar(chartConfig: ChartModel, hasData: boolean) {
    if (
      chartConfig.series.length > 0 &&
      chartConfig.series[0].type == "radar"
    ) {
      const getDatasetMax = (): number => {
        let max = 0;
        chartData.dataset.forEach((set) =>
          set.forEach(
            (data) => typeof data == "number" && data > max && (max = data)
          )
        );
        return max;
      };

      const maxNumber = getDatasetMax();

      const indicator = chartConfig.series[0].indicators.map(
        (indicator: string) => {
          return { name: indicator, color: "#666666", max: maxNumber };
        }
      );
      return hasData
        ? commonWithoutDataRadar
        : {
            ...commonRadar,
            indicator: indicator,
          };
    }
  }

  function initTooltip(chartConfig: ChartModel, hasData: boolean) {
    if (hasData) return;
    if (chartConfig.series.length == 1) {
      const type = getOptionType(chartConfig.series[0]);
      if (type == OptionType.radar) {
        return {
          ...commonTooltip,
          formatter: radarTooltipFormatter(
            chartConfig.tooltipFormatter,
            chartConfig.series[0].indicators,
            chartData.unit
          ),
        };
      }
      if (type == OptionType.bar) {
        return {
          ...commonTooltip,
          axisPointer: {
            type: "shadow",
          },
          trigger: "axis",
          formatter: tooltipFormatter(
            chartConfig.tooltipFormatter,
            chartData.unit
          ),
        };
      }
      if (type == OptionType.line) {
        return {
          ...commonTooltip,
          axisPointer: {
            type: "line",
          },
          trigger: "axis",
          formatter: tooltipFormatter(
            chartConfig.tooltipFormatter,
            chartData.unit
          ),
        };
      }
      if (type == OptionType.candlestick) {
        return {
          ...commonTooltip,
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        };
      }
      return {
        ...commonTooltip,
        formatter: tooltipFormatter(
          chartConfig.tooltipFormatter,
          chartData.unit
        ),
      };
    }
    if (chartConfig.series.length > 1) {
      let axisPointerType: "line" | "shadow" | "cross" = "line";
      let seriesType = "";
      chartConfig.series.forEach((series) => {
        if (series.type == "bar") {
          axisPointerType = "shadow";
        }
        if (series.type == "candlestick") {
          seriesType = "candlestick";
        }
      });
      if (seriesType == "candlestick") {
        return {
          ...commonTooltip,
          axisPointer: {
            type: "cross",
          },
          trigger: "axis",
        };
      }
      return {
        ...commonTooltip,
        formatter: tooltipFormatter(
          chartConfig.tooltipFormatter,
          chartData.unit
        ),
        axisPointer: {
          type: axisPointerType,
        },
        trigger: "axis",
      };
    }
  }

  function initToolbox(chartConfig: ChartModel, hasData: boolean) {
    if (hasData) return;
    if (chartConfig.download) {
      return { ...commonToolbox };
    }
  }

  function initDataZoom(chartConfig: ChartModel, hasData: boolean) {
    if (hasData) return;
    if (chartConfig.dataZoom && chartData.dataset.length > 10) {
      let dataZoom = _.cloneDeep(commonDataZoom);

      if (
        chartConfig.dataZoomShowCount &&
        chartData.dataset.length > chartConfig.dataZoomShowCount + 1
      ) {
        return _.merge(dataZoom, {
          startValue:
            chartData.dataset.length - (chartConfig.dataZoomShowCount + 1),
        });
      }

      if (chartConfig.series[0].type == "candlestick") {
        return {
          type: "inside",
          start: 98,
          end: 100,
          minValueSpan: 10,
        };
      }
    }
  }

  function initLegend(
    chartConfig: ChartModel,
    hasData: boolean
  ): LegendOption | undefined {
    if (hasData) return;
    if (chartConfig.series.length == 1) {
      const type = getOptionType(chartConfig.series[0]);
      if (type == OptionType.pie) {
        return {
          ...commonPieLegend,
          ...(chartConfig.legendPosition === "bottom" && {
            orient: "horizontal",
            bottom: 0,
            top: "auto",
            left: "auto",
          }),
        } as LegendOption;
      }
      if (type == OptionType.candlestick) {
        const legendData: { name: string; icon?: string }[] = [];
        legendData.push({
          name: chartConfig.series[0].name.toString() ?? "",
        });
        return {
          data: legendData,
          ...commonLegend,
          show: true,
        };
      }
    }
    if (chartConfig.series.length > 1) {
      const series = chartConfig.series.map((series) =>
        getSeriesByOptionType(series, hasData)
      );
      const min = Math.min(series.length, chartData.dataset?.[0]?.length);
      const legendData: { name: string; icon?: string }[] = [];
      for (let i = 0; i < min; i++) {
        const type = getOptionType(chartConfig.series[i]);
        if (type == OptionType.candlestick) {
          legendData.push({
            name: chartData.dataset[0][i].toString() ?? "",
          });
        }
        if (type == OptionType.line) {
          legendData.push({
            name:
              chartData.dataset[0][
                chartConfig.series[i].encode.y[0]
              ].toString() ?? "",
            icon: wave,
          });
        }
      }

      return {
        data: legendData,
        ...commonLegend,
        show: true,
      };
    }
  }

  useEffect(() => {
    const noData = chartData?.dataset.length <= 0 || !chartData.dataset;

    if (chartConfig) {
      const type = getOptionType(chartConfig.series[0]);
      const data = noData
        ? { source: getDataSetSource(type) }
        : { source: chartData.dataset };
      const t: string = noData || lock ? "grey" : theme ?? "rime";
      const series = initSeries(chartConfig, noData, chartData);
      const xAxes = initXAxes(chartConfig, noData);
      const yAxes = initYAxes(chartConfig, noData, chartData);
      const grid = initGrid(chartConfig);
      const radar = initRadar(chartConfig, noData);
      const tooltip = initTooltip(chartConfig, noData);
      const toolbox = initToolbox(chartConfig, noData);
      const visualMap = initVisualMap(chartConfig);
      const dataZoom = initDataZoom(chartConfig, noData);
      const legend = initLegend(chartConfig, noData);
      const graphic = noData || lock ? commonWithoutDataGraphic : undefined;

      handleBottomLayout(xAxes, legend, dataZoom);

      setChartProps((prev) => {
        if (
          isEqual(prev, {
            theme: t,
            series: series,
            xAxis: xAxes,
            yAxis: yAxes,
            grid: grid,
            radar: radar,
            tooltip: tooltip as TooltipOption,
            toolbox: toolbox,
            visualMap: visualMap,
            dataZoom: dataZoom,
            legend: legend,
            graphic: graphic,
            dataset: data,
            getChartRef: props.getChartRef,
          })
        ) {
          return prev;
        }
        return {
          theme: t,
          series: series,
          xAxis: xAxes,
          yAxis: yAxes,
          grid: grid,
          radar: radar,
          tooltip: tooltip as TooltipOption,
          toolbox: toolbox,
          visualMap: visualMap,
          dataZoom: dataZoom,
          legend: legend,
          graphic: graphic,
          dataset: _.merge(data, { sourceHeader: true }),
          getChartRef: props.getChartRef,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, lock]);

  const chart = useMemo(() => {
    return (
      chartProps && (
        <Chart
          {...chartProps}
          className={props.className}
          handleOption={handleOption}
        />
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartProps]);

  return (
    <div className={classes.root}>
      {yAxisNames.map((yAxisName, index) => {
        if (index < 2) {
          return (
            <Typography
              key={index}
              className={clsx({
                [classes.rightChartTitle]: index === 1,
                [classes.leftChartTitle]: index === 0,
              })}
            >
              {yAxisName}
            </Typography>
          );
        }
      })}
      {chart}
    </div>
  );
};

export default CandlesTick;
