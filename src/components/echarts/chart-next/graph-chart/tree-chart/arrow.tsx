import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Group } from "@visx/group";
import { HierarchyPointLink } from "@visx/hierarchy/lib/types";
import React from "react";
import { TreeChartArrowDirection, TreeChartDirection, TreeChartNodeData } from ".";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

interface TreeChartArrowProps {
  link: HierarchyPointLink<TreeChartNodeData>;
  type?: "target" | "source";
  direction?: TreeChartArrowDirection;
  chartDirection?: TreeChartDirection;
  nodeWidth: number;
  nodeHeight: number;
}

const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 9;

const TreeChartArrow: React.FunctionComponent<TreeChartArrowProps> = ({
  link,
  type = "target",
  direction = "right",
  chartDirection = "right",
  nodeWidth,
  nodeHeight,
}) => {
  const classes = useStyles();

  let left = 0;
  let top = 0;
  let rotate = 0;

  switch (direction) {
    case "top":
      rotate = 180;
      break;
    case "right":
      rotate = 270;
      break;
    case "bottom":
      rotate = 360;
      break;
    case "left":
      rotate = 90;
      break;
  }

  switch (type) {
    case "source":
      {
        switch (chartDirection) {
          case "right":
            {
              switch (direction) {
                case "top":
                  left = link.source.y + ARROW_HEIGHT;
                  top = link.source.x + ARROW_HEIGHT / 2;
                  break;
                case "right":
                  left = link.source.y;
                  top = link.source.x + ARROW_HEIGHT / 2;
                  break;
                case "bottom":
                  left = link.source.y;
                  top = link.source.x - ARROW_HEIGHT / 2;
                  break;
                case "left":
                  left = link.source.y + ARROW_HEIGHT;
                  top = link.source.x - ARROW_WIDTH / 2;
                  break;
              }
            }
            break;
          case "bottom":
            {
              switch (direction) {
                case "top":
                  left = link.source.x + ARROW_WIDTH / 2;
                  top = link.source.y + ARROW_HEIGHT;
                  break;
                case "right":
                  left = link.source.x - ARROW_HEIGHT / 2;
                  top = link.source.y + ARROW_WIDTH;
                  break;
                case "bottom":
                  left = link.source.x - ARROW_WIDTH / 2;
                  top = link.source.y;
                  break;
                case "left":
                  left = link.source.x + ARROW_HEIGHT / 2;
                  top = link.source.y;
                  break;
              }
            }
            break;
          case "top":
            {
              switch (direction) {
                case "top":
                  left = link.source.x + ARROW_WIDTH / 2;
                  top = link.source.y;
                  break;
                case "right":
                  left = link.source.x - ARROW_HEIGHT / 2;
                  top = link.source.y;
                  break;
                case "bottom":
                  left = link.source.x - ARROW_WIDTH / 2;
                  top = link.source.y - ARROW_HEIGHT;
                  break;
                case "left":
                  left = link.source.x + ARROW_HEIGHT / 2;
                  top = link.source.y - ARROW_HEIGHT;
                  break;
              }
            }
            break;
        }
      }
      break;
    case "target":
      {
        switch (chartDirection) {
          case "right":
            {
              switch (direction) {
                case "top":
                  left = link.target.y;
                  top = link.target.x + ARROW_WIDTH / 2;
                  break;
                case "right":
                  left = link.target.y - ARROW_HEIGHT;
                  top = link.target.x + ARROW_WIDTH / 2;
                  break;
                case "bottom":
                  left = link.target.y - ARROW_WIDTH;
                  top = link.target.x - ARROW_HEIGHT / 2;
                  break;
                case "left":
                  left = link.target.y;
                  top = link.target.x - ARROW_WIDTH / 2;
                  break;
              }
            }
            break;
          case "bottom":
            {
              switch (direction) {
                case "top":
                  left = link.target.x + ARROW_WIDTH / 2;
                  top = link.target.y;
                  break;
                case "right":
                  left = link.target.x - ARROW_HEIGHT / 2;
                  top = link.target.y;
                  break;
                case "bottom":
                  left = link.target.x - ARROW_WIDTH / 2;
                  top = link.target.y - ARROW_HEIGHT;
                  break;
                case "left":
                  left = link.target.x + ARROW_HEIGHT / 2;
                  top = link.target.y - ARROW_HEIGHT;
                  break;
              }
            }
            break;
          case "top":
            {
              switch (direction) {
                case "top":
                  left = link.target.x + ARROW_WIDTH / 2;
                  top = link.target.y + ARROW_HEIGHT;
                  break;
                case "right":
                  left = link.target.x - ARROW_HEIGHT / 2;
                  top = link.target.y + ARROW_HEIGHT;
                  break;
                case "bottom":
                  left = link.target.x - ARROW_WIDTH / 2;
                  top = link.target.y;
                  break;
                case "left":
                  left = link.target.x + ARROW_HEIGHT / 2;
                  top = link.target.y;
                  break;
              }
            }
            break;
        }
      }
      break;
  }

  return (
    <Group key={`arrow-group-${type}-${link.source.id}-${link.target.id}-${left}-${top}`} left={left} top={top}>
      <g
        style={{
          transform: `rotateZ(${rotate}deg)`,
        }}
      >
        <svg
          width={ARROW_WIDTH}
          height={ARROW_HEIGHT}
          viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.5 10L9 0H0z" fill="#4F709B" fillRule="evenodd" />
        </svg>
      </g>
    </Group>
  );
};

export default TreeChartArrow;
