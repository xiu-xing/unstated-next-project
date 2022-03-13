import { Box } from "@material-ui/core";
import { isArray } from "lodash";
import React, { useState } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import { useEffect } from "react";
import { InstitutionModel } from "../../../models/dashboard/dashboard";
import InstitutionItem from "./institution-item";
import _ from "lodash";
import { isJSONString } from "../../../utils/tools";
import ContentWrapper from "../wrapper/content-wrapper";

const Institution: React.FunctionComponent = () => {
  const [institutions, setInstitutions] = useState<InstitutionModel[]>([]);
  const [{ data, fetching }] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.popular_investment_institutions_info",
      requestBody: JSON.stringify({
        limit: 5,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!data?.keyValueMap) return;
    const jsonString = _.get(data, ["keyValueMap", "data"]);

    const institutions = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(institutions)) return;
    const newInstitutions = institutions.map(e => InstitutionModel.fromJSON(e));
    setInstitutions(newInstitutions);
  }, [data]);

  return (
    <ContentWrapper title="热门投资机构" fetching={fetching} length={institutions.length}>
      {institutions.length > 0 &&
        institutions.map((item, index) => {
          return (
            <Box key={item.id}>
              <InstitutionItem data={item} />
              {index < institutions.length - 1 && <Box style={{ borderBottom: "1px solid #eee", margin: "0 20px" }} />}
            </Box>
          );
        })}
    </ContentWrapper>
  );
};

export default Institution;
