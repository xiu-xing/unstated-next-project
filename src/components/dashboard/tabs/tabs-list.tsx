import { Box } from "@material-ui/core";
import { isArray } from "lodash";
import React, { useEffect, useState } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import Bottom from "../wrapper/bottom";
import { EnterpriseModel } from "../../../models/dashboard/dashboard";
import ContentItem from "./content-item";
import { isJSONString } from "../../../utils/tools";
import _ from "lodash";

interface TabsListProps {
  currentTabId: string;
  verticalId: string;
}

const TabsList: React.FunctionComponent<TabsListProps> = props => {
  const { currentTabId, verticalId } = props;

  const [contents, setContents] = useState<EnterpriseModel[]>([]);
  const [queryTabContent] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.venture_capital_market_industry_companies_info",
      requestBody: JSON.stringify({
        vertical_id: currentTabId,
        limit: 5,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!currentTabId) return;

    if (!queryTabContent.data?.keyValueMap) return;
    const jsonString = _.get(queryTabContent, ["data", "keyValueMap", "data"]);

    const contents = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(contents)) return;
    const newContents = contents.map(e => EnterpriseModel.fromJSON(e));
    setContents(newContents);
  }, [queryTabContent, currentTabId]);

  return (
    <div hidden={currentTabId !== verticalId}>
      {contents.length > 0 &&
        contents.map((item, index) => {
          return (
            <Box key={item.id}>
              <ContentItem data={item} />
              {index < contents.length - 1 && <Box style={{ borderBottom: "1px solid #eee", margin: "0 20px" }} />}
            </Box>
          );
        })}
      {!contents.length && <Bottom fetching={queryTabContent.fetching} length={contents.length} />}
    </div>
  );
};

export default TabsList;
