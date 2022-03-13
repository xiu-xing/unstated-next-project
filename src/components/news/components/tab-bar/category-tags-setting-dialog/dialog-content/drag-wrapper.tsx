import React, { useState, useEffect } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
// import arrayMove from 'array-move';
import { cloneDeep } from "lodash";
import { NewsTopicItem } from "../../../../../../generated/graphql";

export function arrMove(arr: NewsTopicItem[], fromIndex: number, toIndex: number) {
  const cloneArr = cloneDeep(arr);
  const startIndex = fromIndex < 0 ? cloneArr.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < cloneArr.length) {
    const endIndex = toIndex < 0 ? cloneArr.length + toIndex : toIndex;

    const [item] = cloneArr.splice(fromIndex, 1);
    cloneArr.splice(endIndex, 0, item);
  }
  return cloneArr;
}

interface DragProps {
  list: NewsTopicItem[];
  handleChangeList: (val: NewsTopicItem[]) => void;
  render: (tag: NewsTopicItem) => React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagItem: {
      zIndex: 9999,
      background: "white",

      "& .tag": {
        padding: "4px 0 4px 6px",
        margin: "0 6px 0 0px",
        border: "1px solid #fff",
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          cursor: "pointer",
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          zIndex: 10000,
        },
      },
    },
    active: {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  }),
);
const DragWrapper: React.FC<DragProps> = (props) => {
  const classes = useStyles();
  const { list, render, handleChangeList } = props;
  const [dragList, setDragList] = useState<NewsTopicItem[]>(list);

  useEffect(() => {
    setDragList(list);
  }, [list]);

  function onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    if (newIndex === 0) {
      return;
    }
    setDragList((prevList) => {
      const newList = arrMove(prevList, oldIndex, newIndex);
      handleChangeList(newList);
      return newList;
    });
  }

  const SortItem = SortableElement(({ item }: { item: NewsTopicItem }) => {
    return <Grid className={classes.tagItem}>{render(item)}</Grid>;
  });

  const SortContainer = SortableContainer(({ children }: { children: React.ReactNode }) => {
    return (
      <Grid container spacing={2} style={{ paddingLeft: 8 }}>
        {children}
      </Grid>
    );
  });

  return (
    <SortContainer onSortEnd={onSortEnd} helperClass={classes.active} distance={10} axis="xy">
      {dragList.map((item, index) => (
        <SortItem key={item.id} index={index} item={item} disabled={index === 0} />
      ))}
    </SortContainer>
  );
};

export default DragWrapper;
