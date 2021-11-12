import { Box, createStyles, makeStyles } from "@material-ui/core";
import { useClient } from "@momentum-valley/muse-js";
import React, { useEffect } from "react";
import SimpleBar from "simplebar-react";
import FinancingEvent from "./financing-event";
import Industry from "./industry";
import Institution from "./institution";
import Market from "./market";
import NewsInfo from "./news-info";
import Report from "./report";
import Tabs from "./tabs";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      height: "calc(100vh - 48px)",
    },
    root: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 1500,
      margin: "auto",
      marginTop: 20,
    },
    left: {
      width: "74%",
      margin: "0 20px",
      minWidth: 630,
    },
    right: {
      width: "25.55%",
      marginRight: 20,
      minWidth: 260,
    },
    market: {
      border: "1px solid #DCDFE5",
      borderRadius: 2,
      marginBottom: 20,
    },
  }),
);

const Dashboard: React.FunctionComponent = () => {
  const classes = useStyles();
  const muse = useClient();

  useEffect(() => {
    // TODO: event tracking name
    setTimeout(() => {
      muse.sendTrackingEvent("dashboard.deal_event_read_more", {});
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className={classes.container}>
      <SimpleBar style={{ height: "100%" }}>
        <Box className={classes.root}>
          <Box className={classes.left}>
            <Box className={classes.market}>
              <Market />
              <Tabs />
            </Box>
            <FinancingEvent />
            <Report />
          </Box>
          <Box className={classes.right}>
            <NewsInfo />
            <Institution />
            <Industry />
          </Box>
        </Box>
      </SimpleBar>
    </Box>
  );
};

export default Dashboard;
