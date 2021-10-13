import React, { ReactNode, useState } from "react";
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core";
import MuiTab from "@material-ui/core/Tab";
import { TabContext, TabList } from "@material-ui/lab";
import { useCurrentTabId } from "./atom";
import TabResult from "./components/tab-result";

const StyledTabList = withStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "sticky",
      maxWidth: 1316,
      width: "100%",
      zIndex: 999,
      top: 0,
      borderBottom: "1px solid #EEE",
      background: "white",
      paddingTop: "24px",
      paddingLeft: "16px",
      minHeight: 40,
      "& .MuiTabs-flexContainer": {
        "& button:not(:last-child)": {
          marginRight: 32,
        },
      },
    },
    indicator: {
      height: 3,
      backgroundColor: theme.palette.primary.main,
    },
  })
)(TabList);

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      minWidth: 70,
      minHeight: 40,
      padding: "10px 4px",
      lineHeight: 1.72,
      textTransform: "none",
      overflow: "visible",
    },
    textColorInherit: {
      color: "#999",
      opacity: 1,
    },
    selected: {
      color: theme.palette.primary.main,
    },
  })
)(MuiTab);

const useStyles = makeStyles(() =>
  createStyles({
    tabList: {
      width: "100%",
      justifyContent: "center",
      padding: "0px 24px",
      display: "flex",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    root: {
      display: "inline-flex",
      alignItems: "center",
    },
  })
);

const tabs: string[] = ["开发", "设计", "产品"];

const Tabs: React.FunctionComponent = () => {
  const classes = useStyles();

  const [currentTabId, setCurrentTabId] = useCurrentTabId();

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newValue: string
  ): void | Promise<void> => {
    setCurrentTabId(newValue);
  };

  function tabLabel(title: string): ReactNode {
    return <span className={classes.root}>{title}</span>;
  }

  function content(type: string): ReactNode {
    return <TabResult type={type} />;
  }

  return (
    <Box className={classes.container}>
      <TabContext value={currentTabId}>
        <Box className={classes.tabList}>
          <StyledTabList
            onChange={handleTabChange}
            scrollButtons="auto"
            variant="scrollable"
          >
            {tabs.map((tab, i) => (
              <StyledTab
                key={tab + i}
                value={i.toString()}
                label={tabLabel(tab)}
              />
            ))}
          </StyledTabList>
        </Box>
        {content(currentTabId)}
      </TabContext>
    </Box>
  );
};

export default Tabs;
