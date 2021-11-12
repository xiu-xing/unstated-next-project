import { NextPage } from "next";
import { NextUrqlPageContext } from "next-urql";
import Head from "next/head";
import React from "react";
import { getUser } from "../../containers/userContainer";
import { UserInformation } from "../../generated/graphql";
import { withLocalUrqlClient } from "../../graphql/client/client";
import Skeleton from "../app/skeleton/skeleton";
import Dashboard from "./display";

interface DashboardPageProps {
  user: UserInformation;
}

const DashboardPage: NextPage<DashboardPageProps> = props => {
  return (
    <>
      <Head>
        <title>看板 | RimeData</title>
      </Head>
      <Skeleton user={props.user}>
        <Dashboard />
      </Skeleton>
    </>
  );
};

DashboardPage.getInitialProps = async (ctx: NextUrqlPageContext): Promise<DashboardPageProps> => {
  const client = ctx.urqlClient;
  const user = await getUser(client);

  return { user };
};

export default withLocalUrqlClient(DashboardPage);
