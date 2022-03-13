/**
 * 使用 legend 时注意每个 series 是否有 name， 如果没有 name，则不会展示，除非手动给 data
 */
export const commonLegend = {
  bottom: 0,
  itemWidth: 8,
  itemHeight: 8,
  itemGap: 24,
  borderRadius: 0,
  textStyle: {
    fontSize: 12,
    color: "#666",
    padding: [3, 0, 0, 0],
  },
};

/**
 * 折线图的 legend 图标，会自动适配线条的颜色
 */
export const commonLineLegendIcon =
  "path://M5,4 C7.14219539,4 8.89107888,5.68396847 8.99510469,7.80035966 L9,8 C9,9.1045695 9.8954305,10 11,10 C12.0543618,10 12.9181651,9.18412221 12.9945143,8.14926234 L13,8 L15,8 C15,10.209139 13.209139,12 11,12 C8.790861,12 7,10.209139 7,8 C7,6.8954305 6.1045695,6 5,6 C3.9456382,6 3.08183488,6.81587779 3.00548574,7.85073766 L3,8 L1,8 C1,5.790861 2.790861,4 5,4 Z";

/**
 * 柱状图的 legend 图标，会自动适配线条的颜色
 */
export const commonBarLegendIcon =
  "path://M4,7.125 C4.27614237,7.125 4.5,7.34885763 4.5,7.625 L4.5,15 L1,15 L1,7.625 C1,7.34885763 1.22385763,7.125 1.5,7.125 L4,7.125 Z M9.25,1 C9.52614237,1 9.75,1.22385763 9.75,1.5 L9.75,15 L6.25,15 L6.25,1.5 C6.25,1.22385763 6.47385763,1 6.75,1 L9.25,1 Z M14.5,7.125 C14.7761424,7.125 15,7.34885763 15,7.625 L15,15 L11.5,15 L11.5,7.625 C11.5,7.34885763 11.7238576,7.125 12,7.125 L14.5,7.125 Z";

/**
 * 自定义的 tooltip，白底黑字
 */
export const commonTooltip = {
  backgroundColor: "#ffffff",
  axisPointer: {
    // Use axis to trigger tooltip
    type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
  },
  textStyle: {
    color: "#666666",
    fontFamily: "Noto Sans SC",
    fontSize: 12,
  },
  padding: 12,
  extraCssText: "border-color:#ffffff",
  //alwaysShowContent: true,
  className: "echart-tooltip", // v5.0 支持
};

export const commonLineTooltip = {
  ...commonTooltip,
  axisPointer: {
    // Use axis to trigger tooltip
    type: "line", // 'shadow' as default; can also be 'line' or 'shadow'
  },
};

/**
 * 坐标的设置
 */
export const commonAxis = {
  show: true,
  // 轴线
  axisLine: {
    show: false,
  },
  // 刻度
  axisTick: {
    show: false,
    alignWithLabel: true,
  },
  // 刻度值，包含刻度的名称设置
  axisLabel: {
    // interval: 0,
  },
};

/**
 * 缩放配置
 */
export const commonDataZoom = {
  type: "slider",
  show: true,
  handleSize: "100%",
  xAxisIndex: [0],
  bottom: 0,
  left: 32,
  right: 50,
  // 开始的 index
  // startValue: 0,
};

/**
 * 折线配置
 */
export const commonLineSeries = {
  type: "line",
  symbol: "none",
  smooth: true,
  connectNulls: true,
  lineStyle: {
    width: 2,
  },
};

export const commonBarSeries = {
  type: "bar",
  barMaxWidth: 41,
};
