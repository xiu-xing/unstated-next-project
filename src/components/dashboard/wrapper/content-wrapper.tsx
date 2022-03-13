import { Box, makeStyles, createStyles } from "@material-ui/core";
import React from "react";
import Bottom from "./bottom";
import Header from "./header";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginBottom: 20,
      border: "1px solid #DCDFE5",
      borderRadius: 2,
    },
  }),
);

interface ContentWrapperProps {
  title: string;
  url?: string;
  fetching: boolean;
  length: number;
  className?: string;
}

const ContentWrapper: React.FunctionComponent<ContentWrapperProps> = props => {
  const classes = useStyles();
  const { title, url, fetching, length } = props;

  return (
    <Box className={props.className ?? classes.root}>
      <Header title={title} url={url} />
      {props.children}
      {!length && <Bottom fetching={fetching} length={length} />}
    </Box>
  );
};

export default ContentWrapper;
