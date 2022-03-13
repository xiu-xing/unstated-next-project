import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { format, fromUnixTime } from "date-fns";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import LazyLoad from "react-lazyload";
import { useClient } from "urql";
import { useImmer } from "use-immer";
import { withAlphaHex } from "with-alpha-hex";
import {
  NewsThemeList,
  NewsThemeListItem,
  NewsListDocument,
  NewsListQuery,
  NewsListQueryVariables,
  Role,
} from "../../../../generated/graphql";
import { parseError } from "../../../../utils/error";
import { isAccessError } from "../../../../utils/errorHandler";
import UserContainer from "../../../../containers/userContainer";
import CommonAccordionPlaceholder from "../../../common/accordion/components/placeholder";
import SnackbarContainer from "../../../common/snackbar/snackbarContainer";

import NewsContainer from "../../container";
import NewsItem from "./news-item";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tag: {
      marginRight: 12,
      background: withAlphaHex(theme.palette.primary.main, 0.16),
      color: theme.palette.primary.main,
      fontSize: 10,
      display: "flex",
      alignItems: "center",
    },
    root: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      width: "100%",
      paddingBottom: "100px",
    },
    tipText: {
      width: "100%",
      fontSize: 16,
      fontWeight: 500,
      color: "#A6A6A6",
      display: "flex",
      justifyContent: "center",
      margin: 16,
    },
    loading: {
      height: 60,
      width: "100%",
      position: "absolute",
      left: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      display: "flex",
      justifyContent: "center",
      margin: 16,
    },
    loadingMoreText: {
      fontSize: 14,
      fontWeight: 400,
      cursor: "pointer",
    },
  }),
);

function isIncludes(oldArr: NewsThemeListItem[], newArr: NewsThemeListItem[]) {
  const oldIds = oldArr.map((item) => item.themeID);
  if (newArr.some((v) => oldIds.includes(v.themeID))) {
    return true;
  }
  return false;
}

const TabContent: React.FC = () => {
  const classes = useStyles();
  const { currentTag, setIsVerticalScroll } = NewsContainer.useContainer();
  const [newsData, setNewsData] = useImmer<NewsThemeListItem[]>([]);
  const [after, setAfter] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState(false);
  const [fetching, setFetching] = useState(false);
  const client = useClient();
  const { openSnackbar } = SnackbarContainer.useContainer();
  const { user, setTrailServiceDialogOpen, setInstitutionAuthenticationDialog, setActiveServiceDialogOpen } =
    UserContainer.useContainer();
  function executeNewsDataQuery(isLoadMore: boolean, tags?: string): void {
    if (!isLoadMore) {
      window.scrollTo(0, 0);
    }
    setFetching(true);
    client
      .query<NewsListQuery, NewsListQueryVariables>(NewsListDocument, {
        first: 8,
        after: isLoadMore ? after : undefined,
        topicID: tags || currentTag,
      })
      .toPromise()
      .then((result) => {
        const errorRes = parseError(result.error);
        if (isAccessError(errorRes.code)) {
          openSnackbar(errorRes.message, "error");
          if (user?.role == Role.IndividualFree || user?.role == Role.IndividualPremium) {
            setInstitutionAuthenticationDialog(true);
          }
          if (user?.role == Role.Basic) {
            setTrailServiceDialogOpen(true);
          }
          if (user?.role == Role.Expired) {
            setActiveServiceDialogOpen(true);
          }
        }
        const { nodes, pageInfo } = result.data?.newsThemeList as NewsThemeList;
        if (!isLoadMore) {
          setNewsData(() => {
            return (nodes as NewsThemeListItem[]) ?? [];
          });
        } else {
          setNewsData((draft) => {
            if (nodes && nodes.length > 0 && !isIncludes(draft, nodes as NewsThemeListItem[])) {
              draft.push(...(nodes as NewsThemeListItem[]));
            }
          });
        }
        if (pageInfo) {
          setAfter(pageInfo.endCursor as string);
          setHasNextPage(Boolean(pageInfo.hasNextPage));
        }
        if (document.body.scrollHeight - document.body.clientHeight > 0) {
          setIsVerticalScroll(true);
        } else {
          setIsVerticalScroll(false);
        }
      })
      .catch(() => {})
      .finally(() => {
        setFetching(false);
      });
  }

  function loadingMore(): void {
    if (fetching || !hasNextPage) {
      return;
    }
    executeNewsDataQuery(true);
  }

  useBottomScrollListener(loadingMore, 100, 0);

  useEffect(() => {
    executeNewsDataQuery(false, currentTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTag]);

  return (
    <div style={{ position: "relative", marginRight: 64 }}>
      <div className={classes.root}>
        {!fetching && newsData.length < 1 ? (
          <Box pt="100px">
            <CommonAccordionPlaceholder />
          </Box>
        ) : null}
        {newsData &&
          newsData?.length > 0 &&
          newsData.map((item) => {
            const formatDate = item?.publishedAt
              ? format(fromUnixTime(Number(item?.publishedAt)), "yyyy-MM-dd HH:mm:ss")
              : "";
            return (
              <Box key={item.themeID as string} style={{ marginBottom: "4px" }}>
                <NewsItem
                  id={item.themeID as string}
                  title={item.title}
                  imgSrc={item.imageUri}
                  content={item.abstract}
                  publishedTime={formatDate}
                  tags={item.tag as string[]}
                  classes={{
                    tag: classes.tag,
                  }}
                />
              </Box>
            );
          })}
        {!fetching && !hasNextPage && newsData.length > 0 ? (
          <Typography className={classes.tipText}>滑到底啦！</Typography>
        ) : null}
      </div>
      {!fetching && hasNextPage && newsData.length > 0 ? (
        <Typography
          className={clsx(classes.loadingText, classes.loadingMoreText)}
          color="primary"
          onClick={loadingMore}
        >
          点击加载更多
        </Typography>
      ) : null}
      {fetching ? (
        <div className={classes.loading}>
          <CircularProgress size={30} />
        </div>
      ) : null}
    </div>
  );
};

export default TabContent;
