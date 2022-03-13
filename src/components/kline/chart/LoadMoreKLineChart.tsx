import React, { useEffect } from "react";
import { init, dispose, Chart } from "klinecharts";
import generatedKLineDataList from "../utils/generatedKLineDataList";
import Layout from "../Layout";

const LoadMoreKLineChart: React.FunctionComponent = () => {
  useEffect(() => {
    const kLineChart: Chart | null = init("load-more-k-line");
    if (kLineChart) {
      kLineChart.applyNewData(
        generatedKLineDataList(Date.now(), 5000, 200),
        true
      );
      kLineChart.loadMore((timestamp) => {
        console.log(timestamp);
        setTimeout(() => {
          const firstData = kLineChart.getDataList()[0];
          kLineChart.applyMoreData(
            generatedKLineDataList(timestamp, firstData.close, 100),
            true
          );
        }, 2000);
      });
    }
    return () => {
      dispose("load-more-k-line");
    };
  }, []);
  return (
    <Layout title="加载历史数据">
      <div id="load-more-k-line" className="k-line-chart" />
    </Layout>
  );
};

export default LoadMoreKLineChart;
