import { OptionType } from "./optionType";

function getDataSetSource(type: OptionType): Array<Array<string | number>> {
  switch (type) {
    case OptionType.bar:
    case OptionType.line:
    case OptionType.lineAndBar:
      return [
        ["1", 3, 3],
        ["2", 7, 5],
        ["3", 8, 7],
        ["4", 2.5, 7],
        ["5", 4, 5],
        ["6", 1.5, 4],
        ["7", 5, 4],
        ["8", 6, 5],
        ["9", 6.5, 7],
        ["10", 6.8, 4],
      ];
    case OptionType.parallelBar:
      return [
        ["2", 2],
        ["3", 3],
        ["4", 4],
        ["5", 5],
        ["6", 6],
        ["7", 7],
        ["8", 8],
        ["9", 9],
        ["10", 10],
      ];
    case OptionType.map:
      break;
    case OptionType.pie:
      return [
        ["1", 1048],
        ["2", 735],
        ["3", 580],
        ["4", 300],
        ["5", 300],
        ["6", 300],
      ];
    case OptionType.radar:
      return [[250, 400, 800, 300, 250, 100]];
    case OptionType.scatter:
      return [
        [7.0, 6.04],
        [5.07, 6.95],
        [10.0, 3.58],
        [6.05, 1.81],
        [8.0, 6.33],
        [8.0, 7.66],
        [10.4, 6.81],
        [7.0, 4.33],
        [8.0, 6.96],
        [9.5, 2.82],
        [6.15, 4.20],
        [8.5, 2.20],
        [3.03, 4.23],
        [9.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [2.05, 4.96],
        [3.03, 7.24],
        [9.0, 6.26],
        [9.0, 5.84],
        [7.08, 5.82],

      ];
  }
  return [];
}

export { getDataSetSource };
