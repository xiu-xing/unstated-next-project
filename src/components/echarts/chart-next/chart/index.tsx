import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import * as echarts from "echarts";
import {
  DatasetComponentOption as DatasetOption,
  DataZoomComponentOption as DataZoomOption,
  EChartsOption,
  EChartsType,
  GraphicComponentOption as GraphicOption,
  GridComponentOption as GridOption,
  LegendComponentOption as LegendOption,
  RadarComponentOption as RadarOption,
  SeriesOption,
  ToolboxComponentOption as ToolboxOption,
  TooltipComponentOption as TooltipOption,
  VisualMapComponentOption as VisualMapOption,
  XAXisComponentOption as XAXisOption,
  YAXisComponentOption as YAXisOption,
} from "echarts";
import React, { HTMLProps, useEffect, useLayoutEffect, useRef } from "react";
import AppContainer from "../../../../containers/appContainer";
import { useTabIndex } from "../../../share-pages/profile/atoms";
import DrawerContainer from "../../drawer/drawerContainer";

const useStyles = makeStyles({
  root: {
    width: "100% !important",
    height: "100% !important",
  },
});

export interface ChartProps extends HTMLProps<HTMLDivElement> {
  theme: string;
  className?: string;
  getChartRef?: (ref: React.MutableRefObject<EChartsType | undefined>) => void;
  handleOption?: (option: EChartsOption) => void;
  option?: EChartsOption;
  dataset?: DatasetOption;
  grid?: GridOption;
  radar?: RadarOption;
  series?: SeriesOption[];
  xAxis?: XAXisOption[];
  yAxis?: YAXisOption[];
  tooltip?: TooltipOption;
  dataZoom?: DataZoomOption;
  legend?: LegendOption;
  graphic?: GraphicOption;
  toolbox?: ToolboxOption;
  visualMap?: VisualMapOption;
}

const Chart: React.FunctionComponent<ChartProps> = (props) => {
  const classes = useStyles(props);

  const {
    theme,
    option,
    dataset,
    grid,
    radar,
    series,
    xAxis,
    yAxis,
    tooltip,
    dataZoom,
    legend,
    graphic,
    visualMap,
    handleOption,
    getChartRef,
  } = props;

  const [tab] = useTabIndex();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<EChartsType>();
  const { showBody } = AppContainer.useContainer();
  const { drawerOpen } = DrawerContainer.useContainer();

  useEffect(() => {
    window.addEventListener("resize", () => chart.current?.resize());
    return (): void => {
      window.removeEventListener("resize", () => chart.current?.resize());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  useEffect(() => {
    const options: EChartsOption = option ?? {
      dataset,
      grid,
      radar,
      series,
      xAxis,
      yAxis,
      tooltip,
      dataZoom,
      legend,
      graphic,
      visualMap,
    };

    getChartRef?.(chart);
    const node = chartRef.current as HTMLDivElement;

    if (node) {
      const instance = echarts.getInstanceByDom(node);
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!instance) {
        instance.dispose();
        chart.current = echarts.init(node, theme, { locale: "ZH" });
        chart.current.setOption(options, true);
      } else {
        chart.current = echarts.init(node, theme, { locale: "ZH" });
        chart.current.setOption(options, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, chartRef.current]);

  useLayoutEffect(() => {
    chart.current?.resize();
  }, [tab, showBody]);

  const timer = useRef();
  useLayoutEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      chart.current?.resize();
    }, 250) as any;
  }, [drawerOpen]);

  return <div className={clsx(classes.root, props.className)} ref={chartRef} />;
};

export default Chart;
