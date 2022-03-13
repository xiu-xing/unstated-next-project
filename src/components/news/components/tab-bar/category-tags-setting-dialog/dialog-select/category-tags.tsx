import React from "react";
import { Box, Typography, Tooltip, IconButton, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { NewsTopicItem } from "../../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 80,
      border: "1px solid white",
      borderRadius: 2,
      "&:hover": {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
      },
    },
    label: {
      width: "66px",
      color: "#666",
      fontSize: "14px",
      cursor: "pointer",
      padding: 4,
      "-moz-user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select": "none",
      "-khtml-user-select": "none",
      "user-select": "none",
    },
  }),
);

interface CategoryTagsProps {
  tag: NewsTopicItem;
  handleClick: (params: NewsTopicItem) => void;
}

const CategoryTags: React.FC<CategoryTagsProps> = (props) => {
  const { tag, handleClick } = props;
  const classes = useStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      className={classes.root}
      onClick={() => {
        handleClick(tag);
      }}
    >
      <Tooltip title={tag.name}>
        <Typography noWrap className={classes.label}>
          {tag.name}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default CategoryTags;
