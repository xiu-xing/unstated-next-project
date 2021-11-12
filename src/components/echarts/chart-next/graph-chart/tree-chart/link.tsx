import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { HierarchyPointLink } from "@visx/hierarchy/lib/types";
import { LinkHorizontalStep, LinkVerticalStep } from "@visx/shape";
import clsx from "clsx";
import _ from "lodash";
import React from "react";
import {
  TreeChartArrowDirection,
  TreeChartDirection,
  TreeChartLinkHighlightAnimationDirection,
  TreeChartNodeData,
} from ".";
import TreeChartArrow from "./arrow";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    "@keyframes dashLineAnimation": {
      "100%": {
        "stroke-dashoffset": 1000,
      },
    },
    "@keyframes reverseDashLineAnimation": {
      "100%": {
        "stroke-dashoffset": -1000,
      },
    },
    dashLineAnimation: {
      animation: "$dashLineAnimation 20s linear infinite reverse",
      strokeDasharray: 4,
      zIndex: 10,
    },
    reverseDashLineAnimation: {
      animation: "$reverseDashLineAnimation 20s linear infinite reverse",
      strokeDasharray: 4,
      zIndex: 10,
    },
  }),
);

interface TreeChartNodeProps extends React.SVGProps<SVGGElement> {
  link: HierarchyPointLink<TreeChartNodeData>;
  chartWidth: number;
  chartHeight: number;
  nodeWidth: number;
  nodeHeight: number;
  chartDirection?: TreeChartDirection;
  isHighlight?: boolean;
  showSourceArrow?: boolean;
  sourceArrowDirection?: TreeChartArrowDirection;
  showTargetArrow?: boolean;
  targetArrowDirection?: TreeChartArrowDirection;
  highlightAnimationDirection?: TreeChartLinkHighlightAnimationDirection;
}

const TreeChartLink: React.FunctionComponent<TreeChartNodeProps> = ({
  link,
  chartWidth,
  chartHeight,
  nodeWidth,
  nodeHeight,
  chartDirection = "right",
  isHighlight = false,
  showSourceArrow,
  sourceArrowDirection,
  showTargetArrow,
  targetArrowDirection,
  highlightAnimationDirection = "forward",
}) => {
  const classes = useStyles();
  // const InfoOffset = 15;

  function processLink(link: HierarchyPointLink<TreeChartNodeData>) {
    const newLink = _.clone(link);
    switch (chartDirection) {
      case "top":
        {
          const newSource = _.clone(link.source);
          newSource.x = link.source.x + nodeWidth / 2;
          newSource.y = chartWidth - link.source.y + nodeHeight / 2 + 2;
          const newTarget = _.clone(link.target);
          newTarget.x = link.target.x + nodeWidth / 2;
          newTarget.y = chartWidth - link.target.y + nodeHeight * 1.5 + 2;
          newLink.source = newSource;
          newLink.target = newTarget;
        }
        break;
      case "bottom":
        {
          const newSource = _.clone(link.source);
          newSource.x = link.source.x + nodeWidth / 2;
          newSource.y = link.source.y + nodeHeight;
          const newTarget = _.clone(link.target);
          newTarget.x = link.target.x + nodeWidth / 2;
          newTarget.y = link.target.y;
          newLink.source = newSource;
          newLink.target = newTarget;
        }
        break;
      case "right":
        {
          const newSource = _.clone(link.source);
          newSource.x = link.source.x + nodeHeight / 2;
          newSource.y = link.source.y + nodeWidth;
          const newTarget = _.clone(link.target);
          newTarget.x = link.target.x + nodeHeight / 2;
          newTarget.y = link.target.y;
          newLink.source = newSource;
          newLink.target = newTarget;
        }
        break;
      default:
        break;
    }
    return newLink;
  }

  const processedLink = processLink(link);

  function highlightLinkAnimationClass() {
    switch (highlightAnimationDirection) {
      case "backward":
        return classes.reverseDashLineAnimation;
      case "forward":
        return classes.dashLineAnimation;
    }
  }

  function linkComponent() {
    switch (chartDirection) {
      case "right":
        return (
          <LinkHorizontalStep
            className={clsx(isHighlight && highlightLinkAnimationClass())}
            data={processedLink}
            strokeWidth={1}
            stroke={isHighlight ? "#4F709B" : "#D8E0EB"}
            fill="none"
          />
        );
      case "top":
      case "bottom":
        return (
          <LinkVerticalStep
            className={clsx(isHighlight && highlightLinkAnimationClass())}
            data={processedLink}
            strokeWidth={1}
            stroke={isHighlight ? "#4F709B" : "#D8E0EB"}
            fill="none"
          />
        );
    }
  }

  function arrowComponent() {
    return (
      <>
        {showSourceArrow && (
          <TreeChartArrow
            key={`arrow-source-${processedLink.source.id}-${processedLink.target.id}`}
            type="source"
            link={processedLink}
            direction={sourceArrowDirection}
            chartDirection={chartDirection}
            nodeWidth={nodeWidth}
            nodeHeight={nodeHeight}
          />
        )}
        {showTargetArrow && (
          <TreeChartArrow
            key={`arrow-target-${processedLink.source.id}-${processedLink.target.id}`}
            type="target"
            link={processedLink}
            direction={targetArrowDirection}
            chartDirection={chartDirection}
            nodeWidth={nodeWidth}
            nodeHeight={nodeHeight}
          />
        )}
      </>
    );
  }

  return (
    <>
      {linkComponent()}
      {arrowComponent()}
    </>
  );
};

export default TreeChartLink;
