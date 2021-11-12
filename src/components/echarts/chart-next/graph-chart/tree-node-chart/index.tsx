import G6, { Graph } from "@antv/g6";
import { createStyles, makeStyles } from "@material-ui/core";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { ActionModel, ActionType } from "../../../../../models/action/action-next";
import { ModalModel } from "../../../../../models/modal/modal";
import { isJson } from "../../../../../utils/tools";
import OperationPanel from "./operation-panel";
import { registerEdgeStyle, registerNodeStyle } from "./style";
import NodeToolTips, { NodeToolTipsPosition } from "./tootip";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      minWidth: 280,
      height: 500,
      position: "relative",
      marginBottom: 24,
    },
    fullScreen: {
      width: "100%",
      height: "100%",
      zIndex: 9999,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      position: "fixed",
      marginBottom: 24,
    },
    chartDiv: {
      width: "100%",
      height: "100%",
    },
  }),
);

interface TreeNodeChartProps {
  chartData?: string;
}

const TreeNodeChart: React.FunctionComponent<TreeNodeChartProps> = (props) => {
  const classes = useStyles();
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [mouseEnterOnNode, setMouseEnterOnNode] = useState<boolean>(false);
  const [mouseEnterOnToolTip, setMouseEnterOnToolTip] = useState<boolean>(false);
  const [toolTipsPosition, setToolTipsPosition] = useState<NodeToolTipsPosition>();
  const [modal, setModal] = useState<ModalModel>();
  const rootRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();

  registerNodeStyle();
  registerEdgeStyle();

  function initG6TreeNodeChart() {
    if (ref.current && !graphRef.current && props.chartData) {
      graphRef.current = new G6.Graph({
        container: ref.current,
        layout: {
          type: "dagre",
          rankdir: "TB",
          nodesep: 55,
          ranksep: 30,
        },
        minZoom: 0.1,
        modes: {
          default: ["drag-canvas"],
        },
        defaultNode: {
          type: "tree-node-rect",
        },
        defaultEdge: {
          type: "tree-node-edge",
        },
        nodeStateStyles: {
          hover: {
            stroke: "#4F709B",
            lineWidth: 2,
          },
        },
      });
      if (!isJson(props.chartData)) return;
      const jsonValue = JSON.parse(props.chartData);
      graphRef.current.read(jsonValue["tree"]);

      graphRef.current.on("node:click", (ev) => {
        const { item } = ev;
        if (!item || !graphRef.current) return;
        const model = item.getModel();
        const nodeAction = ActionModel.fromJSON(model["action"]);

        if (nodeAction.type === ActionType.Profile) {
          if (nodeAction.args && "entity_id" in nodeAction.args && "entity_type" in nodeAction.args) {
            window.open(`/profile?id=${nodeAction.args["entity_id"]}&type=${nodeAction.args["entity_type"]}`);
          }
        }
      });

      graphRef.current.on("node:mouseenter", (ev) => {
        const { item } = ev;
        if (!item || !graphRef.current) return;
        graphRef.current.setItemState(item, "hover", true);

        const model = item.getModel();
        const point = graphRef.current.getCanvasByPoint(model.x ?? 0, model.y ?? 0);
        const currentZoom = graphRef.current.getZoom();
        const itemWidth = _.get(item._cfg, ["bboxCache", "width"]);
        const itemHeight = _.get(item._cfg, ["bboxCache", "height"]);
        let pointX = point.x - 75;
        let pointY = point.y + 34 * currentZoom;
        if (point.x < itemWidth) {
          pointX = point.x + (itemWidth + 2) * currentZoom;
          pointY = point.y - (itemHeight + 2) * currentZoom;
        }
        setToolTipsPosition({ x: pointX, y: pointY });

        if (item._cfg && item._cfg.model && !showModal) {
          const modalData = item._cfg.model["modal"];
          setModal(ModalModel.fromJSON(modalData));
          setShowModal(true);
        }
        setMouseEnterOnNode(true);
      });

      graphRef.current.on("node:mouseleave", (ev) => {
        const { item } = ev;
        if (!item || !graphRef.current) return;
        graphRef.current.setItemState(item, "hover", false);
        setMouseEnterOnNode(false);
      });

      graphRef.current.on("canvas:dblclick", () => {
        if (!fullScreen) {
          setFullScreen(true);
        }
      });

      graphRef.current.on("afterrender", () => {
        if (graphRef.current) {
          const findNode = graphRef.current.find("node", (node) => {
            return node.get("model").is_highlight === true;
          });
          if (findNode) {
            graphRef.current.focusItem(findNode, true);
            graphRef.current.translate(0, -100);
          }
        }
      });
    }
  }

  function zoomOutHandle() {
    if (!graphRef.current) return;
    const currentZoom = graphRef.current.getZoom();
    const x = (rootRef.current?.clientWidth ?? 0) / 2;
    if (currentZoom < 1) {
      graphRef.current.zoomTo(currentZoom + 0.2, { x: x, y: 250 });
    } else if (currentZoom < 10) {
      graphRef.current.zoomTo(currentZoom + 1, { x: x, y: 250 });
    }
  }

  function zoomInHandle() {
    if (!graphRef.current) return;
    const currentZoom = graphRef.current.getZoom();
    const x = (rootRef.current?.clientWidth ?? 0) / 2;
    if (currentZoom > 1) {
      graphRef.current.zoomTo(currentZoom - 1, { x: x, y: 250 });
    } else if (currentZoom >= 0.3) {
      graphRef.current.zoomTo(currentZoom - 0.2, { x: x, y: 250 });
    }
  }

  function fullScreenHandle() {
    setFullScreen((prev) => !prev);
  }

  function downloadPNGHandle() {
    if (graphRef.current) {
      graphRef.current.downloadFullImage("关系图谱", "image/png", { padding: 24, backgroundColor: "#fff" });
    }
  }

  function resize() {
    if (graphRef.current && rootRef.current) {
      const width = rootRef.current.clientWidth;
      const height = rootRef.current.clientHeight;
      graphRef.current.changeSize(width, height);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", () => resize());
    return (): void => {
      window.removeEventListener("resize", () => resize());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphRef]);

  useEffect(() => {
    initG6TreeNodeChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  useEffect(() => {
    resize();
  }, [fullScreen]);

  useEffect(() => {
    if (!mouseEnterOnNode && !mouseEnterOnToolTip) {
      setShowModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseEnterOnNode, mouseEnterOnToolTip]);

  return (
    <div className={fullScreen ? classes.fullScreen : classes.root} ref={rootRef}>
      <div ref={ref} className={classes.chartDiv}>
        {showModal && (
          <NodeToolTips
            position={toolTipsPosition}
            modal={modal}
            onMouseLeave={() => {
              setMouseEnterOnToolTip(false);
            }}
            onMouseEnter={() => {
              setMouseEnterOnToolTip(true);
            }}
          />
        )}
      </div>
      <OperationPanel
        zoomOut={zoomOutHandle}
        zoomIn={zoomInHandle}
        fullScreen={fullScreenHandle}
        downloadPNG={downloadPNGHandle}
        isFullScreen={fullScreen}
      />
    </div>
  );
};

export default TreeNodeChart;
