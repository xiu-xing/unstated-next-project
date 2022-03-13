import { HumanReadableString, HumanReadableUnitToUnit } from "../../../../../utils/unit";
import {
  FormatterModel,
  TooltipTitleModel,
  ValueFormatterModel,
  TooltipFormatterModel,
} from "../../../../../models/chart/chart";

export interface ChartParam {
  seriesName: string;
  axisValue: string;
  data: string | number[];
  color: string;
  componentIndex: number;
  name: string;
  dimensionNames: string[];
  value: string[];
}

// export function

export function tooltipLoopItem(
  tooltipModels: FormatterModel[],
  chartParam: ChartParam,
  unit: string,
  showIcon: boolean,
): string {
  let formatter = "";
  if (!chartParam) {
    return formatter;
  }
  if (showIcon && chartParam.color) {
    formatter += `<span style="display: inline-block; background-color: ${chartParam.color}; margin-right: 6px; margin-bottom: 1px; width: 6px; height: 6px; margin-top: 10px" ></span>`;
  }
  tooltipModels.forEach((tooltipModel) => {
    if (tooltipModel.type == "variable") {
      if (tooltipModel.value == "a") {
        formatter += chartParam.seriesName;
      }
      if (tooltipModel.value == "b") {
        if (chartParam.axisValue) {
          formatter += chartParam.axisValue;
        } else {
          formatter += chartParam.name;
        }
      }
      if (tooltipModel.value == "c") {
        if (tooltipModel.formatter == "currency") {
          formatter += chartParam.data
            ? HumanReadableString(
              (chartParam.data[chartParam.componentIndex + 1] as number) ?? 0,
              HumanReadableUnitToUnit(unit),
            )
            : 0;
        } else {
          const t = Math.floor((chartParam.data?.[chartParam.componentIndex + 1] as number) * 100) / 100;

          const v = t !== t ? chartParam.data?.[chartParam.componentIndex + 1] ?? 0 : t;

          formatter += chartParam.data ? v : 0;
        }
      }
      if (tooltipModel.value == "u") {
        formatter += unit;
      }
    }
    if (tooltipModel.type == "string") {
      formatter += tooltipModel.value;
    }
  });

  return `<span style="margin-top: 10px !important;">${formatter}</span>`;
}

export function tooltipHead(tooltipTitleModel: TooltipTitleModel, axisValue: string): string | undefined {
  if (!tooltipTitleModel || tooltipTitleModel.type == "" || tooltipTitleModel.type == "none") {
    return;
  }
  switch (tooltipTitleModel.type) {
    case "custom":
      return `<span style="font-weight:400;color:#333333;">${tooltipTitleModel.text}</span>` + "<br/>";
    case "category":
      return `<span style="font-weight:400;color:#333333;">${axisValue}</span>` + "<br/>";
    case "time": {
      const date = new Date(Math.round(Number(axisValue)));
      return (
        `<span style="font-weight:400;color:#333333;">${[date.getFullYear(), date.getMonth() + 1, date.getDate()].join(
          "-",
        )}</span>` + "<br/>"
      );
    }
  }
  return;
}

export function tooltipCustomItem(
  tooltipModel: FormatterModel,
  chartParam: ChartParam,
  unit: string,
): string | undefined {
  let formatter = "";
  if (tooltipModel.type == "variable") {
    if (tooltipModel.value == "a") {
      formatter += chartParam.seriesName;
    }
    if (tooltipModel.value == "b") {
      if (chartParam.axisValue) {
        formatter += chartParam.axisValue;
      } else {
        formatter += chartParam.name;
      }
    }
    if (tooltipModel.value == "c") {
      if (tooltipModel.formatter == "currency") {
        formatter += chartParam.data
          ? HumanReadableString(chartParam.data[tooltipModel.index] as number, HumanReadableUnitToUnit(unit))
          : 0;
      } else {
        formatter += chartParam.data ? chartParam.data[tooltipModel.index] : 0;
      }
    }
    if (tooltipModel.value == "u") {
      formatter += unit;
    }
  }
  if (tooltipModel.type == "string") {
    formatter += tooltipModel.value;
  }

  return formatter;
}

export function tooltipBody(
  valueFormatter: ValueFormatterModel,
  chartParams: Array<ChartParam>,
  unit: string,
): string | undefined {
  let tooltipBody = "";
  if (valueFormatter && chartParams.length > 0) {
    if (valueFormatter.type == "loop") {
      for (let i = 0; i < valueFormatter.loop; i++) {
        const showIcon = valueFormatter.loop > 1;
        const item = tooltipLoopItem(valueFormatter.formatters, chartParams[i], unit, showIcon);
        tooltipBody += item;
        // 换行
        valueFormatter.loop != i && item != "" && (tooltipBody += "<br/>");
      }
    }
    if (valueFormatter.type == "custom") {
      valueFormatter.formatters.forEach((formatter) => {
        tooltipBody += tooltipCustomItem(formatter, chartParams[0], unit);
      });
    }
    return tooltipBody;
  }
  return;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tooltipFormatter(tooltipFormatter: TooltipFormatterModel, unit: string): any {
  return (chartParams: ChartParam | Array<ChartParam>): string => {
    let tooltip = "";
    if (chartParams && tooltipFormatter) {
      if (Array.isArray(chartParams) && chartParams.length > 0) {
        const tooltipTitle = tooltipHead(tooltipFormatter.title, chartParams[0].axisValue);
        tooltipTitle && (tooltip += tooltipTitle);
        const tooltipContent = tooltipBody(tooltipFormatter.valueFormatter, chartParams, unit);
        tooltipContent && (tooltip += tooltipContent);
      } else {
        const chartParam = chartParams as ChartParam;
        const tooltipTitle = tooltipHead(tooltipFormatter.title, chartParam.axisValue);
        tooltipTitle && (tooltip += tooltipTitle);
        const tooltipContent = tooltipBody(tooltipFormatter.valueFormatter, [chartParam], unit);
        tooltipContent && (tooltip += tooltipContent);
      }
    }
    return tooltip;
  };
}

export function radarTooltipFormatter(
  tooltipFormatter: TooltipFormatterModel,
  indicators: string[],
  unit: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  return (chartParam: ChartParam): string => {
    let tooltip = "";
    indicators.forEach((indicator: string, index: number) => {
      tooltipFormatter.valueFormatter.formatters.forEach((formatter) => {
        if (formatter.type == "variable") {
          if (formatter.value == "b") {
            tooltip += indicator;
          }
          if (formatter.value == "c") {
            if (formatter.formatter == "currency") {
              tooltip += chartParam.data
                ? HumanReadableString(
                  chartParam.data[chartParam.componentIndex + 1] as number,
                  HumanReadableUnitToUnit(unit),
                )
                : 0;
            } else {
              tooltip += chartParam.data ? chartParam.data[index] : 0;
            }
          }
          if (formatter.value == "u") {
            tooltip += unit;
          }
        }
        if (formatter.type == "string") {
          tooltip += formatter.value;
        }
      });
      indicators.length != index - 1 && (tooltip += "<br/>");
    });
    return tooltip;
  };
}
