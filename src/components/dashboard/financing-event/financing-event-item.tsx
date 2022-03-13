import { Typography, Box, makeStyles, createStyles, Theme, ListItem, alpha } from "@material-ui/core";
import React from "react";
import EntityAvatar from "../../common/entity-avatar-next/entity-avatar";
import Tag from "../../common/tag";
import { FinancingModel } from "../../../models/dashboard/dashboard";
import { EventProperty, useClient } from "@momentum-valley/muse-js";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      display: "flex",
      alignItems: "start",
      padding: 20,
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
    headBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      marginBottom: 8,
    },
    titleBox: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.grey[800],
      marginRight: 10,
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
      marginBottom: 8,
    },
    time: {
      fontSize: 14,
      color: theme.palette.grey[500],
    },
    label: {
      color: "#448DB8",
    },
  }),
);

interface FinancingEventItemProps {
  data: FinancingModel;
}

const FinancingEventItem: React.FunctionComponent<FinancingEventItemProps> = props => {
  const classes = useStyles();
  const muse = useClient();
  const { data } = props;

  return (
    <ListItem
      button
      className={classes.item}
      onClick={() => {
        window.open(`/profile?id=${data.id}&type=${data.type}`);
        muse.sendTrackingEvent("dashboard.deals_item_click", {
          entity: EventProperty.entity({ id: data.id, type: data.type }),
        });
      }}
    >
      <Box style={{ marginRight: 12 }}>
        <EntityAvatar src={data.logo} className={classes.img} />
      </Box>
      <Box style={{ flex: 1 }}>
        <Box className={classes.headBox}>
          <Box className={classes.titleBox}>
            <Typography className={classes.title}>{data.name}</Typography>
            {data.tags && (
              <Tag
                label={data.tags}
                labelClass={classes.label}
                style={{ padding: "4px 10px", background: alpha("#80D0FF", 0.12) }}
              />
            )}
          </Box>
          <Typography className={classes.time}>{data.time}</Typography>
        </Box>
        <Typography className={classes.subtitle}>{data.introduction}</Typography>
      </Box>
    </ListItem>
  );
};

export default FinancingEventItem;
