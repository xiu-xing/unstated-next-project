import { Box, createStyles, ListItem, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import EntityAvatar from "../../common/entity-avatar-next/entity-avatar";
import { EnterpriseModel } from "../../../models/dashboard/dashboard";
import { EventProperty, useClient } from "@momentum-valley/muse-js";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      padding: 20,
      display: "flex",
      alignItems: "start",
      "&:hover": {
        background: "#F8FAFE",
      },
    },
    img: {
      height: 38,
      width: 38,
      borderRadius: 2,
      marginTop: 4,
      objectFit: "contain",
    },
    content: {
      width: "100%",
    },
    headBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.grey[800],
      lineHeight: "24px",
    },
    time: {
      fontSize: 14,
      color: theme.palette.grey[500],
    },
    subTitle: {
      fontSize: 14,
      color: theme.palette.grey[800],
      marginBottom: 10,
    },
    introduction: {
      fontSize: 14,
      fontWeight: 300,
      color: theme.palette.grey[600],
      marginRight: 40,
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 1,
      WebkitBoxOrient: "vertical",
      textAlign: "start",
    },
  }),
);

interface ContentItemProps {
  data: EnterpriseModel;
}

const ContentItem: React.FunctionComponent<ContentItemProps> = props => {
  const classes = useStyles();
  const muse = useClient();

  const { data } = props;

  function content() {
    if (data.stage && data.size) return `${data.stage} | 交易金额${data.size}`;

    if (data.stage) return data.stage;

    if (data.size) return `交易金额${data.size}`;
  }

  return (
    <ListItem
      button
      className={classes.item}
      onClick={() => {
        window.open(`/profile?id=${data.id}&type=${data.type}`);
        muse.sendTrackingEvent("dashboard.market_item_click", {
          entity: EventProperty.entity({ id: data.id, type: data.type }),
        });
      }}
    >
      <Box style={{ marginRight: 12 }}>
        <EntityAvatar src={data.logo} className={classes.img} />
      </Box>
      <Box className={classes.content}>
        <Box className={classes.headBox}>
          <Typography className={classes.title}>{data.name}</Typography>
          <Typography className={classes.time}>{data.date}</Typography>
        </Box>
        <Typography className={classes.subTitle}>{content()}</Typography>
        <Typography className={classes.introduction}>{data.introduction}</Typography>
      </Box>
    </ListItem>
  );
};

export default ContentItem;
