import { Box, ButtonBase, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Close } from "mdi-material-ui";
import React, { useEffect, useRef, useState } from "react";
import {
  EquityGraphFetchType,
  FuncType,
  useEquityGraphQuery,
  useGraphQuery,
} from "../../../../generated/graphql";
import CommonAccordionPlaceholder from "../../accordion/components/placeholder";
import EquityChart from "../equity-chart";
import BeneficiaryControllerChart from "../beneficiary-controller-chart";
import { Variables } from "../../section/fetching/gallery";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "fixed",
      zIndex: 9999,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#fff",
    },
    circular: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20%",
    },
  }),
);
interface GalleryTreeChartProps {
  getShowChart: Function;
  variables: Variables;
}

const GalleryTreeChart: React.FunctionComponent<GalleryTreeChartProps> = (props) => {
  const classes = useStyles();
  const [rootWidth, setRootWidth] = useState(0);
  const [rootHeight, setRootHeight] = useState(0);
  const { variables, getShowChart } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const [fetching, setFetching] = useState(true);
  const [nodata, setNodata] = useState(false);
  const [graphResult] = getGraphResult();

  function getGraphResult() {
    if (variables.funcType == FuncType.FuncTypeEquityGraph) {
      return useEquityGraphQuery({
        variables: {
          fetchType: EquityGraphFetchType.EquityGraphFetchTypeShareholders,
          graphID: variables.graphId,
          entityID: variables.entityId,
          entityType: variables.entityType,
        },
      });
    } else {
      return useGraphQuery({
        variables: {
          graphID: variables.graphId,
          entityID: variables.entityId,
          entityType: variables.entityType,
        },
      });
    }
  };

  useEffect(() => {
    if (rootRef.current) {
      setRootHeight(rootRef.current.clientHeight);
      setRootWidth(rootRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    setFetching(graphResult.fetching);
    if (graphResult.data) {
      setNodata(false);
      return;
    }
    setNodata(true);
  }, [graphResult]);

  function content() {
    if (fetching)
      return (
        <Box className={classes.circular}>
          <CircularProgress color="primary" size={40} />
        </Box>
      );

    if (nodata)
      return (
        <div style={{ paddingTop: "15%" }}>
          <CommonAccordionPlaceholder />
        </div>
      );

    switch (variables.funcType) {
      case FuncType.FuncTypeEquityGraph:
        return (
          <EquityChart
            chartId={variables.graphId}
            entityId={variables.entityId}
            entityType={variables.entityType}
            width={rootWidth}
            height={rootHeight}
          />
        );
      case FuncType.FuncTypeGraph:
        return (
          <BeneficiaryControllerChart
            chartId={variables.graphId}
            entityId={variables.entityId}
            entityType={variables.entityType}
            width={rootWidth}
            height={rootHeight}
          />
        );
      default:
        return <></>;
    }
  }

  return (
    <div className={classes.root} ref={rootRef}>
      <ButtonBase
        style={{ position: "absolute", right: 48, top: 48, borderRadius: "50%", zIndex: 9 }}
        onClick={() => {
          getShowChart(false);
        }}
      >
        <Close fontSize={"large"} />
      </ButtonBase>
      {content()}
    </div>
  );
};

export default GalleryTreeChart;
