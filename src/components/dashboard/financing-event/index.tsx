import { Box } from "@material-ui/core";
import { isArray } from "lodash";
import React, { useEffect, useState } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import ContentWrapper from "../wrapper/content-wrapper";
import { FinancingModel } from "../../../models/dashboard/dashboard";
import FinancingEventItem from "./financing-event-item";
import { isJSONString } from "../../../utils/tools";
import _ from "lodash";

const FinancingEvent: React.FunctionComponent = () => {
  const [financing, setFinancing] = useState<FinancingModel[]>([]);
  const [{ data, fetching }] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.latest_investment_and_financing_events_info",
      requestBody: JSON.stringify({
        limit: 5,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!data?.keyValueMap) return;
    const jsonString = _.get(data, ["keyValueMap", "data"]);

    const financing = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(financing)) return;
    const newFinancing = financing.map(e => FinancingModel.fromJSON(e));
    setFinancing(newFinancing);
  }, [data]);

  return (
    <ContentWrapper title="最新投融事件" url="/realm/pevc.event" fetching={fetching} length={financing.length}>
      {financing.length > 0 &&
        financing.map((item, index) => {
          return (
            <Box key={item.id}>
              <FinancingEventItem data={item} />
              {index < financing.length - 1 && <Box style={{ borderBottom: "1px solid #eee", margin: "0 20px" }} />}
            </Box>
          );
        })}
    </ContentWrapper>
  );
};

export default FinancingEvent;
