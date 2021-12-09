import { useEffect } from "react";

import styles from "./Auth.module.css"

import AuthForm from "../components/auth/AuthForm";
import Feed from "../components/layout/Feed"

import { useQueryClient } from "react-query";

const Auth = (): JSX.Element => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear()
  })
  
  return (
    <Feed className={styles.feed}>
      <AuthForm />
    </Feed>
  );
};

export default Auth;
