import { createStyles, makeStyles, Theme, Tooltip, Typography } from "@material-ui/core";
import { isArray } from "lodash";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";
import React, { ReactNode, useEffect, useState } from "react";
import { NextPlatform, useKeyValueMapQuery } from "../../generated/graphql";
import { One, Three, Two } from "./assets";
import { isJSONString } from "../../utils/tools";
import _ from "lodash";
import { EventProperty, useClient } from "@momentum-valley/muse-js";
import ContentWrapper from "./wrapper/content-wrapper";
import { IndustryModel } from "../../models/dashboard/dashboard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      padding: "20px 20px 20px 0",
      width: "100%",
      "& tr": {
        height: 40,
      },
    },
    header: {
      "& th": {
        color: theme.palette.grey[600],
        fontSize: 14,
        fontWeight: "normal",
        whiteSpace: "nowrap",
        padding: "0 4px",
        paddingBottom: 20,
      },
    },
    tr: {
      "& td": {
        color: theme.palette.grey[800],
        fontSize: 14,
        fontWeight: 500,
        padding: "0 4px",
      },
    },
    rank: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.palette.primary.main,
    },
    name: {
      maxWidth: 100,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      WebkitLineClamp: 1,
      WebkitBoxOrient: "vertical",
      cursor: "pointer",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    helpIcon: {
      width: 16,
      height: 16,
      marginLeft: 2,
    },
    img: {
      userDrag: "none",
    },
  }),
);

const Industry: React.FunctionComponent = () => {
  const classes = useStyles();
  const muse = useClient();

  const [industries, setIndustries] = useState<IndustryModel[]>([]);
  const [queryIndustries] = useKeyValueMapQuery({
    variables: {
      funcID: "pevc.popular_industries_info",
      requestBody: JSON.stringify({
        limit: 10,
      }),
      platform: NextPlatform.PlatformWeb,
    },
  });

  useEffect(() => {
    if (!queryIndustries.data?.keyValueMap) return;
    const jsonString = _.get(queryIndustries, ["data", "keyValueMap", "data"]);

    const industries = isJSONString(jsonString) && JSON.parse(jsonString);
    if (!isArray(industries)) return;
    const newIndustries = industries.map(e => IndustryModel.fromJSON(e));
    setIndustries(newIndustries);
  }, [queryIndustries]);

  function content(ranking: number): ReactNode {
    if (ranking == 1) return <img className={classes.img} src={One} alt="" />;

    if (ranking == 2) return <img className={classes.img} src={Two} alt="" />;

    if (ranking == 3) return <img className={classes.img} src={Three} alt="" />;

    return <Typography className={classes.rank}>{ranking}</Typography>;
  }

  return (
    <ContentWrapper title="热门行业" fetching={queryIndustries.fetching} length={industries.length}>
      {industries.length > 0 && (
        <table className={classes.table}>
          <thead>
            <tr className={classes.header}>
              <th>排名</th>
              <th align="left">行业名称</th>
              <th style={{ display: "flex", alignItems: "center" }}>
                分数
                <Tooltip
                  title={
                    <div style={{ marginTop: 2 }}>
                      该分数根据当前行业新增公司数量，交易数量，新公司增幅，头部投资机构占比和融资速度独综合计算得出
                    </div>
                  }
                >
                  <HelpCircleOutline fontSize="small" htmlColor="#666" className={classes.helpIcon} />
                </Tooltip>
              </th>
              <th align="right">交易数量</th>
            </tr>
          </thead>
          <tbody>
            {industries.map(item => {
              return (
                <tr key={item.ranking} className={classes.tr}>
                  <td align="center">{content(item.ranking)}</td>
                  <td
                    className={classes.name}
                    onClick={() => {
                      window.open(`/profile?id=${item.id}&type=${item.type}`);
                      muse.sendTrackingEvent("dashboard.vertical_item_click", {
                        entity: EventProperty.entity({ id: item.id, type: item.type }),
                      });
                    }}
                    style={{ fontWeight: "normal" }}
                  >
                    {item.name}
                  </td>
                  <td align="center">{item.score}</td>
                  <td align="right">{item.historicalNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </ContentWrapper>
  );
};

export default Industry;
