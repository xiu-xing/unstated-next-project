import { SeriesModel } from "../../../../../models/chart/chart";

export enum OptionType {
  line = "LINE",
  bar = "BAR",
  scatter = "SCATTER",
  map = "MAP",
  pie = "PIE",
  radar = "RADAR",
  parallelBar = "PARALLEL_BAR",
  lineAndBar = "LINE_AND_BAR",
  candlestick = "CANDLES_TICK",
}

export function getOptionType(series?: SeriesModel): OptionType {
  if (series?.category == "x_axis") return OptionType.parallelBar;

  switch (series?.type) {
    case "bar":
      return OptionType.bar;
    case "line":
      return OptionType.line;
    case "scatter":
      return OptionType.scatter;
    case "map":
      return OptionType.map;
    case "pie":
      return OptionType.pie;
    case "radar":
      return OptionType.radar;
    case "candlestick":
      return OptionType.candlestick;
    default:
      return OptionType.line;
  }
}
