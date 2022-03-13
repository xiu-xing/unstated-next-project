import { createStyles, makeStyles } from "@material-ui/core";
import { Group } from "@visx/group";
import { HierarchyPointLink, HierarchyPointNode } from "@visx/hierarchy/lib/types";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useClient } from "urql";
import {
  EntityType,
  EquityGraphDocument,
  EquityGraphFetchType,
  EquityGraphQuery,
  EquityGraphQueryVariables,
  Graph,
} from "../../../../generated/graphql";
import { ActionModel, onAction } from "../../../../models/action/action-next";
import { getActionHandler } from "../../../mobile/common/sections/block/action";
import Modal from "../../modal";
import TreeChart, { TreeChartNodeData } from "../graph-chart/tree-chart";
import TreeChartLink from "../graph-chart/tree-chart/link";
import { constructTreeChartData, mergeGraph } from "../graph-chart/tree-chart/utils";

const useStyles = makeStyles(() =>
  createStyles({
    node: {
      "&:focus": {
        outline: 0,
      },
    },
  }),
);

const nodeWidth = 170;
const nodeHeight = 50;

interface EquityChartProps {
  chartId: string;
  entityId: string;
  entityType: EntityType;
  width?: number;
  height?: number;
  mobile?: boolean;
}

const EquityChart: React.FunctionComponent<EquityChartProps> = ({
  chartId,
  entityId,
  entityType,
  width = 500,
  height = 500,
  mobile = false,
}) => {
  const client = useClient();
  const classes = useStyles();
  const [draggable, setDraggable] = useState(true);
  const [topTreeGraph, setTopTreeGraph] = useState<Graph>();
  const [bottomTreeGraph, setBottomTreeGraph] = useState<Graph>();
  const [topTreeEdgeMap, setTopTreeEdgeMap] = useState<Map<string, string>>(new Map());
  const [bottomTreeEdgeMap, setBottomTreeEdgeMap] = useState<Map<string, string>>(new Map());
  const [topTreeExpandedNodes, setTopTreeExpandedNodes] = useState<string[]>([entityId]);
  const [secondaryTreeChartData, setTopTreeChartData] = useState<TreeChartNodeData>();
  const [bottomTreeExpandedNodes, setBottomTreeExpandedNodes] = useState<string[]>([entityId]);
  const [primaryTreeChartData, setBottomTreeChartData] = useState<TreeChartNodeData>();

  function initialDataFetching() {
    client
      .query<EquityGraphQuery, EquityGraphQueryVariables>(
        EquityGraphDocument,
        {
          graphID: chartId,
          entityID: entityId,
          entityType: entityType,
          fetchType: EquityGraphFetchType.EquityGraphFetchTypeShareholders,
        },
        {
          requestPolicy: "cache-first",
        },
      )
      .toPromise()
      .then((result) => {
        if (result.data?.equityGraph) {
          setTopTreeGraph(result.data.equityGraph);
        }
      });
    client
      .query<EquityGraphQuery, EquityGraphQueryVariables>(
        EquityGraphDocument,
        {
          graphID: "saic.equity_graph",
          entityID: entityId,
          entityType: entityType,
          fetchType: EquityGraphFetchType.EquityGraphFetchTypeInvestments,
        },
        {
          requestPolicy: "cache-first",
        },
      )
      .toPromise()
      .then((result) => {
        if (result.data?.equityGraph) {
          setBottomTreeGraph(result.data.equityGraph);
        }
      });
  }

  useEffect(() => {
    initialDataFetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (topTreeGraph) {
      const edgeMap: Map<string, string> = new Map();
      topTreeGraph.edges.forEach((edge) => {
        edgeMap.set(edge.targetID + edge.sourceID, edge.payload ?? "");
      });
      setTopTreeEdgeMap(edgeMap);
      setTopTreeChartData(constructTreeChartData(entityId, topTreeGraph, topTreeExpandedNodes, true));
    }
  }, [entityId, topTreeExpandedNodes, topTreeGraph]);

  useEffect(() => {
    if (bottomTreeGraph) {
      const edgeMap: Map<string, string> = new Map();
      bottomTreeGraph.edges.forEach((edge) => {
        edgeMap.set(edge.sourceID + edge.targetID, edge.payload ?? "");
      });
      setBottomTreeEdgeMap(edgeMap);
      setBottomTreeChartData(constructTreeChartData(entityId, bottomTreeGraph, bottomTreeExpandedNodes));
    }
  }, [entityId, bottomTreeExpandedNodes, bottomTreeGraph]);

  function expandButton(tree: "top" | "bottom", node: HierarchyPointNode<TreeChartNodeData>) {
    let isExpanded: boolean;
    switch (tree) {
      case "top":
        isExpanded = topTreeExpandedNodes.findIndex((child) => child === node.data.id) != -1;
        break;
      case "bottom":
        isExpanded = bottomTreeExpandedNodes.findIndex((child) => child === node.data.id) != -1;
        break;
    }

    let left = 0;
    let top = 0;
    const nodeEntityId = _.get(node.data.payload, "entity_id");
    const nodeEntityType = _.get(node.data.payload, "entity_type");

    switch (tree) {
      case "top":
        left = nodeWidth / 2;
        top = -6;
        break;
      case "bottom":
        left = nodeWidth / 2;
        top = nodeHeight + 6;
        break;
    }

    return (
      <Group
        left={left}
        top={top}
        onClick={() => {
          switch (tree) {
            case "bottom":
              {
                if (isExpanded) {
                  setBottomTreeExpandedNodes((oldValue) => oldValue.filter((child) => child != node.data.id));
                } else {
                  client
                    .query<EquityGraphQuery, EquityGraphQueryVariables>(
                      EquityGraphDocument,
                      {
                        graphID: "saic.equity_graph",
                        entityID: nodeEntityId,
                        entityType: nodeEntityType,
                        fetchType: EquityGraphFetchType.EquityGraphFetchTypeInvestments,
                        sourceID: node.data.id,
                      },
                      {
                        requestPolicy: "cache-first",
                      },
                    )
                    .toPromise()
                    .then((result) => {
                      if (bottomTreeGraph && result.data?.equityGraph) {
                        setBottomTreeGraph(mergeGraph(bottomTreeGraph, [result.data.equityGraph]));
                        setBottomTreeExpandedNodes((oldValue) => {
                          return oldValue.concat(node.data.id);
                        });
                      }
                    });
                }
              }
              break;
            case "top":
              {
                if (isExpanded) {
                  setTopTreeExpandedNodes((oldValue) => oldValue.filter((child) => child != node.data.id));
                } else {
                  client
                    .query<EquityGraphQuery, EquityGraphQueryVariables>(
                      EquityGraphDocument,
                      {
                        graphID: "saic.equity_graph",
                        entityID: nodeEntityId,
                        entityType: nodeEntityType,
                        fetchType: EquityGraphFetchType.EquityGraphFetchTypeShareholders,
                        sourceID: node.data.id,
                      },
                      {
                        requestPolicy: "cache-first",
                      },
                    )
                    .toPromise()
                    .then((result) => {
                      if (topTreeGraph && result.data?.equityGraph) {
                        setTopTreeGraph(mergeGraph(topTreeGraph, [result.data.equityGraph]));
                        setTopTreeExpandedNodes((oldValue) => {
                          return oldValue.concat(node.data.id);
                        });
                      }
                    });
                }
              }
              break;
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <circle r={6} fill="#fff" stroke="#4F709B" strokeWidth={1} />
        <line stroke="#4F709B" x1={-3} y1={0} x2={3} y2={0} />
        {!isExpanded && <line stroke="#4F709B" x1={0} y1={-3} x2={0} y2={3} />}
      </Group>
    );
  }

  function disableDrag() {
    setDraggable(false);
  }
  function enableDrag() {
    setDraggable(true);
  }

  function getText(name: string) {
    if (name.length > 12) {
      return (
        <>
          <text y={-5} textAnchor="middle" dominantBaseline="middle" style={{ userSelect: "none", fontSize: 12 }}>
            {name.slice(0, 12)}
          </text>
          <text y={10} textAnchor="middle" dominantBaseline="middle" style={{ userSelect: "none", fontSize: 12 }}>
            {name.length > 24 ? name.slice(12, 24) + "..." : name.slice(12, name.length)}
          </text>
        </>
      );
    }

    return (
      <text textAnchor="middle" dominantBaseline="middle" style={{ userSelect: "none", fontSize: 12 }}>
        {name}
      </text>
    );
  }

  function nodeComponent(tree: "top" | "bottom", node: HierarchyPointNode<TreeChartNodeData>) {
    const expandable = _.get(node.data.payload, "expandable") ?? false;
    const name: string = _.get(node.data.payload, "name") ?? "";
    const nodeEntityId: string = _.get(node.data.payload, "entity_id") ?? "";
    const action = mobile
      ? getActionHandler(ActionModel.fromJSON(node.data.action))
      : node.data.action
        ? onAction(ActionModel.fromJSON(node.data.action))
        : undefined;

    let childrenComponent = (
      <svg width={nodeWidth} height={nodeHeight} onMouseEnter={mobile ? undefined : disableDrag} onMouseLeave={mobile ? undefined : enableDrag}>
        <rect
          width={nodeWidth}
          height={nodeHeight}
          fill="#fff"
          stroke={nodeEntityId === entityId ? "#4F709B" : "#D8E0EB"}
          rx={4}
        />
        <Group
          left={nodeWidth / 2}
          top={nodeHeight / 2}
          onClick={action}
          style={{ cursor: action ? "pointer" : "default" }}
        >
          {getText(name)}
        </Group>
      </svg>
    );

    if (node.data.modal && !mobile) {
      childrenComponent = (
        <Modal modal={node.data.modal} onMouseEnter={disableDrag} onMouseLeave={enableDrag}>
          {childrenComponent}
        </Modal>
      );
    }

    return (
      <g className={classes.node}>
        {childrenComponent}
        {node.depth != 0 && expandable && expandButton(tree, node)}
      </g>
    );
  }

  function getLinkTextOffset(direction: "top" | "bottom", link: HierarchyPointLink<TreeChartNodeData>) {
    const offset = 15;
    let x = link.target.x + nodeWidth / 2 + offset;
    let y = link.target.y;

    switch (direction) {
      case "bottom":
        y -= offset;
        break;
      case "top":
        y = width - y + nodeHeight * 1.5 + offset;
        break;
    }

    return [x, y];
  }

  function linkComponent(direction: "top" | "bottom", link: HierarchyPointLink<TreeChartNodeData>) {
    let payload: unknown = {};
    const textOffset = getLinkTextOffset(direction, link);
    const id = link.source.data.id + link.target.data.id;

    if (direction === "bottom" && bottomTreeEdgeMap) {
      payload = bottomTreeEdgeMap.get(id);
    }
    if (direction === "top" && topTreeEdgeMap) {
      payload = topTreeEdgeMap.get(id);
    }
    try {
      payload = JSON.parse(payload as string);
    } catch (error) { }
    const capital = _.get(payload, "subscribed_capital") ?? "";
    let ratio = _.get(payload, "subscribed_ratio") ?? "";

    if (capital && ratio) ratio = "，" + ratio;

    return (
      <>
        <TreeChartLink
          key={`link-${direction}-${link.source.data.id + link.target.data.id}`}
          link={link}
          nodeWidth={nodeWidth}
          nodeHeight={nodeHeight}
          chartWidth={width}
          chartHeight={height}
          chartDirection={direction}
          highlightAnimationDirection={"forward"}
          showTargetArrow={direction === "bottom"}
          showSourceArrow={direction === "top"}
          targetArrowDirection={"bottom"}
          sourceArrowDirection={"bottom"}
        />
        <text
          key={`link-text-${direction}-${link.source.data.id + link.target.data.id}`}
          dominantBaseline="middle"
          style={{ userSelect: "none", fontSize: 10 }}
          x={textOffset[0]}
          y={textOffset[1]}
          fill="#4F709B"
        >
          {capital + ratio}
        </text>
      </>
    );
  }

  if (!secondaryTreeChartData || !primaryTreeChartData) {
    return <></>;
  }

  return (
    <TreeChart
      width={width}
      height={height}
      draggable={draggable}
      direction="bottom"
      nodeWidth={nodeWidth}
      nodeHeight={nodeHeight}
      nodeVerticalSpacing={nodeWidth / 2}
      treeData={primaryTreeChartData}
      secondaryTreeData={secondaryTreeChartData}
      nodeComponent={(node) => nodeComponent("bottom", node)}
      secondaryTreeNodeComponent={(node) => nodeComponent("top", node)}
      linkComponent={(link) => linkComponent("bottom", link)}
      secondaryTreeLinkComponent={(link) => linkComponent("top", link)}
    />
  );
};

export default EquityChart;
