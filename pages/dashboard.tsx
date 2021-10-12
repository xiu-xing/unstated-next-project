import { Box, Typography } from "@material-ui/core";
import type { NextPage } from "next";
import React from "react";
import Head from "next/head";

const Dashboard: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>React | Next</title>
      </Head>
      <Typography>React next</Typography>
    </Box>
  );
};

export default Dashboard;
