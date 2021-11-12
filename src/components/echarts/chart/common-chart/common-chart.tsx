import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ReactEcharts, { EChartsOption } from "echarts-for-react";
import React, { HTMLProps, useEffect, useRef } from "react";

const useStyles = makeStyles({
  root: {
    width: "100% !important",
    height: "100% !important",
  },
});

export interface CommonChartProps extends HTMLProps<HTMLDivElement> {
  theme?: string;
  options: EChartsOption;
  height?: string;
  className?: string;
  getReactEcharts?: (chart: ReactEcharts) => void;
}

const CommonChart: React.FunctionComponent<CommonChartProps> = (props) => {
  const classes = useStyles(props);
  const chartRef = useRef<ReactEcharts | null>(null);

  const theme = props.theme || "rime";

  useEffect(() => {
    if (chartRef.current) {
      props.getReactEcharts?.(chartRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReactEcharts
      ref={chartRef}
      notMerge={true}
      className={clsx(classes.root, props.className)}
      theme={theme}
      option={props.options}
    />
  );
};

export default CommonChart;
