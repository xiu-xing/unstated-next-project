import { Box, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { EChartsType } from "echarts";
import React, { useEffect, useMemo, useState } from "react";
import ConfigContainer from "../../../../containers/configContainer";
import { EntityType, FilterInputs, useChartQuery } from "../../../../generated/graphql";
import { ChartModel } from "../../../../models/chart/chart";
import { ChartDataModel } from "../../../../models/chart/chartData";
import { getLockLimit } from "../../../../utils/permission";
import ACPlaceholder from "../../section/components/ac-placeholder";
import CommonChart from "../common-chart";

const useStyles = makeStyles(() =>
  createStyles({
    box: {
      height: 420,
      minWidth: 200,
    },
    blur: {
      filter: "blur(2px)",
      userSelect: "none",
      opacity: 0.5,
    },
    root: {
      position: "relative",
    },
    fetching: {
      minHeight: 400,
      display: "grid",
      placeItems: "center",
    },
  }),
);

interface ChartProps {
  entityID: string;
  entityType: EntityType;
  chartID: string;
  filterInputs?: FilterInputs;
  lock?: boolean;
  getChartRef?: (ref: React.MutableRefObject<EChartsType | undefined>) => void;
}

const DataChart: React.FunctionComponent<ChartProps> = (props) => {
  const classes = useStyles();
  const { chartID, filterInputs, entityID, entityType, lock = false } = props;
  const [chartData, setChartData] = useState<ChartDataModel>();
  const { chartConfigs } = ConfigContainer.useContainer();
  const [chartLock, setChartLock] = useState<boolean>(false);
  const [fetching, setFetching] = useState(false);
  const [chartQueryData, executeChartQuery] = useChartQuery({
    variables: {
      chartID: chartID,
      entityID: entityID,
      entityType: entityType,
      filters: filterInputs,
    },
    pause: false,
    requestPolicy: "network-only",
  });

  const chartConfig = useMemo(() => {
    if (chartID && chartConfigs) {
      const newChartConfig: ChartModel = ChartModel.fromJSON(chartConfigs[chartID]);
      return newChartConfig;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartConfigs, chartID]);

  useEffect(() => {
    if (!lock) {
      executeChartQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartID, entityID, entityType, filterInputs, lock]);

  useEffect(() => {
    setFetching(chartQueryData.fetching);

    if (!chartQueryData.fetching) {
      try {
        setChartData(ChartDataModel.fromJSON(JSON.parse(chartQueryData.data?.chart?.data as string)));
        const lock = getLockLimit(chartQueryData.data?.chart?.permissions);
        setChartLock(lock);
        // eslint-disable-next-line no-empty
      } catch { }
    }
  }, [chartQueryData]);

  return (
    <div className={classes.root}>
      <Box className={clsx(classes.box, { [classes.blur]: lock || chartLock })}>
        {fetching ? (
          <div className={classes.fetching}>
            <CircularProgress size={30} />
          </div>
        ) : (
          chartData &&
          chartConfig && (
            <CommonChart id={chartID} chartData={chartData} lock={lock || chartLock} chartConfig={chartConfig} />
          )
        )}
      </Box>
      {(lock || chartLock) && <ACPlaceholder />}
    </div>
  );
};

export default DataChart;
