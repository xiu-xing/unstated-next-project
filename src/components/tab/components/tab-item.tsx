import { Box, Typography } from "@material-ui/core";
import React from "react";

interface TabItemProps {
  type: string;
}

const TabItem: React.FunctionComponent<TabItemProps> = (props) => {
  const { type } = props;

  return (
    <Box>
      <Typography>tab item</Typography>
    </Box>
  );
};

export default TabItem;
