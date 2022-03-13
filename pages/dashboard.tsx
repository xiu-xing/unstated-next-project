import { Box, Typography } from "@material-ui/core";
import type { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Tab from "../src/components/tab";
import Kline from "../src/components/kline";

const Dashboard: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>React | Next</title>
      </Head>
      {/* <Tab /> */}
      <Kline />
    </Box>
  );
};

//getInitialProps:进行服务端渲染，获取数据

export default Dashboard;
