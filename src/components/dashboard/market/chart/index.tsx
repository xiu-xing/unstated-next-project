import { EChartsOption } from "echarts-for-react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import BasicChart from "../../../common/chart/basic-chart/basic-chart";
import { ChartsModel } from "../../../../models/dashboard/dashboard";
import { getThreeBarOption } from "./options";

interface ChartsProps {
  data: ChartsModel[];
}

const Chart: React.FunctionComponent<ChartsProps> = props => {
  const { data } = props;
  const [charts, setCharts] = useState<(string | number)[][]>([]);

  useEffect(() => {
    if (data.length > 0) {
      const newData = _.reverse(data).map(item => [item.date, item.investment, item.exit, item.IPO]);
      setCharts(newData);
    }
  }, [data]);

  function chartDataHandler(arr: Array<Array<string | number>>): EChartsOption {
    if (!arr) {
      return {};
    }
    const option = getThreeBarOption();

    if (arr.length) {
      try {
        option.dataset = {
          source: arr,
        };
      } catch (error) {
        console.log(error);
      }
    }
    return option;
  }

  return <BasicChart {...props} option={chartDataHandler?.(charts)} theme="dashboard" />;
};

export default Chart;
