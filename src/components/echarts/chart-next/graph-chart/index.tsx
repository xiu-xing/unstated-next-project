import { Box, CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { EntityType, FilterInputs, NextPlatform, useGraphQuery } from "../../../../generated/graphql";
import { useProfileEntity } from "../../../share-pages/profile/atoms";
import DynamicG6TreeNodeChart from "./tree-node-chart/dynamic";

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      width: "100%",
      padding: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    onData: {
      width: "100%",
      minHeight: 100,
      fontSize: 16,
      color: "#666",
      display: "grid",
      placeItems: "center",
    },
  }),
);

interface TreeNodeChartProps {
  graphId?: string;
  filters?: FilterInputs;
  entityID?: string;
  entityType?: EntityType;
  mobile?: boolean;
}

const GraphChart: React.FunctionComponent<TreeNodeChartProps> = (props) => {
  const classes = useStyles();
  const [profileEntity] = useProfileEntity();
  const [chartData, setChartData] = useState<string>();

  const [graphQueryResult] = useGraphQuery({
    variables: {
      entityID: props.entityID ?? profileEntity.id,
      entityType: props.entityType ?? profileEntity.type,
      graphID: props.graphId ?? "",
      filters: props.filters,
      platform: props.mobile ? NextPlatform.PlatformMobile : NextPlatform.PlatformWeb,
    },
    requestPolicy: "network-only",
  });

  useEffect(() => {
    if (!graphQueryResult || graphQueryResult.fetching) return;
    setChartData(graphQueryResult?.data?.graph?.data ?? undefined);
  }, [graphQueryResult]);

  const component = () => {
    if (!graphQueryResult.fetching && graphQueryResult.error) {
      return <div className={classes.onData}>暂无数据</div>;
    }
    if (graphQueryResult.fetching || chartData == undefined) {
      return (
        <Box className={classes.loading}>
          <CircularProgress size={32} />
        </Box>
      );
    }
    return <DynamicG6TreeNodeChart chartData={chartData} />;
  };

  return <>{component()}</>;
};

export default GraphChart;
