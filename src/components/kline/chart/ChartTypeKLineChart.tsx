import React, { useEffect } from "react";
import { init, dispose, Chart } from "klinecharts";
import Layout from "../Layout";
import generatedKLineDataList from "../utils/generatedKLineDataList";
import { useState } from "react";

const types = [
  { key: "candle_solid", text: "蜡烛实心" },
  { key: "candle_stroke", text: "蜡烛空心" },
  { key: "candle_up_stroke", text: "蜡烛涨空心" },
  { key: "candle_down_stroke", text: "蜡烛跌空心" },
  { key: "ohlc", text: "OHLC" },
  { key: "area", text: "面积图" },
];

const ChartTypeKLineChart: React.FunctionComponent<{}> = () => {
  const [kLineChart, setKlineChart] = useState<Chart | null>();

  useEffect(() => {
    let k: Chart | null = init("real-time-k-line");
    setKlineChart(k);
    if (k) {
      k.applyNewData(generatedKLineDataList());
    }
    return () => {
      dispose("real-time-k-line");
    };
  }, []);

  return (
    <Layout title="图表类型">
      <div id="real-time-k-line" className="k-line-chart" />
      {kLineChart && (
        <div className="k-line-chart-menu-container">
          {types.map(({ key, text }) => {
            return (
              <button
                key={key}
                onClick={() => {
                  kLineChart.setStyleOptions({
                    candle: {
                      type: key,
                    },
                  });
                }}
              >
                {text}
              </button>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default ChartTypeKLineChart;
