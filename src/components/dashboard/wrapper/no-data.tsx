import { Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { NoDataWEBP } from "../../../assets/webp/nodata";

const useStyles = makeStyles(() =>
  createStyles({
    nodataBox: {
      display: "flex",
      height: "100%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    tipText: {
      fontSize: 14,
      fontWeight: 500,
      color: "#A6A6A6",
    },
    img: {
      pointerEvents: "none",
    },
  }),
);

interface NoDataProps {
  tip?: string;
  imgSrc?: string;
  imgClasses?: string;
}

const NoData: React.FunctionComponent<NoDataProps> = (props) => {
  const classes = useStyles();
  const { tip, imgSrc, imgClasses } = props;

  return (
    <div className={classes.nodataBox}>
      <img src={imgSrc ?? NoDataWEBP} className={imgClasses ?? classes.img} />
      {props.children ?? <Typography className={classes.tipText}>{tip ?? "暂无数据"}</Typography>}
    </div>
  );
};

export default NoData;
