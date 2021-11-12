import { Box, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { isArray } from "lodash";
import React, { useEffect, useState } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../../generated/graphql";
import Bottom from "../wrapper/bottom";
import { ChartsModel } from "../../../models/dashboard/dashboard";
import BlockCell from "./block-cell";
import Chart from "./chart";
import theme from "../../../theme";
import _ from "lodash";
import { isJSONString } from "../../../utils/tools";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      alignItems: "center",
      padding: "24px 0 30px 20px",
    },
    title: {
      fontSize: 18,
      fontWeight: 500,
      whiteSpace: "nowrap",
      color: theme.palette.grey[800],
    },
    date: {
      fontSize: 14,
      color: theme.palette.grey[500],
    },
    content: {
      padding: "0 20px",
    },
    chartBox: {
      display: "flex",
      justifyContent: "start",
    },
    blocks: {
      display: "flex",
      flexDirection: "column",
      marginRight: 9,
      "& > :not(:last-child)": {
        marginBottom: 10,
      },
    },
    charts: {
      width: "76%",
      border: "1px solid #eee",
      minWidth: 380,
    },
  }),
);

const Market: React.FunctionComponent = () => {
  const classes = useStyles();

  const [charts, setCharts] = useState<ChartsModel[]>([]);
  const [queryCharts] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.venture_capital_market_info",
      requestBody: JSON.stringify({
        number_of_months_in_review: 10,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!queryCharts.data?.keyValueMap) return;
    const jsonString = _.get(queryCharts, ["data", "keyValueMap", "data"]);

    const charts = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(charts)) return;
    const newCharts = charts.map(e => ChartsModel.fromJSON(e));
    setCharts(newCharts);
  }, [queryCharts]);

  return (
    <Box>
      <Box className={classes.header}>
        <Typography className={classes.title}>创投市场</Typography>
        {charts.length > 0 && (
          <Typography className={classes.date}>
            （ <span style={{ color: theme.palette.primary.main, fontWeight: 500 }}>{charts[0].date}</span> 月数据 ）
          </Typography>
        )}
      </Box>
      <Box className={classes.content}>
        {charts.length > 0 && (
          <Box className={classes.chartBox}>
            <Box className={classes.blocks}>
              <BlockCell count={charts[0].investment} percent={charts[0].investmentPercent} name="投资事件数" />
              <BlockCell count={charts[0].exit} percent={charts[0].exitPercent} name="退出事件数" />
              <BlockCell count={charts[0].IPO} percent={charts[0].IPOPercent} name="IPO 数" />
            </Box>
            <Box className={classes.charts}>
              <Chart data={charts} />
            </Box>
          </Box>
        )}
        {!charts.length && <Bottom fetching={queryCharts.fetching} length={charts.length} />}
      </Box>
    </Box>
  );
};

export default Market;
