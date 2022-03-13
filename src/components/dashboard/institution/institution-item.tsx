import { Typography, Box, makeStyles, createStyles, Theme, ListItem, alpha } from "@material-ui/core";
import React from "react";
import EntityAvatar from "../../common/entity-avatar-next/entity-avatar";
import Space from "../../common/space";
import Tag from "../../common/tag";
import { InstitutionModel } from "../../../models/dashboard/dashboard";
import { EventProperty, useClient } from "@momentum-valley/muse-js";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "start",
      padding: 20,
      "&:hover": {
        background: "#F8FAFE",
      },
    },
    img: {
      width: 38,
      height: 38,
      objectFit: "contain",
      borderRadius: 2,
      marginTop: 2,
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.grey[800],
      lineHeight: "20px",
    },
    countBox: {
      marginBottom: 10,
      fontSize: 14,
      color: theme.palette.grey[500],
    },
    count: {
      fontSize: 18,
      fontWeight: 800,
      color: theme.palette.primary.main,
    },
    subtitle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 1,
      WebkitBoxOrient: "vertical",
      textAlign: "start",
      marginBottom: 8,
      fontSize: 14,
      color: theme.palette.grey[600],
      fontWeight: 300,
    },
  }),
);

interface InstitutionItemProps {
  data: InstitutionModel;
}

const InstitutionItem: React.FunctionComponent<InstitutionItemProps> = props => {
  const classes = useStyles();
  const muse = useClient();
  const { data } = props;

  return (
    <ListItem
      button
      className={classes.root}
      onClick={() => {
        window.open(`/profile?id=${data.id}&type=${data.type}`);
        muse.sendTrackingEvent("dashboard.institution_item_click", {
          entity: EventProperty.entity({ id: data.id, type: data.type }),
        });
      }}
    >
      <Box style={{ marginRight: 12 }}>
        <EntityAvatar src={data.logo} className={classes.img} />
      </Box>
      <Box>
        <Typography className={classes.title}>{data.name}</Typography>
        <Typography className={classes.countBox}>
          近一年投资数&nbsp;&nbsp;<span className={classes.count}>{data.count}</span>
        </Typography>
        <Typography className={classes.subtitle}>{data.introduction}</Typography>
        <Space size={12} wrap>
          {data.types.length > 0 &&
            data.types.map((item, index) => (
              <Tag
                key={`${item}+${index}`}
                label={item as string}
                style={{
                  background: alpha("#88B3EB", 0.12),
                  padding: "4px 10px",
                  marginRight: -2,
                }}
              />
            ))}
        </Space>
      </Box>
    </ListItem>
  );
};

export default InstitutionItem;
