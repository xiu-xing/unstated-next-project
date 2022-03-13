import _ from "lodash";
import { TreeChartNodeData } from ".";
import { Graph, GraphEdge, GraphNode } from "../../../../../generated/graphql";
import { ModalModel } from "../../../../../models/modal/modal";

function haveChildrenNodes(nodes: TreeChartNodeData[][]): TreeChartNodeData[][] {
  const resultNodes: TreeChartNodeData[][] = [];

  nodes.forEach((node) => {
    node.forEach((child) => {
      if (child.children && child.children.length > 0) {
        resultNodes.push(child.children);
      }
    });
  });
  return resultNodes;
}

export function getMaxLevel(data: TreeChartNodeData): number {
  let level = 0;

  let nodes = [[data]] ?? [];
  while (nodes.length > 0) {
    level += 1;
    nodes = Array.from(haveChildrenNodes(nodes));
  }

  return level;
}

export function getMaxNodeWidth(data: TreeChartNodeData): number {
  let maxNodeWidth = 0;

  let nodes = [[data]] ?? [];
  while (nodes.length > 0) {
    const allNodes = nodes.reduce((previous, current) => {
      return [...previous, ...current];
    });
    if (allNodes.length > maxNodeWidth) {
      maxNodeWidth = allNodes.length;
    }
    nodes = Array.from(haveChildrenNodes(nodes));
  }
  return maxNodeWidth;
}

export function constructTreeChartData(
  sourceNode: string,
  graph: Graph,
  expandedNodes: string[],
  invert?: boolean,
): TreeChartNodeData | undefined {
  const nodeMap: Map<string, GraphNode> = new Map();
  graph.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });
  let edges = graph.edges;
  if (invert) {
    edges = edges.map((edge) => {
      const newEdge = _.clone(edge);
      newEdge.sourceID = edge.targetID;
      newEdge.targetID = edge.sourceID;
      return newEdge;
    });
  }
  return constructTreeChartNode(sourceNode, nodeMap, edges, expandedNodes);
}

export function constructTreeChartNode(
  sourceNode: string,
  nodeMap: Map<string, GraphNode>,
  edges: GraphEdge[],
  expandedNodes: string[],
): TreeChartNodeData | undefined {
  const nodeData: TreeChartNodeData = {
    id: sourceNode,
    name: sourceNode,
  };
  const node = nodeMap.get(sourceNode);
  if (!node) {
    return undefined;
  }
  try {
    nodeData.payload = JSON.parse(node.payload);
    if (node.modal) {
      nodeData.modal = ModalModel.fromJSON(JSON.parse(node.modal));
    }
    if (node.action) {
      nodeData.action = JSON.parse(node.action);
    }
    // console.log(nodeData);
  } catch (error) { }
  const children: TreeChartNodeData[] = [];
  const sourceEdges = edges.filter((edge) => edge.sourceID === sourceNode);
  sourceEdges.forEach((sourceEdge) => {
    const childNode = constructTreeChartNode(sourceEdge.targetID, nodeMap, edges, expandedNodes);
    if (childNode) {
      children.push(childNode);
    }
  });
  if (expandedNodes.findIndex((child) => sourceNode === child) != -1) {
    nodeData.children = children;
  }
  return nodeData;
}

export function mergeGraph(sourceGraph: Graph, graphs: Graph[]): Graph {
  let newGraph = _.clone(sourceGraph);
  graphs.forEach((graph) => {
    newGraph.edges = _.uniq(newGraph.edges.concat(graph.edges));
    newGraph.nodes = _.uniq(newGraph.nodes.concat(graph.nodes));
  });
  return newGraph;
}
