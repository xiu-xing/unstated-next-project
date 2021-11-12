import React from "react";
import { Box, Theme, Typography, Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { NewsTopicItem, NewsTopicGroup } from "../../../../../../generated/graphql";
import CategoryTags from "./category-tags";
import TabBarContainer from "../../tab-bar-container";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: 14,
      fontWeight: 500,
      color: "#333",
      padding: "16px 0 10px 4px",
    },
    plusIcon: {
      fontSize: 18,
      color: theme.palette.primary.main,
    },
    closeIcon: {
      fontSize: 16,
    },
    closeIconClassName: {
      padding: "5px !important",
    },
    myTagItem: {
      cursor: "move",
    },
  }),
);

interface DialogContentProps {
  myTags: NewsTopicItem[];
  handleSelect: (params: NewsTopicItem) => void;
}

const DialogSelect: React.FC<DialogContentProps> = (props) => {
  const classes = useStyles();
  const { myTags, handleSelect } = props;
  const { allNewsTags } = TabBarContainer.useContainer();

  return (
    <Box maxHeight="500px">
      <Box>
        <Typography className={classes.title} style={{ paddingTop: 0 }}>
          我的分类
        </Typography>
        <Grid container spacing={2}>
          {myTags?.map((tag: NewsTopicItem) => {
            return (
              <Grid item key={tag.id} style={{ padding: "4px 8px", border: "1px solid #fff" }}>
                <CategoryTags tag={tag} handleClick={(params: NewsTopicItem) => handleSelect(params)} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {allNewsTags?.map((group: NewsTopicGroup) => (
        <Box key={group.name} mb="10px">
          <Typography className={classes.title}>{group.name}</Typography>
          <Grid container spacing={2}>
            {group?.items.map((tag: NewsTopicItem) => {
              return (
                <Grid item key={tag.id} style={{ padding: "4px 8px", border: "1px solid #fff" }}>
                  <CategoryTags tag={tag} handleClick={(params: NewsTopicItem) => handleSelect(params)} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default DialogSelect;
