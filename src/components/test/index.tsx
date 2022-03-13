import { NextPage } from "next";
import { NextUrqlPageContext } from "next-urql";
import React from "react";
import DatabaseSkeleton from "../../share-component/skeleton/database-skeleton";
import ConfigContainer, { ConfigInitialState, getConfigs } from "../../../containers/configContainer";
import { getUser } from "../../../containers/userContainer";
import { UserInformation, WebProfile } from "../../../generated/graphql";
import { withLocalUrqlClient } from "../../../../graphql/client/client";
import Test from "./test";

interface ProfileProps {
  user?: UserInformation;
  profileData?: WebProfile;
  configs?: ConfigInitialState;
}

const Profile: NextPage<ProfileProps> = props => {
  const { user, configs } = props;

  return (
    <ConfigContainer.Provider initialState={{ ...configs }}>
      <DatabaseSkeleton user={user}>
        <Test />
      </DatabaseSkeleton>
    </ConfigContainer.Provider>
  );
};

Profile.getInitialProps = async (context: NextUrqlPageContext): Promise<ProfileProps> => {
  const client = context.urqlClient;
  const result: ProfileProps = {};

  const user = await getUser(client);
  const configs = await getConfigs({
    profileTableConfigs: true,
    riskEventConfig: true,
    chartConfigs: true,
  });

  if (user) result.user = user;
  if (configs) result.configs = configs;

  return result;
};

export default withLocalUrqlClient(Profile);
