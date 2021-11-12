/**
 *  DataZoom handle icon
 */
export const dataZoomHandleIcon =
  "path://M0 512C0 229.230208 229.805588 0 512 0 794.769792 0 1024 229.805588 1024 512 1024 794.769792 794.194412 1024 512 1024 229.230208 1024 0 794.194412 0 512Z";

export const downloadIcon =
  "path://M5.25,20.1428571 L18.75,20.1428571 L18.75,18.2142857 L5.25,18.2142857 M18.75,9.53571429 L14.8928571,9.53571429 L14.8928571,3.75 L9.10714286,3.75 L9.10714286,9.53571429 L5.25,9.53571429 L12,16.2857143 L18.75,9.53571429 Z";

/**
 * 波浪线 legend 图标，会自动适配线条的颜色
 */
export const wave =
  "path://M5,4 C7.14219539,4 8.89107888,5.68396847 8.99510469,7.80035966 L9,8 C9,9.1045695 9.8954305,10 11,10 C12.0543618,10 12.9181651,9.18412221 12.9945143,8.14926234 L13,8 L15,8 C15,10.209139 13.209139,12 11,12 C8.790861,12 7,10.209139 7,8 C7,6.8954305 6.1045695,6 5,6 C3.9456382,6 3.08183488,6.81587779 3.00548574,7.85073766 L3,8 L1,8 C1,5.790861 2.790861,4 5,4 Z";

/**
 * 自定义的 tooltip，白底黑字
 */
export const commonTooltip = {
  backgroundColor: "#ffffff",
  textStyle: {
    color: "#666666",
    fontFamily: "Noto Sans SC",
    fontSize: 12,
    lineHeight: 56,
  },
  padding: 12,
  //alwaysShowContent: true,
  className: "echart-tooltip", // v5.0 支持
  extraCssText: "border-color:#ffffff",
  show: true,
};

/**
 * 缩放配置
 */
export const commonDataZoom = {
  type: "slider",
  show: true,
  handleSize: "90%",
  right: "7%",
  left: "7%",
  xAxisIndex: [0],
  bottom: 40,
  height: 16,
  // 取消刷选
  brushSelect: false,
  // 移动手柄的尺寸高度
  moveHandleSize: 0,
  // 手柄的 icon 形状
  handleIcon: dataZoomHandleIcon,
};

/**
 * 折线配置
 */
export const commonLineSeries = {
  type: "line",
  // 平滑
  smooth: true,
  // 是否连接空数据。
  connectNulls: true,
  showSymbol: false,
};

export const commonBarSeries = {
  type: "bar",
  barMaxWidth: 41,
};

export const commonToolbox = {
  show: true,
  top: -4,
  right: 40,
  feature: {
    saveAsImage: {
      icon: downloadIcon,
      show: true,
      iconStyle: {
        color: "RGBA(101, 101, 101, 1)",
      },
      title: "",
    },
  },
};

/**
 * 使用 legend 时注意每个 series 是否有 name， 如果没有 name，则不会展示，除非手动给 data
 */
export const commonLegend = {
  // show: false,
  itemWidth: 10,
  itemHeight: 10,
  itemGap: 15,
  borderRadius: 0,
  icon: "rect",
  textStyle: {
    fontSize: 13,
    color: "#666666",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: [3, 0, 0, 0],
  },
};

export const commonPieLegend = {
  // type: "scroll",
  orient: "vertical",
  left: "left",
  top: "middle",
  icon: "rect",
  itemWidth: commonLegend.itemWidth,
  itemHeight: commonLegend.itemHeight,
  itemGap: commonLegend.itemGap,
  textStyle: commonLegend.textStyle,
};

export const commonGrid = {
  top: "8%",
  left: "3%",
  right: "3%",
  bottom: "25%",
  containLabel: true,
};

export const markLineGrid = {
  top: "8%",
  left: "0%",
  right: 100,
  bottom: "25%",
  containLabel: true,
};

export const commonVisualMap = {
  type: "continuous",
  left: 40,
  bottom: 10,
  itemWidth: 0,
  itemHeight: 0,
  splitNumber: 4,
  inRange: {
    // 地图色块颜色范围 不会根据主题色的改变而改变,所以需要单独配置
    color: ["#9FBBD2", "#86A2BF", "#7192BA", "#4F709B"],
  },
  // 脚标
  show: false,
};

export const commonRadar = {
  radius: "60%",
  splitNumber: 3,
  // 分割线
  splitLine: {
    lineStyle: {
      color: ["#E7E9F5"],
    },
  },
  // 坐标线
  axisLine: {
    lineStyle: {
      color: "#E7E9F5",
    },
  },
  // 分割区域
  splitArea: {
    show: false,
  },
};

export const commonWithoutDataRadar = {
  ...commonRadar,
  indicator: [
    { text: "mock1", max: 1000 },
    { text: "mock2", max: 1000 },
    { text: "mock3", max: 1000 },
    { text: "mock4", max: 1000 },
    { text: "mock5", max: 1000 },
  ],
  axisName: {
    show: false,
  },
};

export const commonWithoutDataGraphic = {
  type: "group",
  bounding: "all",
  left: "center",
  top: "middle",
  z: 100,
  children: [
    {
      type: "circle",
      top: "center",
      left: "center",
      z: 99,
      shape: {
        r: 10000,
      },
      style: {
        fill: "rgba(255, 255, 255, 0.4)",
      },
      cursor: "auto",
    },
    {
      type: "text",
      left: "center",
      top: "center",
      z: 100,
      silent: true,
      style: {
        fill: "#999",
        text: "暂无数据",
        fontSize: 16,
      },
    },
  ],
};
