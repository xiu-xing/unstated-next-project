import React from "react";
import { Box, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import BackTopFab from "../common/back-top-fab/back-top-fab";

import TabBar from "./components/tab-bar";
import TabContent from "./components/tab-content";
import Newsflash from "./components/newsflash";
import NewsContainer from "./container";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
    },
    leftSide: {
      flex: 1,
      minWidth: "600px",
    },
    rightSide: {
      width: "362px",
      minWidth: "362px",
      maxHeight: "calc(100vh - 168px)",
      position: "sticky",
      top: "116px",
    },
    headerBox: {
      position: "sticky",
      top: "48px",
      backgroundColor: "#fff",
      zIndex: 1,
      paddingRight: 64,
    },
    title: {
      fontSize: 20,
    },
    buttonIcon: {
      color: theme.palette.primary.main,
      fontSize: 24,
    },
  }),
);

const NewsDisplay: React.FC<{}> = () => {
  const classes = useStyles();
  const { isVerticalScroll } = NewsContainer.useContainer();

  return (
    <div className={classes.root} style={{ display: "flex", justifyContent: "center" }}>
      <Box width={"100%"} maxWidth={1332} style={{ display: "flex", justifyContent: "space-between" }}>
        <Box className={classes.leftSide}>
          <Box className={classes.headerBox}>
            <Box p="24px 0 10px 16px">
              <Typography noWrap className={classes.title}>
                新闻资讯
              </Typography>
            </Box>
            <TabBar />
          </Box>
          <TabContent />
        </Box>
        <Box className={classes.rightSide} style={!isVerticalScroll ? { position: "relative", top: "102px" } : {}}>
          <Newsflash />
        </Box>
        <BackTopFab />
      </Box>
    </div>
  );
};

const News: React.FC = () => {
  return (
    <NewsContainer.Provider>
      <NewsDisplay />
    </NewsContainer.Provider>
  );
};

export default News;
