import _ from "lodash";
import { CurrencyCode } from "../../../../../utils/currency";

/**
 * ChartDataModel 解析接口 chartData 返回的数据
 */
export class ChartDataModel {
  title = "";
  subtitle = "";
  currencyCode: CurrencyCode = "CNY";
  unit = "";
  dataset: Array<Array<string | number>> = [];
  min: number | undefined = undefined;
  max: number | undefined = undefined;
  markLineData: Map<string, number> = new Map();

  static fromJSON(json: unknown): ChartDataModel {
    const newInstance = new ChartDataModel();

    const title: string = _.get(json, "title");

    title && (newInstance.title = title);

    const subtitle: string = _.get(json, "sub_title");
    subtitle && (newInstance.subtitle = subtitle);

    const currencyCode: CurrencyCode = _.get(json, "currency_code");
    currencyCode && (newInstance.currencyCode = currencyCode);

    const unit: string = _.get(json, "unit");
    unit && (newInstance.unit = unit);

    const min: number = _.get(json, "min");
    newInstance.min = min;

    const max: number = _.get(json, "max");
    newInstance.max = max;

    const dataset: Array<Array<string | number>> = _.get(json, "dataset");
    dataset && (newInstance.dataset = dataset);

    const markLineData: Map<string, number> = _.get(json, "markline_data");
    markLineData && (newInstance.markLineData = markLineData);

    return newInstance;
  }
}
