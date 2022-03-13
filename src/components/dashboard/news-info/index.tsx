import { Box } from "@material-ui/core";
import { isArray } from "lodash";
import React, { useEffect, useState } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import { NewsInfoModel } from "../../../models/dashboard/dashboard";
import NewsInfoItem from "./news-info-item";
import _ from "lodash";
import ContentWrapper from "../wrapper/content-wrapper";
import { isJSONString } from "../../../utils/tools";

const NewsInfo: React.FunctionComponent = () => {
  const [newsInfo, setNewsInfo] = useState<NewsInfoModel[]>([]);
  const [queryNews] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.news_information_info",
      requestBody: JSON.stringify({
        limit: 5,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!queryNews.data?.keyValueMap) return;
    const jsonString = _.get(queryNews, ["data", "keyValueMap", "data"]);

    const news = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(news)) return;
    const newNews = news.map(e => NewsInfoModel.fromJSON(e));
    setNewsInfo(newNews);
  }, [queryNews]);

  return (
    <ContentWrapper title="新闻资讯" url="/news" fetching={queryNews.fetching} length={newsInfo.length}>
      {newsInfo.length > 0 &&
        newsInfo.map((item, index) => {
          return (
            <Box key={item.id}>
              <NewsInfoItem data={item} />
              {index < newsInfo.length - 1 && <Box style={{ borderBottom: "1px solid #eee", margin: "0 20px" }} />}
            </Box>
          );
        })}
    </ContentWrapper>
  );
};

export default NewsInfo;
