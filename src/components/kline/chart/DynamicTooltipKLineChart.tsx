import dynamic from "next/dynamic";

const DynamicTooltipKLineChart = dynamic(() => import("./TooltipKLineChart"), {
  ssr: false,
});

export default DynamicTooltipKLineChart;
