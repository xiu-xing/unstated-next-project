import { Box, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";

interface TabResultProps {
  type: string;
}

const TabResult: React.FunctionComponent<TabResultProps> = (props) => {
  const { type } = props;

  function content(): ReactNode {
    return <Typography>{type}</Typography>;
  }

  return <Box>{content()}</Box>;
};

export default TabResult;
