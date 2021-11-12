import { Box, CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import React, { ReactNode } from "react";
import NoData from "./no-data";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      padding: "10px 0",
      minHeight: 200,
    },
    img: {
      width: "50%",
      maxWidth: 300,
      objectFit: "contain",
      pointerEvents: "none",
    },
  }),
);

interface BottomProps {
  fetching: boolean;
  length: number;
}

const Bottom: React.FunctionComponent<BottomProps> = props => {
  const classes = useStyles();
  const { fetching, length } = props;

  function content(): ReactNode {
    if (fetching)
      return (
        <Box style={{ textAlign: "center", paddingTop: 20 }}>
          <CircularProgress color="primary" thickness={2.8} size={30} />
        </Box>
      );

    if (!fetching && length < 1) return <NoData imgClasses={classes.img} tip="暂无数据" />;
  }

  return <Box className={classes.root}>{content()}</Box>;
};

export default Bottom;
