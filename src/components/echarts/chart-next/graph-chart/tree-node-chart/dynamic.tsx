import dynamic from "next/dynamic";

const DynamicTreeNodeChart = dynamic(() => import("./index"), {
  ssr: false,
});

export default DynamicTreeNodeChart;
