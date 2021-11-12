import { Box, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import ConfigContainer from "../../../../containers/configContainer";
import { useRealmChartQuery } from "../../../../generated/graphql";
import { ChartModel } from "../../../../models/chart/chart";
import { ChartDataModel } from "../../../../models/chart/chartData";
import { getLockLimit } from "../../../../utils/permission";
import AdvancedSearchContainer from "../../../database/realm/container";
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
  realmChartID: string;
}

const RealmDataChart: React.FunctionComponent<ChartProps> = (props) => {
  const classes = useStyles();
  const { realmChartID } = props;

  const [realmChartData, setRealmChartData] = useState<ChartDataModel>();
  const { realmChartConfigs } = ConfigContainer.useContainer();
  const [chartLock, setChartLock] = useState<boolean>(false);
  const [fetching, setFetching] = useState(false);
  const { realm, conditions } = AdvancedSearchContainer.useContainer();

  const [realmChartQueryData, executeRealmChartQuery] = useRealmChartQuery({
    variables: {
      realmID: realm,
      chartID: realmChartID,
      conditions: conditions,
    },
    pause: false,
    requestPolicy: "network-only",
  });

  const realmChartConfig = useMemo(() => {
    //pevc.vertical_builder_deal_exits chardID
    if (realmChartID && realmChartConfigs) {
      const newChartConfig: ChartModel = ChartModel.fromJSON(realmChartConfigs[realmChartID]);
      return newChartConfig;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realmChartConfigs, realmChartID]);

  useEffect(() => {
    executeRealmChartQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realmChartID, conditions]);

  useEffect(() => {
    setFetching(realmChartQueryData.fetching);

    if (!realmChartQueryData.fetching) {
      try {
        if (realmChartQueryData.data?.realmChart?.data)
          setRealmChartData(ChartDataModel.fromJSON(JSON.parse(realmChartQueryData.data?.realmChart?.data as string)));
        const lock = getLockLimit(realmChartQueryData.data?.realmChart?.permissions);
        setChartLock(lock);
        // eslint-disable-next-line no-empty
      } catch { }
    }
  }, [realmChartQueryData]);

  return (
    <div className={classes.root}>
      <Box className={clsx(classes.box, { [classes.blur]: chartLock })}>
        {fetching ? (
          <div className={classes.fetching}>
            <CircularProgress size={30} />
          </div>
        ) : (
          realmChartData &&
          realmChartConfig && (
            <CommonChart
              id={realmChartID}
              min={realmChartData.min}
              max={realmChartData.max}
              chartData={realmChartData}
              lock={chartLock}
              chartConfig={realmChartConfig}
            />
          )
        )}
      </Box>
      {chartLock && <ACPlaceholder />}
    </div>
  );
};

export default RealmDataChart;
