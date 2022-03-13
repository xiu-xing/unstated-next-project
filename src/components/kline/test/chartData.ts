import _, { isArray } from "lodash";

export class DataListItem {
  timestamp = 0; // 时间戳
  open = 0; // 开盘价
  close = 0; // 收盘价
  high = 0; // 最高价
  low = 0; // 最低价
  volume = 0; // 成交量
  turnover = 0; // 成交额

  static fromJSON(json: unknown): DataListItem {
    const klineData = new DataListItem();

    const timestamp = _.get(json, "timestamp");
    timestamp && (klineData.timestamp = timestamp);

    const open = _.get(json, "backward_opening_price");
    open && (klineData.open = open);

    const close = _.get(json, "backward_closing_price");
    close && (klineData.close = close);

    const high = _.get(json, "high_price");
    high && (klineData.high = high);

    const low = _.get(json, "low_price");
    low && (klineData.low = low);

    const volume = _.get(json, "volume");
    volume && (klineData.volume = volume);

    const turnover = _.get(json, "amount");
    turnover && (klineData.turnover = turnover);

    return klineData;
  }
}

/**
 * KLineChartDataModel 解析 K线图 接口返回数据
 */
export class KLineChartDataModel {
  dataList: DataListItem[] = [];

  static fromJSON(json: unknown): KLineChartDataModel {
    const data = new KLineChartDataModel();

    const dataList: DataListItem[] = _.get(json, "dataset");
    if (isArray(dataList)) {
      data.dataList = dataList.map(item => DataListItem.fromJSON(item));
    } else {
      data.dataList = [];
    }

    return data;
  }
}
