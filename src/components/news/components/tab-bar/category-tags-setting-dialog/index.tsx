import React, { useState, useEffect } from "react";
import {
  makeStyles,
  createStyles,
  Theme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { cloneDeep, isEqual } from "lodash";
import SimpleBar from "simplebar-react";

import { NewsTopicItem } from "../../../../../generated/graphql";
import SnackbarContainer from "../../../../common/snackbar/snackbarContainer";
import NewsContainer from "../../../container";
import TabBarContainer from "../tab-bar-container";
import Content from "./dialog-content";
import DialogSelect from "./dialog-select";
import Edit from "../../../../../icons/Edit";
import Refresh from "mdi-material-ui/Refresh";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogRoot: {
      "& .MuiPaper-root": {
        width: "560px",
        borderRadius: 0,
      },
    },
    titleRoot: {
      margin: 0,
      padding: "0 18px 0 32px",
      height: "60px",
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      color: "#fff",
    },
    closeButton: {
      color: "#fff",
    },
    bar: {
      maxHeight: "500px",
      paddingRight: "8px",
    },
    loadingBox: {
      zIndex: 1500,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50% ,-50%)",
    },
    btn: {
      color: theme.palette.primary.main,
      fontSize: 14,
      fontWeight: 500,
      textAlign: "center",
      lineHeight: "10px",
    },
  }),
);
interface SetCategoryTagsDialogProps {
  open: boolean;
  handleModalClose: () => void;
  handleSelectTag: (params: NewsTopicItem) => void;
}

const SetCategoryTagsDialog: React.FC<SetCategoryTagsDialogProps> = (props) => {
  const { open, handleModalClose, handleSelectTag } = props;
  const classes = useStyles();
  const { openSnackbar } = SnackbarContainer.useContainer();
  const { currentTag, setCurrentTag } = NewsContainer.useContainer();
  const [edit, setEdit] = useState<boolean>(false);
  const {
    myNewsTags: initialMyTags,
    submitLoading,
    setSubmitLoading,
    execSetMyNewsTagsMutation,
    execMyNewsTagsQuery,
  } = TabBarContainer.useContainer();
  const [dialogMyNewsTags, setDialogMyNewsTags] = useState(initialMyTags);

  useEffect(() => {
    setDialogMyNewsTags(initialMyTags);
  }, [initialMyTags]);

  function addToMyTags({ id, name, lock }: Partial<NewsTopicItem>) {
    setDialogMyNewsTags([...dialogMyNewsTags, { id, name, lock, __typename: "NewsTopicItem" } as NewsTopicItem]);
  }

  function removeFromMyTags({ id }: Partial<NewsTopicItem>) {
    let newIds = cloneDeep(dialogMyNewsTags);
    newIds = newIds.filter((v) => v.id !== id);
    setDialogMyNewsTags(newIds);
  }

  function resetMyTags() {
    setDialogMyNewsTags(initialMyTags);
  }

  function handleAddSuccessCallback() {
    // const isRemoveCurrentActiveTag =
    //   initialMyTags.some((v) => v.id === currentTag) && !dialogMyNewsTags.some((v) => v.id === currentTag);
    setCurrentTag("");
    setSubmitLoading(false);
    execMyNewsTagsQuery();
    handleModalClose();
  }

  async function handleSureClick() {
    setEdit(false);
    const ids = dialogMyNewsTags.map((v) => v.id);
    const oldIds = initialMyTags.map((v) => v.id);
    if (isEqual(ids, oldIds)) {
      handleModalClose();
      return;
    }
    setSubmitLoading(true);
    try {
      const result = await execSetMyNewsTagsMutation({
        input: {
          topicID: ids as string[],
        },
      });
      if (result?.data?.setUserNewsTopic) {
        handleAddSuccessCallback();
      }
    } catch (err) {
      setSubmitLoading(false);
      openSnackbar("设置分类标签失败", "error");
    }
  }

  function handleCancel() {
    setEdit(false);
    resetMyTags();
    handleModalClose();
  }

  function handleSelect(params: NewsTopicItem) {
    handleSelectTag(params);
    handleCancel();
  }

  return (
    <>
      <Dialog onClose={handleCancel} className={classes.dialogRoot} open={open}>
        <DialogTitle disableTypography className={classes.titleRoot}>
          <Typography variant="h6" className={classes.title}>
            分类
          </Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCancel}>
            <CloseIcon style={{ fontSize: "26px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: "16px 8px 8px 28px", overflow: "hidden" }}>
          <SimpleBar className={classes.bar}>
            {edit ? (
              <Content
                myTags={dialogMyNewsTags}
                addToMyTags={addToMyTags}
                removeFromMyTags={removeFromMyTags}
                setMyTags={setDialogMyNewsTags}
              />
            ) : (
              <DialogSelect myTags={dialogMyNewsTags} handleSelect={(params) => handleSelect(params)} />
            )}
          </SimpleBar>
        </DialogContent>
        <Divider style={{ backgroundColor: "#eee" }} />
        {edit ? (
          <DialogActions style={{ justifyContent: "space-between", margin: "0 12px" }}>
            <Button
              onClick={resetMyTags}
              className={classes.btn}
              startIcon={<Refresh style={{ fontSize: 16, marginRight: -4 }} />}
            >
              恢复默认
            </Button>
            <Box>
              <Button autoFocus onClick={handleCancel} style={{ color: "#666" }}>
                取消
              </Button>
              <Button autoFocus onClick={handleSureClick} color="primary" disabled={submitLoading}>
                确认
              </Button>
            </Box>
          </DialogActions>
        ) : (
          <DialogActions style={{ justifyContent: "start", margin: "0 12px" }}>
            <Button
              autoFocus
              className={classes.btn}
              startIcon={<Edit style={{ fontSize: 16, marginRight: -4 }} />}
              onClick={() => {
                setEdit(true);
              }}
            >
              编辑
            </Button>
          </DialogActions>
        )}

        {submitLoading && (
          <Box className={classes.loadingBox}>
            <CircularProgress color="primary" />
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default SetCategoryTagsDialog;
