import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Collapse, createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import clsx from "clsx";
import { cloneDeep } from "lodash";
import { MenuDown, MenuUp } from "mdi-material-ui";

import { NewsTopicItem } from "../../../../generated/graphql";
import NewsContainer from "../../container";
import TabBarContainer from "./tab-bar-container";
import CategoryTagsSettingDialog from "./category-tags-setting-dialog";
import Classify from "../../../../icons/Classify";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagsRoot: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "0 8px 6px 16px",
    },
    tagButton: {
      width: "89px",
      maxWidth: "89px",
      fontSize: "14px",
      fontWeight: 400,
      padding: "4px 8px",
      boxShadow: "none",
      borderRadius: "2px",
      margin: "0 12px 8px 0",
    },
    tagText: {
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      boxShadow: "none",
    },
    activeButton: {
      background: theme.palette.primary.main,
      "&:hover": {
        background: theme.palette.primary.main,
      },
    },
    iconButton: {
      padding: "8px",
    },
  }),
);

const ONE_TAG_SPACE = 101;

const TabBarDisplay: React.FunctionComponent = () => {
  const classes = useStyles();
  const tagsRootRef = useRef<HTMLDivElement | null>(null);
  const { currentTag, setCurrentTag } = NewsContainer.useContainer();
  const { myNewsTags } = TabBarContainer.useContainer();
  const [collapse, setCollapse] = useState<boolean>(false);
  const [tagSettingDialogOpen, setTagSettingDialogOpen] = useState(false);
  const [tabBarTags, setTabBarTags] = useState(myNewsTags);

  useEffect(() => {
    setTabBarTags(myNewsTags);
    if (myNewsTags.length > 0 && myNewsTags[0].id) {
      setCurrentTag(myNewsTags[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myNewsTags]);

  useEffect(() => {
    if (collapse) {
      setCollapse(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTag]);

  function getFirstRowTagsCount() {
    const containerWidth = tagsRootRef.current?.offsetWidth! as number;
    return Math.floor(containerWidth / ONE_TAG_SPACE);
  }

  function handleTagClick(id: string, index: number) {
    const firstRowSubElementCount = getFirstRowTagsCount();
    // clicked tag is not in first row
    if (index + 1 > firstRowSubElementCount) {
      const newTabBarTags: NewsTopicItem[] = cloneDeep(tabBarTags);
      // switch clicked tag to first row last tag
      newTabBarTags[index] = newTabBarTags.splice(firstRowSubElementCount - 1, 1, newTabBarTags[index])[0];
      setTabBarTags(newTabBarTags);
    }
    setCurrentTag(id);
  }

  function handleSelectTag(params: NewsTopicItem) {
    let index: number = 0;
    const flag: boolean = tabBarTags.some((t, i) => {
      index = i;
      return t.name == params.name;
    });
    if (flag) {
      handleTagClick(params.id ?? "", index);
    }
    if (!flag) {
      setCurrentTag(params.id);
      const firstRowSubElementCount = getFirstRowTagsCount();
      const newTabBarTags: NewsTopicItem[] = cloneDeep(tabBarTags);
      if (firstRowSubElementCount == 1) {
        newTabBarTags.splice(firstRowSubElementCount, 0, params);
        setTabBarTags(newTabBarTags);
        return;
      }

      newTabBarTags.splice(firstRowSubElementCount - 1, 0, params);
      setTabBarTags(newTabBarTags);
    }
  }

  return (
    <div className={classes.tagsRoot}>
      <Collapse in={collapse} collapsedSize={40} ref={tagsRootRef}>
        {tabBarTags.map((tag, index) => (
          <Button
            className={clsx(classes.tagButton, currentTag === tag.id && classes.activeButton)}
            key={index}
            variant={currentTag === tag.id ? "contained" : undefined}
            color={currentTag === tag.id ? "primary" : undefined}
            onClick={(): void => {
              handleTagClick(tag.id ?? "", index);
            }}
          >
            <span className={classes.tagText}>{tag.name}</span>
          </Button>
        ))}
      </Collapse>
      <Box display="flex" mt="-4px">
        <IconButton
          className={classes.iconButton}
          onClick={(): void => {
            setCollapse((old) => !old);
          }}
        >
          {collapse ? <MenuUp /> : <MenuDown />}
        </IconButton>
        <IconButton onClick={() => setTagSettingDialogOpen(true)} className={classes.iconButton}>
          <Classify style={{ height: 16 }} />
        </IconButton>
      </Box>
      <CategoryTagsSettingDialog
        open={tagSettingDialogOpen}
        handleModalClose={() => setTagSettingDialogOpen(false)}
        handleSelectTag={(params) => {
          handleSelectTag(params);
        }}
      />
    </div>
  );
};

const TabBar = () => {
  return (
    <TabBarContainer.Provider>
      <TabBarDisplay />
    </TabBarContainer.Provider>
  );
};

export default TabBar;
