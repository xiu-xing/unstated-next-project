import { Box, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { useClient } from "@momentum-valley/muse-js";
import { ChevronRight } from "mdi-material-ui";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100%",
      padding: "20px 10px 4px 20px",
    },
    title: {
      fontSize: 18,
      fontWeight: 500,
      whiteSpace: "nowrap",
      color: theme.palette.grey[800],
    },
    more: {
      display: "flex",
      justifyContent: "start",
      alignItems: "center",
      fontSize: 14,
      color: theme.palette.grey[500],
      cursor: "pointer",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  }),
);

interface HeaderProps {
  title: string;
  url?: string;
}

const Header: React.FunctionComponent<HeaderProps> = props => {
  const classes = useStyles();
  const muse = useClient();

  const { title, url } = props;

  return (
    <Box className={classes.header}>
      <Typography className={classes.title}>{title}</Typography>
      {url && (
        <Box
          className={classes.more}
          onClick={() => {
            window.open(url);
            muse.sendTrackingEvent("dashboard.read_more", { "modules_name": title, "url": url });
          }}
        >
          <Typography style={{ whiteSpace: "nowrap", fontSize: 14 }}>查看更多</Typography>
          <ChevronRight fontSize={"small"} />
        </Box>
      )}
    </Box>
  );
};

export default Header;
