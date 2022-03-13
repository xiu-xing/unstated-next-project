import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Tippy from "@tippyjs/react";
import clsx from "clsx";
import cytoscape, { Position } from "cytoscape";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import { useClient } from "urql";
import AppContainer from "../../../../containers/appContainer";
import { EntityType, Graph, GraphDocument, GraphQuery, GraphQueryVariables } from "../../../../generated/graphql";
import { ActionModel, onActionNext } from "../../../../models/action/action-next";
import { ModalModel } from "../../../../models/modal/modal";
import { getActionHandler } from "../../../mobile/common/sections/block/action";
import ModalContent from "../../modal/content";
import NetworkChart from "../graph-chart/network";

const nodeHorizontalDistance = 100;
const nodeVerticalDistance = 100;
const nodeWidth = 200;
const nodeHeight = 64;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    node: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: nodeHeight,
      width: nodeWidth,
      backgroundColor: "#fff",
      border: "1px solid #D8E0EB",
      borderRadius: 4,
      userSelect: "none",
    },
    originNode: {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    nodeTags: {
      color: theme.palette.primary.main,
    },
  }),
);

interface BeneficiaryControllerChartProps {
  chartId: string;
  entityId: string;
  entityType: EntityType;
  width: number;
  height: number;
  mobile?: boolean;
}

