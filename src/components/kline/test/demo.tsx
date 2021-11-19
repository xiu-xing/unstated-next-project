import { NextPage } from "next";
import { NextUrqlPageContext } from "next-urql";
import Head from "next/head";
import React from "react";
import DynamicTooltipKLineChart from ".";
import { withLocalUrqlClient } from "../../../../graphql/client/client";
import { getUser } from "../../../containers/userContainer";
import { UserInformation } from "../../../generated/graphql";
import DatabaseSkeleton from "../../share-component/skeleton/database-skeleton";

interface DashboardPageProps {
  user: UserInformation;
}

const DashboardPage: NextPage<DashboardPageProps> = props => {
  return (
    <>
      <Head>
        <title>看板 | RimeData</title>
      </Head>
      <DatabaseSkeleton user={props.user}>
        <DynamicTooltipKLineChart title="TooltipKLineChart" />
      </DatabaseSkeleton>
    </>
  );
};

DashboardPage.getInitialProps = async (ctx: NextUrqlPageContext): Promise<DashboardPageProps> => {
  const client = ctx.urqlClient;
  const user = await getUser(client);

  return { user };
};

export default withLocalUrqlClient(DashboardPage);
