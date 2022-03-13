import React from "react";
import { Box, Theme, Typography, Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Close, Plus } from "mdi-material-ui";
import { NewsTopicItem, NewsTopicGroup } from "../../../../../../generated/graphql";
import CategoryTags from "./category-tags";
import TabBarContainer from "../../tab-bar-container";
import DragWrapper from "./drag-wrapper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: 14,
      fontWeight: 500,
      color: "#333",
      padding: "16px 0 10px 0",
      marginLeft: 6,
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

interface AllNewsTagsClickParams extends Partial<NewsTopicItem> {
  isAdded: boolean;
}

interface DialogContentProps {
  myTags: NewsTopicItem[];
  removeFromMyTags: ({ id }: Partial<NewsTopicItem>) => void;
  addToMyTags: (params: Partial<NewsTopicItem>) => void;
  setMyTags: any;
}

const DialogContent: React.FC<DialogContentProps> = (props) => {
  const classes = useStyles();
  const { myTags, removeFromMyTags, addToMyTags, setMyTags } = props;
  const { allNewsTags, submitLoading } = TabBarContainer.useContainer();

  const handleAllTagsClick = (params: AllNewsTagsClickParams) => {
    const { isAdded, ...restParams } = params;
    if (isAdded) {
      removeFromMyTags({ id: restParams.id });
    } else {
      addToMyTags(restParams);
    }
  };

  const myTagsIdArr = myTags.map((v) => v.id);

  return (
    <Box maxHeight="500px">
      <Box>
        <Typography className={classes.title} style={{ paddingTop: 0 }}>
          我的分类
        </Typography>
        <DragWrapper
          list={myTags}
          handleChangeList={setMyTags}
          render={(tag: NewsTopicItem) => (
            <CategoryTags
              key={tag.id}
              {...tag}
              icon={<Close className={classes.closeIcon} style={{ ...(tag.lock ? { visibility: "hidden" } : {}) }} />}
              handleClick={removeFromMyTags}
              disabled={submitLoading || tag.lock}
              rootClassName={classes.myTagItem}
              iconButtonClassName={classes.closeIconClassName}
            />
          )}
        />
      </Box>
      {allNewsTags?.map((group: NewsTopicGroup) => (
        <Box key={group.name} mb="10px">
          <Typography className={classes.title}>{group.name}</Typography>
          <Grid container spacing={2} style={{ paddingLeft: 8 }}>
            {group?.items.map((tag: NewsTopicItem) => {
              const isAdded = myTagsIdArr.includes(tag.id);
              const icon = isAdded ? <Close className={classes.closeIcon} /> : <Plus className={classes.plusIcon} />;
              return (
                <Grid item key={tag.id} style={{ padding: "4px 6px", border: "1px solid #fff" }}>
                  <CategoryTags
                    {...tag}
                    icon={icon}
                    handleClick={(params: Partial<NewsTopicItem>) => handleAllTagsClick({ ...params, isAdded })}
                    disabled={submitLoading}
                    iconButtonClassName={isAdded ? classes.closeIconClassName : ""}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default DialogContent;