const BeneficiaryControllerChart: React.FunctionComponent<BeneficiaryControllerChartProps> = ({
  chartId,
  entityId,
  entityType,
  width,
  height,
  mobile = false,
}) => {
  const classes = useStyles();
  const client = useClient();
  const theme = useTheme();
  const appContainer = AppContainer.useContainer();
  const [graphData, setGraphData] = useState<cytoscape.ElementDefinition[]>([]);
  const [tippyClientRect, setTippyClientRect] = useState<DOMRect>();
  const [tippyModalModel, setTippyModalModel] = useState<any>();
  const tippyVisible = useMemo(() => {
    if (tippyModalModel && tippyClientRect) {
      return true;
    }
    return false;
  }, [tippyModalModel, tippyClientRect]);

  useEffect(() => {
    client
      .query<GraphQuery, GraphQueryVariables>(GraphDocument, {
        entityID: entityId,
        entityType: entityType,
        graphID: chartId,
      })
      .toPromise()
      .then((result) => {
        if (result.data?.graph) {
          setGraphData(constructGraphData(result.data.graph));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function constructNodePositionMap(graph: Graph): Map<string, Position> {
    const { nodes } = graph;
    const levelNodesMap: Map<number, string[]> = new Map();
    const newNodePositionMap = new Map<string, Position>();
    nodes.forEach((node) => {
      try {
        const payload = JSON.parse(node.payload);
        const level: number = _.get(payload, "level") ?? 0;
        const levelNodes = levelNodesMap.get(level);
        if (levelNodes) {
          levelNodesMap.set(level, levelNodes.concat(node.id));
        } else {
          levelNodesMap.set(level, [node.id]);
        }
      } catch (error) { }
    });
    const sortedLevels = _.sortBy(Array.from(levelNodesMap.keys()));
    let currentLevel = 0;
    let currentOffset = nodeWidth / 2;
    sortedLevels.forEach((level) => {
      const levelNodes = levelNodesMap.get(level);
      if (levelNodes) {
        levelNodes.forEach((levelNode) => {
          newNodePositionMap.set(levelNode, {
            x: currentOffset,
            y: currentLevel * nodeVerticalDistance + currentLevel * nodeHeight + nodeHeight / 2,
          });
          currentOffset = currentOffset + nodeWidth + nodeHorizontalDistance;
        });
      }
      currentLevel += 1;
      currentOffset = nodeWidth / 2;
    });
    return newNodePositionMap;
  }

  function constructGraphData(graph: Graph): cytoscape.ElementDefinition[] {
    const { nodes, edges } = graph;
    const nodePositionMap = constructNodePositionMap(graph);
    const nodeElements = nodes.map<cytoscape.ElementDefinition>((node) => {
      let payload: any;
      let modal: ModalModel | undefined;
      let action: ActionModel | undefined;
      try {
        payload = JSON.parse(node.payload);
        modal = JSON.parse(node.modal ?? "{}");
        action = JSON.parse(node.action ?? "{}");
      } catch (error) { }
      let name: string = _.get(payload, "name") ?? "";
      if (name.length > 12) {
        name = name.slice(0, 12) + "...";
      }
      const tags: string[] = _.get(payload, "tags");
      const ratio: string = _.get(payload, "ratio");
      return {
        data: {
          id: node.id,
          payload: payload,
          label: name,
          tags: tags,
          ratio: ratio,
          modal: modal,
          action: action,
        },
        position: nodePositionMap.get(node.id),
      };
    });

    const edgeElements = edges.map<cytoscape.ElementDefinition>((edge) => {
      let payload: any;
      try {
        if (edge.payload) {
          payload = JSON.parse(edge.payload);
        }
      } catch (error) { }
      return {
        data: {
          source: edge.sourceID,
          target: edge.targetID,
          payload: payload,
          label: _.get(payload, "ratio"),
        },
      };
    });

    return [...nodeElements, ...edgeElements];
  }

  if (!graphData || graphData.length == 0) {
    return null;
  }

  return (
    <>
      <Tippy
        appendTo={document.body}
        visible={tippyVisible}
        delay={[300, 0]}
        maxWidth={560}
        placement="right"
        interactive
        getReferenceClientRect={tippyClientRect ? () => tippyClientRect : null}
        content={tippyModalModel ? <ModalContent modal={ModalModel.fromJSON(tippyModalModel)} /> : null}
        popperOptions={{
          strategy: "fixed",
          modifiers: [
            {
              name: "preventOverflow",
              enabled: true,
            },
          ],
        }}
      />
      <NetworkChart
        layout={{
          name: "preset",
        }}
        data={graphData}
        className={classes.root}
        width={width}
        height={height}
        htmlNode={(data) => {
          let childrenComponents = (
            <div className={clsx(classes.node, data.id === entityId && classes.originNode)}>
              <div>{data.label}</div>
              {data.tags && data.tags.length > 0 && <div className={classes.nodeTags}>{data.tags.join(", ")}</div>}
              {data.ratio && <div className={classes.nodeTags}>{`最终收益股份 ${data.ratio}`}</div>}
            </div>
          );

          return renderToString(childrenComponents);
        }}
        style={[
          {
            selector: "node",
            style: {
              width: nodeWidth,
              height: nodeHeight,
              shape: "round-rectangle",
              "background-opacity": 0,
              "text-valign": "center",
              "text-halign": "center",
              "font-size": "12",
            },
          },
          {
            selector: "edge",
            style: {
              label: "data(label)",
              color: theme.palette.primary.main,
              "font-size": 12,
              "text-background-opacity": 0.8,
              "text-background-color": "#fff",
              width: 1,
              "curve-style": "bezier",
              "line-color": "#D8E0EB",
              "target-arrow-color": theme.palette.primary.main,
              "target-arrow-shape": "triangle",
            },
          },
          {
            selector: ":active",
            style: {
              "overlay-opacity": 0,
            },
          },
        ]}
        setup={(cy) => {
          cy.on("click", "node", (event) => {
            const nodeData = event.target._private.data;
            if (nodeData.action) {
              if (mobile) {
                getActionHandler(ActionModel.fromJSON(nodeData.action))?.();
              } else {
                onActionNext(appContainer, nodeData.action);
              }
            }
          });
          cy.on("mouseover", "node", (event) => {
            if (mobile) return;
            const nodeData = event.target._private.data;
            setTippyClientRect(event.target.popperRef().getBoundingClientRect());
            if (nodeData.modal) {
              setTippyModalModel(nodeData.modal);
              return;
            }
            setTippyModalModel(undefined);
          });
          cy.on("drag", () => {
            setTippyModalModel(undefined);
            setTippyClientRect(undefined);
          });
          cy.on("mouseout", "node", () => {
            setTippyModalModel(undefined);
            setTippyClientRect(undefined);
          });
        }}
      />
    </>
  );
};

export default BeneficiaryControllerChart;
