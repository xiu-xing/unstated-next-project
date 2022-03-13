import dynamic from "next/dynamic";

const DynamicTooltipKLineChart = dynamic(() => import("./test"), {
  ssr: false,
});

export default DynamicTooltipKLineChart;
