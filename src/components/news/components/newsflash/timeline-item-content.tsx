import React from "react";
import { Theme, Typography, makeStyles, ListItem, Box } from "@material-ui/core";
import TimeAgo from "timeago-react";
import { format, fromUnixTime } from "date-fns";
import clsx from "clsx";

import { NewsThemeListItem } from "../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 0,
  },
  publishedTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  title: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    WebkitLineClamp: 2,
    color: "#333333",
    fontWeight: 500,
    lineHeight: "24px",
    fontSize: 14,
    marginBottom: 4,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  subtitle: {
    color: "#666666",
    lineHeight: "20px",
    fontSize: 14,
    WebkitLineClamp: 3,
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    display: "-webkit-box",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
  },
}));

const TimelineItemContent: React.FC<NewsThemeListItem> = (props) => {
  const { themeID, publishedAt, title, abstract } = props;
  const classes = useStyles();
  const formatDate = format(fromUnixTime(Number(publishedAt)), "yyyy-MM-dd HH:mm:ss");

  return (
    <Box className={classes.root}>
      {publishedAt && <TimeAgo datetime={formatDate} className={classes.publishedTime} locale="zh_CN" />}
      <Typography
        className={clsx(classes.title, "title")}
        onClick={() => {
          window.open(`/news-detail?themeID=${themeID}`);
        }}
      >
        {title}
      </Typography>
      <Typography className={classes.subtitle}>{abstract}</Typography>
    </Box>
  );
};

export default TimelineItemContent;
