import G6, { IShape } from "@antv/g6";
import _ from "lodash";

// 区分中文
const pattern = new RegExp("[\u4E00-\u9FA5]+");

// 文本转换器：超长文本 => 超过指定长度之后用 ... 省略
function textFormatter(str: string | undefined, maxWidth: number, fontSize: number): string {
  if (str === undefined) return "";
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // 中文
      currentWidth += fontSize;
    } else {
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
}

// 文本长度获取器：获取文本长度
function getTextWidth(str: string | undefined, fontSize: number, maxWidth?: number): number {
  if (str === undefined) return 0;
  let currentWidth = 0;
  str.split("").forEach((letter) => {
    if (pattern.test(letter)) {
      // 中文
      currentWidth += fontSize;
    } else {
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
  });
  if (maxWidth && currentWidth > maxWidth) {
    return maxWidth;
  }
  return currentWidth;
}

export function registerNodeStyle() {
  G6.registerNode(
    "tree-node-rect",
    {
      draw(cfg, group) {
        let hasImage = false;
        if (cfg && cfg.img) {
          hasImage = true;
        }
        const rect = group?.addShape("rect", {
          attrs: {
            width: getTextWidth(cfg?.label?.toString(), 12, 150) + (hasImage ? 44 : 16),
            height: 32,
            radius: 4,
            // 高亮节点样式
            stroke: cfg?.is_highlight ? "#4F709B" : "#EEEEEE",
            fill: "#fff",
            lineWidth: 1.2,
            fillOpacity: 1,
            cursor: "pointer",
          },
          name: "node-background",
        });
        if (cfg && hasImage) {
          const imaValue = _.get(cfg.img, "value");
          group?.addShape("image", {
            attrs: {
              x: 8,
              y: 6,
              width: 20,
              height: 20,
              img: imaValue,
              cursor: "pointer",
            },
            name: "node-logo",
          });
        }
        group?.addShape("text", {
          attrs: {
            text: textFormatter(cfg?.label?.toString(), 150, 12),
            // 高亮节点样式
            fill: cfg?.is_highlight ? "#4F709B" : "#333",
            fontWeight: 400,
            fontSize: 12,
            x: hasImage ? 36 : 8,
            y: 22.5,
            cursor: "pointer",
          },
          name: "node-title",
        });
        return rect as IShape;
      },
      // 锚点
      getAnchorPoints: function getAnchorPoints() {
        return [
          [0.5, 1],
          [0.5, 0],
        ];
      },
    },
    "single-node",
  );
}

export function registerEdgeStyle() {
  G6.registerEdge("tree-node-edge", {
    itemType: "edge",
    draw: function draw(cfg, group) {
      const startPointX = cfg?.startPoint?.x ?? 0;
      const startPointY = cfg?.startPoint?.y ?? 0;
      const endPointX = cfg?.endPoint?.x ?? 0;
      const endPointY = cfg?.endPoint?.y ?? 0;
      const line = group?.addShape("path", {
        attrs: {
          stroke: "#D8E0EB",
          // ...
          path: [
            ["M", startPointX, startPointY],
            ["L", startPointX, (startPointY + endPointY) / 2],
            ["L", endPointX, (startPointY + endPointY) / 2],
            ["L", endPointX, endPointY],
          ],
          lineWidth: 1,
          endArrow: {
            path: "M 0,0 L 10, 4 L 8,0 L 10, -4 Z",
            fill: "#5192B8",
            stroke: "#5192B8",
            d: -7,
          },
        },
        name: "polyline",
      });

      if (cfg && cfg.description) {
        group?.addShape("text", {
          attrs: {
            text: cfg.description,
            fill: "#333",
            fontWeight: 400,
            fontSize: 12,
            x: endPointX,
            y: endPointY - 20,
          },
          name: "edge-description",
        });
      }
      return line as IShape;
    },
  });
}
