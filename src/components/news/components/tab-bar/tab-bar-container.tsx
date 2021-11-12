import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import {
  useSetMyNewsTagsMutation,
  NewsTopicItem,
  NewsTopicGroup,
  useMyNewsTagsQuery,
  useAllNewsTagsQuery,
} from "../../../../generated/graphql";

function useTabBar() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [allNewsTags, setAllNewsTags] = useState<NewsTopicGroup[]>([]);
  const [myNewsTags, setMyNewsTags] = useState<NewsTopicItem[]>([]);
  const [, execSetMyNewsTagsMutation] = useSetMyNewsTagsMutation();

  const [myNewsTagsResult, execMyNewsTagsQuery] = useMyNewsTagsQuery();
  const [allNewsTagsResult] = useAllNewsTagsQuery();

  useEffect(() => {
    const list = myNewsTagsResult?.data?.userNewsTopics.items;
    if (list && list?.length > 0) {
      setMyNewsTags(list);
    }
  }, [myNewsTagsResult]);

  useEffect(() => {
    const list = allNewsTagsResult?.data?.allNewsTopics.group;
    if (list && list?.length > 0) {
      setAllNewsTags(list);
    }
  }, [allNewsTagsResult]);

  return {
    allNewsTags,
    myNewsTags,
    submitLoading,
    setSubmitLoading,
    execMyNewsTagsQuery,
    execSetMyNewsTagsMutation,
  };
}

const TabBarContainer = createContainer(useTabBar);
export default TabBarContainer;
