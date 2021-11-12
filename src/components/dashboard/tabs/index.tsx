import React, { ReactNode, useEffect, useState } from "react";
import { Box, createStyles, makeStyles, Theme, withStyles } from "@material-ui/core";
import MuiTab from "@material-ui/core/Tab";
import { TabContext, TabList } from "@material-ui/lab";
import { isArray } from "lodash";
import { VerticalModel } from "../../../models/dashboard/dashboard";
import TabsList from "./tabs-list";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import _ from "lodash";
import { isJSONString } from "../../../utils/tools";

const StyledTabList = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      borderBottom: "1px solid #EEE",
      background: "white",
      paddingLeft: "16px",
      minHeight: 40,
      "& .MuiTabs-flexContainer": {
        "& button:not(:last-child)": {
          marginRight: 32,
        },
      },
      "& .MuiTabs-scrollButtons": {
        display: "none",
      },
    },
    indicator: {
      height: 3,
      backgroundColor: theme.palette.primary.main,
    },
  }),
)(TabList);

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 70,
      minHeight: 40,
      maxWidth: "100%",
      lineHeight: 1.72,
      textTransform: "none",
      overflow: "visible",
      borderBottom: "3px solid white",
      "&:hover": {
        color: theme.palette.grey[600],
        borderBottom: `3px solid ${theme.palette.primary.main}`,
      },
    },
    textColorInherit: {
      color: "#999",
      opacity: 1,
    },
    selected: {
      color: theme.palette.primary.main,
    },
  }),
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
      marginTop: 24,
    },
    root: {
      display: "inline-flex",
      alignItems: "center",
    },
  }),
);

const Tabs: React.FunctionComponent = () => {
  const classes = useStyles();

  const [tabs, setTabs] = useState<VerticalModel[]>([]);
  const [currentTabId, setCurrentTabId] = useState<string>("");

  const [queryTabs] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.venture_capital_market_vertical_info",
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!queryTabs.data?.keyValueMap) return;
    const jsonString = _.get(queryTabs, ["data", "keyValueMap", "data"]);

    const tabs = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(tabs)) return;
    const newTabs = tabs.map(e => VerticalModel.fromJSON(e));
    setTabs(newTabs);

    if (newTabs.length > 0) {
      setCurrentTabId(newTabs[0].id);
    }
  }, [queryTabs]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string): void | Promise<void> => {
    setCurrentTabId(newValue);
  };

  function content(id: string): ReactNode {
    return (
      <Box style={{ width: "100%" }}>
        {tabs.length > 0 &&
          tabs.map(tab => {
            return <TabsList key={tab.id} currentTabId={id} verticalId={tab.id} />;
          })}
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <TabContext value={currentTabId}>
        <Box className={classes.tabList}>
          <StyledTabList onChange={handleTabChange} scrollButtons="auto" variant="scrollable">
            {tabs.map(tab => (
              <StyledTab key={tab.id} value={tab.id} label={tab.name} />
            ))}
          </StyledTabList>
        </Box>
        {content(currentTabId)}
      </TabContext>
    </Box>
  );
};

export default Tabs;
