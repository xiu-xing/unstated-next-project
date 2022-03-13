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
  const [start, setStart] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => chart.current?.resize());
    return (): void => {
      window.removeEventListener("resize", () => chart.current?.resize());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  useEffect(() => {
    if (series && series[0].type == "candlestick") {
      const newSeries: SeriesOption = series[0];
      const getSeries: SeriesOption[] = chart.current?.getOption()
        .series as SeriesOption[];
      let newType = "";
      if (getSeries && getSeries.length > 0) {
        newType = getSeries[0].type ?? "";
      }
      if (start < 30 && newType == "candlestick") {
        const options: EChartsOption = {
          dataset,
          grid,
          series: [
            {
              type: "line",
              smooth: true,
              // 是否连接空数据。
              connectNulls: true,
              //
              showSymbol: false,
              name: newSeries.name,
              encode: newSeries.encode,
              lineStyle: {
                width: 1,
              },
            },
          ],
          xAxis,
          yAxis,
          tooltip,
          dataZoom: {
            type: "inside",
            start: start,
            end: 100,
          },
          legend,
        };
        chart.current?.setOption(options, true);
      }
      if (start > 30 && newType == "line") {
        chart.current?.setOption(
          {
            dataset,
            grid,
            series,
            xAxis,
            yAxis,
            tooltip,
            dataZoom: {
              type: "inside",
              start: start + 30,
              end: 100,
            },
            legend,
          },
          true
        );
      }
    }
  }, [start, series]);

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
        try {
          chart.current.setOption(options, true);
        } catch (err) {}
      } else {
        chart.current = echarts.init(node, theme, { locale: "ZH" });
        try {
          chart.current.setOption(options, true);
        } catch (err) {}
      }
      chart.current?.on("datazoom", (event) => {
        setStart(event.batch[0].start);
      });
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
