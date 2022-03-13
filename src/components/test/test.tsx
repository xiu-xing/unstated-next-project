import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { ChartDataModel } from "../../../models/chart/chartData";
import { EntityType, useChartQuery } from "../../../generated/graphql";
import CommonChart from "../../share-component/chart-next/common-chart";
import { ChartModel } from "../../../models/chart/chart";
import ConfigContainer from "../../../containers/configContainer";

const Test: React.FunctionComponent = () => {
  const [chartData, setChartData] = useState<ChartDataModel>();
  const [config, setConfig] = useState<ChartModel>();

  const { chartConfigs } = ConfigContainer.useContainer();
  const [chartQueryData] = useChartQuery({
    variables: {
      chartID: "secondary_market.k_line_a_share",
      entityID: "1027601078",
      entityType: EntityType.Organization,
    },
    requestPolicy: "network-only",
  });

  useEffect(() => {
    if (!chartQueryData.fetching) {
      try {
        setChartData(ChartDataModel.fromJSON(JSON.parse(chartQueryData.data?.chart?.data as string)));
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }, [chartQueryData]);

  useEffect(() => {
    if (chartConfigs) {
      const newChartConfig: ChartModel = ChartModel.fromJSON(chartConfigs["secondary_market.k_line_a_share"]);
      setConfig(newChartConfig);
    }
  }, []);
  return (
    <Box style={{ height: 400, border: "1px solid #eee" }}>
      {chartData && config && <CommonChart id={"K"} chartData={chartData} chartConfig={config} />}
    </Box>
  );
};

export default Test;
