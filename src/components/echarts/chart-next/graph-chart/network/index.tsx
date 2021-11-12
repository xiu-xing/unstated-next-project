import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import cytoscape from "cytoscape";
import React, { useEffect, useRef } from "react";

cytoscape.use(require("cytoscape-node-html-label"));
cytoscape.use(require("cytoscape-popper"));

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 1920,
      height: 500,
    },
  }),
);

export interface NetworkChartNode {
  x: number;
  y: number;
  payload?: any;
}

export interface NetworkChartEdge {
  source: NetworkChartNode;
  target: NetworkChartNode;
  payload?: any;
}

interface NetworkChartProps {
  className?: string;
  draggable?: boolean;
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  data: cytoscape.ElementDefinition[];
  layout?: cytoscape.LayoutOptions;
  style?: cytoscape.Stylesheet[];
  htmlNode?: (data: any) => string;
  setup?: (cy: cytoscape.Core) => void;
}

const NetworkChart: React.FunctionComponent<NetworkChartProps> = ({
  className,
  draggable = true,
  width = 500,
  height = 500,
  nodeWidth = 170,
  nodeHeight = 30,
  data,
  layout,
  style,
  htmlNode,
  setup,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const graphContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cy = cytoscape({
      container: graphContainerRef.current,
      layout: layout,
      zoom: 1,
      maxZoom: 2,
      minZoom: 0.3,
      elements: data,
      style: style
        ? style
        : [
            {
              selector: "node",
              style: {
                width: nodeWidth,
                height: nodeHeight,
                shape: "round-rectangle",
                backgroundColor: "#fff",
                "border-width": "1px",
                "border-color": "#D8E0EB",
                label: "data(label)",
                "text-valign": "center",
                "text-halign": "center",
              },
            },
            {
              selector: "edge",
              style: {
                width: 1,
                "curve-style": "bezier",
                "line-color": "#D8E0EB",
                "target-arrow-color": theme.palette.primary.main,
                "target-arrow-shape": "triangle",
              },
            },
          ],
    });
    setup && setup(cy);
    if (htmlNode) {
      // @ts-ignore
      cy.nodeHtmlLabel([
        {
          query: "node",
          tpl: (data: any) => {
            return htmlNode(data);
          },
        },
      ]);
    }
  }, []);

  return <div className={classes.root} style={{ width: width, height: height }} ref={graphContainerRef} />;
};

export default NetworkChart;
