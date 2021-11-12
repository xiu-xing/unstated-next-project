import { alpha, Box, createStyles, ListItem, makeStyles, Theme, Typography } from "@material-ui/core";
import { format } from "date-fns";
import React from "react";
import TimeAgo from "timeago-react";
import Space from "../../common/space";
import Tag from "../../common/tag";
import { NewsInfoModel } from "../../../models/dashboard/dashboard";
import { useClient } from "@momentum-valley/muse-js";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      padding: "16px 20px 20px 20px",
      "&:hover": {
        background: "#F8FAFE",
      },
    },
    head: {
      display: "flex",
      alignItems: "center",
      marginBottom: 10,
    },
    time: {
      fontSize: 14,
      color: theme.palette.grey[500],
      marginRight: 16,
    },
    tag: {
      fontSize: 14,
      color: theme.palette.grey[600],
      lineHeight: "24px",
    },
    title: {
      fontSize: 14,
      color: theme.palette.grey[800],
      marginBottom: 8,
      lineHeight: "22px",
      fontWeight: 500,
    },
  }),
);

interface NewsInfoItemProps {
  data: NewsInfoModel;
}

const NewsInfoItem: React.FunctionComponent<NewsInfoItemProps> = props => {
  const classes = useStyles();
  const { data } = props;
  const muse = useClient();

  return (
    <ListItem
      button
      className={classes.item}
      onClick={() => {
        window.open(`/news-detail?themeID=${data.id}`);
        muse.sendTrackingEvent("dashboard.news_item_click", { "theme_id": data.id });
      }}
    >
      <Box className={classes.head}>
        <TimeAgo
          className={classes.time}
          datetime={format(new Date(data.time), "yyyy-MM-dd HH:mm:ss")}
          locale="zh_CN"
        />
        <Typography className={classes.tag}>{data.tag}</Typography>
      </Box>
      <Typography className={classes.title}>{data.title}</Typography>
      <Space size={12} wrap>
        {data.concepts.map((item, index) => (
          <Tag
            key={`${item}+${index}`}
            label={item as string}
            style={{ background: alpha("#88B3EB", 0.12), padding: "4px 10px", marginRight: -2 }}
          />
        ))}
      </Space>
    </ListItem>
  );
};

export default NewsInfoItem;
