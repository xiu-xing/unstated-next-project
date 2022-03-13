import React, { useEffect } from "react";
import { init, dispose } from "klinecharts";
import Layout from "../Layout";
import generatedKLineDataList from "../utils/generatedKLineDataList";

const BasicKLineChart: React.FunctionComponent<{}> = () => {
  useEffect(() => {
    const kLineChart = init("basic-k-line");
    if (kLineChart) {
      kLineChart.applyNewData(generatedKLineDataList());
    }
    return () => {
      dispose("basic-k-line");
    };
  }, []);
  return (
    <Layout title="基础展示">
      <div id="basic-k-line" className="k-line-chart" />
    </Layout>
  );
};

export default BasicKLineChart;
