import { useApolloClient } from "@apollo/client";
import { PropsWithChildren } from "react";
import { useIntl } from "react-intl";

import { UserContext } from "./";
import { useAuthProvider } from "./hooks/useAuthProvider";
import { useNotifier } from "../hooks/useNotifier/useNotifier";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const apolloClient = useApolloClient();
  const intl = useIntl();
  const notify = useNotifier();
  const authProvider = useAuthProvider({ intl, notify, apolloClient });

  return <UserContext.Provider value={authProvider}>{children}</UserContext.Provider>;
};

export { AuthProvider };
