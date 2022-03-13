import { CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useClient } from "urql";
import {
  EntityType,
  OverviewModalDocument,
  OverviewModalQuery,
  OverviewModalQueryVariables,
} from "../../../../../generated/graphql";
import { ModalModel, ModalType } from "../../../../../models/modal/modal";
import { OverviewLayout } from "../../../modal/layout";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      left: "-300px",
      top: "-100px",
      borderRadius: 4,
      maxWidth: 560,
      boxShadow: "0px 1px 18px 0px rgba(0,0,0,0.12),0px 6px 10px 0px rgba(0,0,0,0.14),0px 3px 5px -1px rgba(0,0,0,0.2)",
      background: "#fff",
      zIndex: 1301,
    },
    loading: {
      margin: 16,
    },
  }),
);

export interface NodeToolTipsPosition {
  x: number;
  y: number;
}

interface NodeToolTipsProps {
  position?: NodeToolTipsPosition;
  modal?: ModalModel;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
}

const NodeToolTips: React.FunctionComponent<NodeToolTipsProps> = (props) => {
  const { position, modal, onMouseLeave, onMouseEnter } = props;
  const classes = useStyles();
  const client = useClient();
  const [fetching, setFetching] = useState<boolean>(true);
  const [modalData, setModalData] = useState<Map<string, unknown>>();

  function executeModalDataQuery(): void {
    if (!modal || modal.type != ModalType.ProfileOverview) return;

    setFetching(true);
    client
      .query<OverviewModalQuery, OverviewModalQueryVariables>(OverviewModalDocument, {
        entityID: modal.args["entity_id"],
        entityType: modal.args["entity_type"] as EntityType,
        modalID: modal.args["modal_id"],
      })
      .toPromise()
      .then((res) => {
        setFetching(false);
        if (res.data && res.data.overviewModal) {
          const dataMap: Map<string, unknown> = new Map(Object.entries(res.data.overviewModal));
          setModalData(dataMap);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }

  useEffect(() => {
    if (modal) {
      executeModalDataQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <div
      className={classes.root}
      style={{ top: `${position?.y}px`, left: `${position?.x}px` }}
      onMouseLeave={() => {
        onMouseLeave && onMouseLeave();
      }}
      onMouseEnter={() => {
        onMouseEnter && onMouseEnter();
      }}
    >
      {fetching ? <CircularProgress size={24} className={classes.loading} /> : <OverviewLayout modalData={modalData} />}
    </div>
  );
};

export default NodeToolTips;
