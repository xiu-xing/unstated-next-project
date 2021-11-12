import { Box, createStyles, makeStyles } from "@material-ui/core";
import { isArray } from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import { ReportModel } from "../../../models/dashboard/dashboard";
import ReportItem from "./report-item";
import { isJSONString } from "../../../utils/tools";
import _ from "lodash";
import ContentWrapper from "../wrapper/content-wrapper";

const useStyles = makeStyles(() =>
  createStyles({
    report: {
      marginBottom: 10,
      border: "1px solid #DCDFE5",
      borderRadius: 2,
      paddingBottom: 14,
    },
  }),
);

const Report: React.FunctionComponent = () => {
  const classes = useStyles();

  const [reports, setReports] = useState<ReportModel[]>([]);
  const [queryReports] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.research_reports_info",
      requestBody: JSON.stringify({
        limit: 5,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!queryReports.data?.keyValueMap) return;
    const jsonString = _.get(queryReports, ["data", "keyValueMap", "data"]);

    const reports = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(reports)) return;
    const newReports = reports.map(e => ReportModel.fromJSON(e));
    setReports(newReports);
  }, [queryReports]);

  return (
    <ContentWrapper
      className={classes.report}
      title="研究报告"
      url="/article/research.research_report"
      fetching={queryReports.fetching}
      length={reports.length}
    >
      {reports.length > 0 &&
        reports.map((item, index) => {
          return (
            <Box key={item.id}>
              <ReportItem data={item} />
              {index < reports.length - 1 && <Box style={{ borderBottom: "1px solid #eee", margin: "0 20px" }} />}
            </Box>
          );
        })}
    </ContentWrapper>
  );
};

export default Report;
