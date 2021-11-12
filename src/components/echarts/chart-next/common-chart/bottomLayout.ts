import { LegendComponentOption, DataZoomComponentOption, XAXisComponentOption as XAXisOption } from "echarts";
import _ from "lodash";

const withoutXAxisNameDataZoomMargins = ["80%", "80%"];
const withoutXAxisLegendMargins = ["80%", "86%"];
const hasXAxisNameDataZoomMargins = ["81%", "81%"];
const hasXAxisNameLegendMargins = ["81%", "88%"];

export function handleBottomLayout(
  xAxes: XAXisOption[],
  legend?: LegendComponentOption,
  dataZoom?: DataZoomComponentOption,
): void {
  let dataZoomMargins = withoutXAxisNameDataZoomMargins;
  let legendMargins = withoutXAxisLegendMargins;

  let hasXAxisName = false;
  let chartBottomCount = -1;

  if (legend && legend.show) {
    chartBottomCount++;
  }
  if (dataZoom) {
    chartBottomCount++;
  }

  if (xAxes.length > 0 && xAxes[0].name && xAxes[0].name != "") {
    hasXAxisName = true;
  }

  if (hasXAxisName) {
    dataZoomMargins = hasXAxisNameDataZoomMargins;
    legendMargins = hasXAxisNameLegendMargins;
  }

  legend && !legend.top && (legend.top = legendMargins[chartBottomCount]);
  dataZoom && (dataZoom = _.merge(dataZoom, { top: dataZoomMargins[chartBottomCount] }));
}
