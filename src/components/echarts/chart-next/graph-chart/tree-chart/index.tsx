import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { HierarchyNode, HierarchyPointLink, HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { Zoom } from "@visx/zoom";
import _ from "lodash";
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ModalModel } from "../../../../../models/modal/modal";
import TreeChartLink from "./link";
import TreeChartNode from "./node";

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
  }),
);

const NODE_HEIGHT = 32;
const NODE_WIDTH = 258;
const NODE_HORIZONTAL_SPACING = 32;
const NODE_VERTICAL_SPACING = 32;
export type TreeChartArrowDirection = "top" | "bottom" | "left" | "right";
export type TreeChartDirection = "top" | "bottom" | "right";
export type TreeChartLinkHighlightAnimationDirection = "forward" | "backward";

export interface TreeChartNodeData {
  id: string;
  name: string;
  payload?: any;
  edgePayload?: any;
  modal?: ModalModel;
  action?: unknown;
  children?: this[];
}

interface TreeChartProps {
  className?: string;
  treeData: TreeChartNodeData;
  secondaryTree?: boolean;
  secondaryTreeData?: TreeChartNodeData;
  draggable?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  nodeHeight?: number;
  nodeWidth?: number;
  nodeHorizontalSpacing?: number;
  nodeVerticalSpacing?: number;
  direction?: TreeChartDirection;
  secondaryTreeDirection?: TreeChartDirection;
  showSourceArrow?: boolean;
  showTargetArrow?: boolean;
  sourceArrowDirection?: TreeChartArrowDirection;
  targetArrowDirection?: TreeChartArrowDirection;
  showSecondaryTreeSourceArrow?: boolean;
  showSecondaryTreeTargetArrow?: boolean;
  secondaryTreeSourceArrowDirection?: TreeChartArrowDirection;
  secondaryTreeTargetArrowDirection?: TreeChartArrowDirection;
  highlightRelationLink?: boolean;
  highlightLinkAnimationDirection?: TreeChartLinkHighlightAnimationDirection;
  nodeComponent?: (node: HierarchyPointNode<TreeChartNodeData>) => ReactNode;
  secondaryTreeNodeComponent?: (node: HierarchyPointNode<TreeChartNodeData>) => ReactNode;
  linkComponent?: (link: HierarchyPointLink<TreeChartNodeData>) => ReactNode;
  secondaryTreeLinkComponent?: (link: HierarchyPointLink<TreeChartNodeData>) => ReactNode;
}

