import { Typography, Box, makeStyles, createStyles, Theme, ListItem } from "@material-ui/core";
import { useClient } from "@momentum-valley/muse-js";
import React from "react";
import { ReportModel } from "../../../models/dashboard/dashboard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      padding: 20,
      "&:hover": {
        background: "#F8FAFE",
      },
    },
    img: {
      width: 80,
      height: 100,
      objectFit: "cover",
      marginRight: 12,
      borderRadius: 2,
      userDrag: "none",
    },
    centerBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.grey[800],
      overflow: "hidden",
      textOverflow: "ellipsis",
      WebkitLineClamp: 1,
      WebkitBoxOrient: "vertical",
      textAlign: "start",
      display: "-webkit-box",
    },
    time: {
      fontSize: 14,
      color: theme.palette.grey[500],
      whiteSpace: "nowrap",
    },
    agency: {
      fontSize: 14,
      color: theme.palette.grey[500],
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: 300,
      color: theme.palette.grey[600],
      lineHeight: "22px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      textAlign: "start",
    },
  }),
);

interface ReportItemProps {
  data: ReportModel;
}
const ReportItem: React.FunctionComponent<ReportItemProps> = props => {
  const classes = useStyles();
  const { data } = props;
  const muse = useClient();

  return (
    <ListItem
      button
      className={classes.item}
      onClick={() => {
        window.open(`/viewer?id=${data.id}&url=${encodeURIComponent(data.uri)}`);
        muse.sendTrackingEvent("dashboard.article_item_click", { "article_id": data.id });
      }}
    >
      <img src={data.logo} alt="" className={classes.img} />
      <Box style={{ flex: 1 }}>
        <Box className={classes.centerBox}>
          <Typography className={classes.title}>{data.title}</Typography>
          <Typography className={classes.time}>{data.date}</Typography>
        </Box>
        <Typography className={classes.agency}>{data.agency}</Typography>
        <Typography className={classes.subtitle}>{data.summary}</Typography>
      </Box>
    </ListItem>
  );
};

export default ReportItem;
