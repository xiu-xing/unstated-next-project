import React from "react";
import { Box, Typography, Tooltip, IconButton } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { NewsTopicItem } from "../../../../../../generated/graphql";

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      width: "58px",
      color: "#666",
      fontSize: "14px",
      "-moz-user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select": "none",
      "-khtml-user-select": "none",
      "user-select": "none",
    },
    iconBtn: {
      padding: "4px",
    },
  }),
);

interface CategoryTagsProps {
  name: string;
  id: string;
  lock: boolean;
  icon: React.ReactNode;
  handleClick: (params: Partial<NewsTopicItem>) => void;
  disabled?: boolean;
  rootClassName?: string;
  iconButtonClassName?: string;
}

const CategoryTags: React.FC<CategoryTagsProps> = (props) => {
  const { name, id, lock, icon, disabled = false, handleClick, rootClassName, iconButtonClassName } = props;
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center" className={clsx(rootClassName ?? "", "tag")}>
      <Tooltip title={name}>
        <Typography noWrap className={classes.label}>
          {name}
        </Typography>
      </Tooltip>
      <IconButton
        className={clsx(classes.iconBtn, iconButtonClassName ?? "")}
        disabled={disabled}
        onClick={() => handleClick({ id, name, lock })}
      >
        {icon}
      </IconButton>
    </Box>
  );
};

export default CategoryTags;
