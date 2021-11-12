import React from "react";
import { ListItem, makeStyles, Typography, Theme } from "@material-ui/core";
import { ClockTimeFourOutline } from "mdi-material-ui";
import clsx from "clsx";
import TimeAgo from "timeago-react";

import CommonTag from "../../../common/tag";
import ClockIcon from "../../../../icons/ClockIcon";

const useStyles = makeStyles((theme: Theme) => ({
  infoItemRoot: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
  },
  publishedTime: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    WebkitLineClamp: 2,
    color: "#333333",
    fontWeight: 500,
    lineHeight: "26px",
    fontSize: 16,
    marginBottom: 6,
    cursor: "pointer",
  },
  subtitle: {
    color: "#666666",
    lineHeight: "24px",
    fontSize: 14,
    marginBottom: "12px",
    WebkitLineClamp: 3,
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    display: "-webkit-box",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
  },
  tagBox: {
    display: "flex",
  },
  rightImgBox: {
    width: "150px",
    height: "100px",
    marginLeft: "32px",
  },
  img: {
    width: 150,
    height: 100,
    objectFit: "cover",
    pointerEvents: "none",
  },
}));

interface InfoItemProps {
  id: string;
  tags: string[];
  title?: string | null;
  content?: string | null;
  publishedTime?: string | null;
  imgSrc?: string | null;
  classes?: {
    tag?: string;
  };
}

const InfoItem: React.FC<InfoItemProps> = (props) => {
  const classes = useStyles();
  const tagClasses = props.classes;
  const { id, tags, title, content, publishedTime, imgSrc } = props;

  const clickHandler = (): void => {
    window.open(`/news-detail?themeID=${id}`);
  };

  return (
    <ListItem button classes={{ root: classes.infoItemRoot }} onClick={clickHandler}>
      <div>
        {publishedTime && (
          <div className={classes.publishedTime}>
            <ClockIcon style={{ fontSize: 20 }} className={classes.timeIcon} />
            <TimeAgo datetime={publishedTime} className={classes.time} locale="zh_CN" />
          </div>
        )}
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.subtitle}>{content}</Typography>
        <div className={classes.tagBox}>
          {(tags ?? []).map((tag, index) => (
            <CommonTag key={tag + index} className={clsx(tagClasses?.tag)} label={tag} />
          ))}
        </div>
      </div>
      {imgSrc && (
        <div className={classes.rightImgBox}>
          <img className={classes.img} src={imgSrc} alt="" />{" "}
        </div>
      )}
    </ListItem>
  );
};

export default InfoItem;
