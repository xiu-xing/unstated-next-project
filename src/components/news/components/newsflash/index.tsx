import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useClient } from "urql";
import { useImmer } from "use-immer";

import CommonAccordionPlaceholder from "../../../common/accordion/components/placeholder";
import CommonTimeline from "../../../common/timeline";
import {
  NewsThemeList,
  NewsThemeListItem,
  NewsListQuery,
  NewsListQueryVariables,
  NewsListDocument,
} from "../../../../generated/graphql";
import TimelineItemContent from "./timeline-item-content";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
    titleBox: {
      display: "flex",
      paddingBottom: "20px",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
    },
    listBox: {
      maxHeight: "calc(100vh - 245px)",
      overflowY: "auto",
      paddingRight: "15px",
      position: "relative",
      "&:after": {
        content: `""`,
        width: "100%",
        height: "80px",
        display: "block",
        position: "absolute",
        bottom: 0,
        left: "15px",
        background: "linear-gradient(to bottom, rgb(255 255  255/ 5%), rgb(255 255 255 / 50%), rgb(255 255 255 / 1))",
      },
    },
    loading: {
      height: 100,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }),
);

export interface Item {
  id: string;
  name: string;
  time: string;
  title: string;
  publishTime?: number;
  abstract?: string;
  content?: string;
}

const Newsflash: React.FC<{}> = () => {
  const classes = useStyles();
  const [newsflashList, setNewsflashList] = useImmer<NewsThemeListItem[]>([]);
  const [after, setAfter] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState(false);
  const [fetching, setFetching] = useState(false);
  const client = useClient();
  const ref = useRef<OverlayScrollbarsComponent | null>(null);

  function executeNewsflashListQuery(isLoadMore?: boolean) {
    setFetching(true);
    client
      .query<NewsListQuery, NewsListQueryVariables>(NewsListDocument, {
        first: 8,
        after,
        // topicID: "",
      })
      .toPromise()
      .then((result) => {
        const { nodes, pageInfo } = result.data?.newsThemeList as NewsThemeList;
        if (!isLoadMore) {
          setNewsflashList(() => {
            return (nodes as NewsThemeListItem[]) ?? [];
          });
        } else {
          setNewsflashList((draft) => {
            if (nodes && nodes.length > 0) {
              draft.push(...(nodes as NewsThemeListItem[]));
            }
          });
        }
        if (pageInfo) {
          setAfter(pageInfo.endCursor as string);
          setHasNextPage(Boolean(pageInfo.hasNextPage));
        }
      })
      .catch(() => {})
      .finally(() => {
        setFetching(false);
      });
  }

  useEffect(() => {
    executeNewsflashListQuery();
  }, []);

  function loadingMore(): void {
    if (fetching || !hasNextPage) {
      return;
    }
    executeNewsflashListQuery(true);
  }

  function handleScroll() {
    if (ref.current?.osInstance()?.scroll().ratio.y === 1) {
      loadingMore();
    }
  }

  return (
    <div className={classes.root}>
      <Box className={classes.titleBox}>
        <Typography noWrap className={classes.title}>
          快讯
        </Typography>
      </Box>
      {!fetching && newsflashList.length < 1 ? <CommonAccordionPlaceholder /> : null}
      <OverlayScrollbarsComponent
        className={classes.listBox}
        ref={ref}
        options={{
          overflowBehavior: {
            x: "hidden",
            y: "scroll",
          },
          scrollbars: {
            autoHide: "m",
          },
          callbacks: {
            onScroll: handleScroll,
          },
        }}
      >
        <CommonTimeline data={newsflashList} render={(item: any) => <TimelineItemContent {...item} />} />
        {fetching && (
          <div className={classes.loading}>
            <CircularProgress size={30} />
          </div>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default Newsflash;