const TreeChart: React.FunctionComponent<TreeChartProps> = ({
  className,
  treeData,
  secondaryTreeData,
  draggable = true,
  x,
  y,
  width = 500,
  height = 500,
  nodeHeight = NODE_HEIGHT,
  nodeWidth = NODE_WIDTH,
  nodeHorizontalSpacing = NODE_HORIZONTAL_SPACING,
  nodeVerticalSpacing = NODE_VERTICAL_SPACING,
  direction = "right",
  showSourceArrow = false,
  showTargetArrow = false,
  sourceArrowDirection = "left",
  targetArrowDirection = "right",
  showSecondaryTreeSourceArrow = false,
  showSecondaryTreeTargetArrow = false,
  secondaryTreeSourceArrowDirection = "left",
  secondaryTreeTargetArrowDirection = "right",
  highlightRelationLink = false,
  highlightLinkAnimationDirection = "forward",
  nodeComponent,
  secondaryTreeNodeComponent,
  linkComponent,
  secondaryTreeLinkComponent,
}) => {
  let processedX = width / 2;
  let processedY = height / 2;
  if (x != undefined) {
    processedX = x;
  }
  if (y != undefined) {
    processedY = y;
  }
  const classes = useStyles();
  const [highlightNode, setHighlightNode] = useState<HierarchyPointNode<TreeChartNodeData>>();
  const [selectedNode, setSelectedNode] = useState<TreeChartNodeData>();
  const [treeDataMemo, setTreeDataMemo] = useState<HierarchyNode<TreeChartNodeData>>(hierarchy(treeData));
  const [secondaryTreeDataMemo, setSecondaryTreeDataMemo] = useState<HierarchyNode<TreeChartNodeData>>();

  const primaryTreeSeparation = useCallback(() => {
    switch (direction) {
      case "bottom":
      case "top":
        return 1 + nodeHorizontalSpacing / nodeWidth;
      case "right":
        return 1 + nodeVerticalSpacing / nodeHeight;
    }
  }, [direction, nodeHeight, nodeHorizontalSpacing, nodeVerticalSpacing, nodeWidth]);
  const secondaryTreeSeparation = useCallback(() => {
    return 1 + nodeHorizontalSpacing / nodeWidth;
  }, [nodeHorizontalSpacing, nodeWidth]);

  useEffect(() => {
    const hierarchiedTreeData = hierarchy(treeData);
    if (!_.isEqual(hierarchiedTreeData, treeDataMemo)) {
      setTreeDataMemo(hierarchiedTreeData);
    }
  }, [treeData]);

  useEffect(() => {
    if (!secondaryTreeData) {
      return;
    }
    const hierarchiedSecondaryTreeData = hierarchy(secondaryTreeData);
    if (!_.isEqual(hierarchiedSecondaryTreeData, secondaryTreeDataMemo)) {
      setSecondaryTreeDataMemo(hierarchiedSecondaryTreeData);
    }
  }, [secondaryTreeData]);

  const treeSize = useMemo<[number, number]>(() => {
    return [width, height];
  }, [width, height]);

  const nodeSize = useMemo<[number, number]>(() => {
    switch (direction) {
      case "top":
      case "bottom":
        return [nodeWidth, nodeHeight + nodeVerticalSpacing];
      case "right":
        return [nodeHeight, nodeWidth + nodeHorizontalSpacing];
    }
  }, [direction, nodeHeight, nodeHorizontalSpacing, nodeVerticalSpacing, nodeWidth]);

  function isRelatedLink(link: HierarchyPointLink<TreeChartNodeData>): boolean {
    if (_.isEqual(link.source.data, highlightNode?.data)) {
      return true;
    }
    if (_.isEqual(link.target.data, highlightNode?.data)) {
      if (_.isEqual(link.source.data, highlightNode?.parent?.data)) {
        return true;
      }
    }
    return false;
  }

  function reorderLinks(links: HierarchyPointLink<TreeChartNodeData>[]): HierarchyPointLink<TreeChartNodeData>[] {
    const unhighlightLinks = links.filter((link) => !isRelatedLink(link));
    const highlightLinks = links.filter((link) => isRelatedLink(link));
    return [...unhighlightLinks, ...highlightLinks];
  }

  const primaryTreeMemoComponent = useMemo(() => {
    return (
      <Group key="primary-tree" left={0} top={0}>
        <Tree<TreeChartNodeData>
          root={treeDataMemo}
          size={treeSize}
          left={0}
          top={0}
          separation={primaryTreeSeparation}
          nodeSize={nodeSize}
        >
          {(tree) => {
            return (
              <Group key="primary-tree-group">
                {reorderLinks(tree.links()).map((link, index) => {
                  if (linkComponent) {
                    return linkComponent(link);
                  }
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <TreeChartLink
                      key={`link-primary-${index}`}
                      link={link}
                      nodeWidth={nodeWidth}
                      nodeHeight={nodeHeight}
                      chartWidth={treeSize[0]}
                      chartHeight={treeSize[1]}
                      chartDirection={direction}
                      isHighlight={highlightRelationLink ? isRelatedLink(link) : false}
                      highlightAnimationDirection={highlightLinkAnimationDirection}
                      showSourceArrow={showSourceArrow}
                      sourceArrowDirection={sourceArrowDirection}
                      showTargetArrow={showTargetArrow}
                      targetArrowDirection={targetArrowDirection}
                    />
                  );
                })}
                {tree.descendants().map((node, index) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <TreeChartNode
                      key={`node-primary-${index}`}
                      node={node}
                      width={nodeWidth}
                      height={nodeHeight}
                      chartWidth={treeSize[0]}
                      chartHeight={treeSize[1]}
                      chartDirection={direction}
                      onMouseEnter={() => {
                        setHighlightNode(node);
                      }}
                      onMouseLeave={() => {
                        setHighlightNode(undefined);
                      }}
                      component={nodeComponent ? (componentNode) => nodeComponent(componentNode) : undefined}
                    />
                  );
                })}
              </Group>
            );
          }}
        </Tree>
      </Group>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    treeDataMemo,
    treeSize,
    primaryTreeSeparation,
    direction,
    showSourceArrow,
    sourceArrowDirection,
    showTargetArrow,
    targetArrowDirection,
  ]);

  const secondaryTreeMemoComponent = useMemo(() => {
    {
      return (
        secondaryTreeDataMemo && (
          <Group key="secondary-tree" left={0} top={-treeSize[0] - nodeHeight / 2 - 2}>
            <Tree<TreeChartNodeData>
              root={secondaryTreeDataMemo}
              size={treeSize}
              left={0}
              top={0}
              separation={secondaryTreeSeparation}
              nodeSize={nodeSize}
            >
              {(tree) => (
                <Group key="secondary-tree-group">
                  {reorderLinks(tree.links()).map((link, index) => {
                    if (secondaryTreeLinkComponent) {
                      return secondaryTreeLinkComponent(link);
                    }
                    return (
                      <TreeChartLink
                        key={`link-secondary-${index}`}
                        link={link}
                        nodeWidth={nodeWidth}
                        nodeHeight={nodeHeight}
                        chartWidth={treeSize[0]}
                        chartHeight={treeSize[1]}
                        chartDirection={"top"}
                        isHighlight={highlightRelationLink ? isRelatedLink(link) : false}
                        highlightAnimationDirection={highlightLinkAnimationDirection}
                        showSourceArrow={showSecondaryTreeSourceArrow}
                        sourceArrowDirection={secondaryTreeSourceArrowDirection}
                        showTargetArrow={showSecondaryTreeTargetArrow}
                        targetArrowDirection={secondaryTreeTargetArrowDirection}
                      />
                    );
                  })}
                  {tree.descendants().map((node, index) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <TreeChartNode
                        key={`node-secondary-${index}`}
                        node={node}
                        width={nodeWidth}
                        height={nodeHeight}
                        chartWidth={treeSize[0]}
                        chartHeight={treeSize[1]}
                        chartDirection={"top"}
                        onMouseEnter={() => {
                          setHighlightNode(node);
                        }}
                        onMouseLeave={() => {
                          setHighlightNode(undefined);
                        }}
                        component={
                          secondaryTreeNodeComponent
                            ? (componentNode) => secondaryTreeNodeComponent(componentNode)
                            : undefined
                        }
                      />
                    );
                  })}
                </Group>
              )}
            </Tree>
          </Group>
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    treeSize,
    secondaryTreeDataMemo,
    secondaryTreeSeparation,
    direction,
    showSecondaryTreeSourceArrow,
    secondaryTreeSourceArrowDirection,
    showSecondaryTreeTargetArrow,
    secondaryTreeTargetArrowDirection,
  ]);

  return (
    <Zoom
      className={className}
      width={width}
      height={height}
      scaleXMax={2}
      scaleXMin={0.5}
      scaleYMax={2}
      scaleYMin={0.5}
      transformMatrix={{
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        translateX: processedX,
        translateY: processedY,
      }}
    >
      {(zoom) => (
        <svg
          width={width}
          height={height}
          style={{ cursor: zoom.isDragging ? "grabbing" : "grab" }}
          onTouchStart={draggable ? zoom.dragStart : undefined}
          onTouchMove={draggable ? zoom.dragMove : undefined}
          onTouchEnd={draggable ? zoom.dragEnd : undefined}
          onMouseDown={draggable ? zoom.dragStart : undefined}
          onMouseMove={draggable ? zoom.dragMove : undefined}
          onMouseUp={draggable ? zoom.dragEnd : undefined}
          onMouseLeave={() => {
            if (zoom.isDragging) zoom.dragEnd();
          }}
        >
          <g transform={zoom.toString()}>
            {primaryTreeMemoComponent}
            {secondaryTreeMemoComponent}
          </g>
        </svg>
      )}
    </Zoom>
  );
};

export default TreeChart;
