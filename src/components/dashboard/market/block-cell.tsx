import { Box, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { Down, Up } from "../assets";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      padding: 20,
      border: "1px solid #eee",
      borderRadius: 2,
    },
    icon: {
      width: 62,
      height: 62,
      borderRadius: "50%",
      marginRight: 20,
      // border: "1px solid #587EB0",
    },
    count: {
      fontSize: 30,
      whiteSpace: "nowrap",
      fontWeight: "bold",
      color: theme.palette.grey[800],
      lineHeight: "30px",
      marginBottom: 10,
    },
    content: {
      width: 160,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    percent: {
      fontSize: 12,
      color: theme.palette.grey[600],
      whiteSpace: "nowrap",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
    },
    name: {
      fontSize: 16,
      color: theme.palette.grey[600],
    },
  }),
);

interface BlockCellProps {
  count: number;
  percent: string;
  name: string;
}

const BlockCell: React.FunctionComponent<BlockCellProps> = props => {
  const classes = useStyles();
  const { count, percent, name } = props;

  function content(percent: string): ReactNode {
    if (percent.startsWith("-"))
      return (
        <Typography className={classes.percent} style={{ color: "#78DCD2" }}>
          {percent}
          <Down />
        </Typography>
      );

    if (percent.startsWith("+"))
      return (
        <Typography className={classes.percent} style={{ color: "#F56540" }}>
          {percent}
          <Up />
        </Typography>
      );

    return <Typography className={classes.percent}>{percent}</Typography>;
  }

  return (
    <Box className={clsx(classes.root)}>
      {/* <Box className={classes.icon}></Box> */}
      <Box>
        <Typography className={classes.count}>{count}</Typography>
        <Box className={classes.content}>
          <Typography className={classes.name}>{name}</Typography>
          {content(percent)}
        </Box>
      </Box>
    </Box>
  );
};

export default BlockCell;
