import { Box, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import ConfigContainer from "../../../../containers/configContainer";
import { useTrealmRealmChartQuery } from "../../../../generated/graphql";
import { ChartModel } from "../../../../models/chart/chart";
import { ChartDataModel } from "../../../../models/chart/chartData";
import { getLockLimit } from "../../../../utils/permission";
import InstitutionGridTabContainer from "../../../database/institution/tabs-content/grid-tab/container";
import ACPlaceholder from "../../section/components/ac-placeholder";
import CommonChart from "../common-chart";

const useStyles = makeStyles(() =>
  createStyles({
    box: {
      height: 600,
      minWidth: 200,
    },
    blur: {
      filter: "blur(2px)",
      userSelect: "none",
      opacity: 0.5,
    },
    root: {
      position: "relative",
      width: "100%",
    },
    fetching: {
      minHeight: 400,
      display: "grid",
      placeItems: "center",
    },
  }),
);

interface ChartProps {
  chartID: string;
}

const TrealmRealmDataChart: React.FunctionComponent<ChartProps> = (props) => {
  const classes = useStyles();
  const { chartID } = props;

  const [realmChartData, setRealmChartData] = useState<ChartDataModel>();
  const { trealmChartConfigs } = ConfigContainer.useContainer();
  const [chartLock, setChartLock] = useState<boolean>(false);
  const [fetching, setFetching] = useState(false);
  const { conditions } = InstitutionGridTabContainer.useContainer();

  const [trealmRealmChartQueryResult, executeTrealmRealmChartQuery] = useTrealmRealmChartQuery({
    variables: {
      chartID: chartID,
      conditions: conditions,
    },
    pause: false,
    requestPolicy: "network-only",
  });

  const trealmChartConfig = useMemo(() => {
    if (chartID && trealmChartConfigs) {
      const newChartConfig: ChartModel = ChartModel.fromJSON(trealmChartConfigs[chartID]);
      return newChartConfig;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trealmChartConfigs, chartID]);

  useEffect(() => {
    executeTrealmRealmChartQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartID, conditions]);

  useEffect(() => {
    setFetching(trealmRealmChartQueryResult.fetching);

    if (!trealmRealmChartQueryResult.fetching) {
      try {
        if (trealmRealmChartQueryResult.data?.trealmRealmChart?.data)
          setRealmChartData(
            ChartDataModel.fromJSON(JSON.parse(trealmRealmChartQueryResult.data?.trealmRealmChart?.data as string)),
          );
        const lock = getLockLimit(trealmRealmChartQueryResult.data?.trealmRealmChart?.permissions);
        setChartLock(lock);
        // eslint-disable-next-line no-empty
      } catch { }
    }
  }, [trealmRealmChartQueryResult]);

  return (
    <div className={classes.root}>
      <Box className={clsx(classes.box, { [classes.blur]: chartLock })}>
        {fetching ? (
          <div className={classes.fetching}>
            <CircularProgress size={30} />
          </div>
        ) : (
          realmChartData &&
          trealmChartConfig && (
            <CommonChart
              id={chartID}
              min={realmChartData.min}
              max={realmChartData.max}
              chartData={realmChartData}
              lock={chartLock}
              chartConfig={trealmChartConfig}
            />
          )
        )}
      </Box>
      {chartLock && <ACPlaceholder />}
    </div>
  );
};

export default TrealmRealmDataChart;
