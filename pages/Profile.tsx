import { useState, Fragment } from "react";

import Header from "../components/layout/Header";
import Feed from "../components/layout/Feed";

import styles from "./Profile.module.css";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { CardHeader } from "@mui/material";
import { CardContent } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";

import DeleteSignForm from "../components/auth/DeleteSignForm";

import useFirestoreData from "../components/hooks/useFirestoreData";
import { useQuery } from "react-query";
import { getCookie } from "cookies-next";
import { dateHandler } from "../components/helper/tools";

import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import exchangeRefreshToken from "../components/helper/exchangeRefreshToken";
import prefetchUserData from "../components/helper/prefetchUserData";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getCookie("refreshToken", ctx.res);

  if (!token) {
    return {
      redirect: {
        destination: "/Auth",
        permanent: false,
      },
    };
  }

  const payload = await exchangeRefreshToken(token as string);
  const userData = await prefetchUserData(payload.id_token);

  return {
    props: {
      userData,
    },
  };
};

const Profile = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const [user] = userData.users;
  const { getUser } = useFirestoreData();
  const { isLoading, data } = useQuery("user", () => getUser(user.localId));
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Header />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={styles.modal}
      >
        <div className={styles["card-wrap"]}>
          <DeleteSignForm uid={user.localId} />
        </div>
      </Modal>
      <Feed className={styles.feed}>
        {isLoading && (
          <div className={styles["card-wrap"]}>
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <div className={styles["card-wrap"]}>
            <Card sx={{ width: 600 }}>
              <div className={styles.header}>
                <Typography variant="h5" component="div">
                  <CardHeader
                    disableTypography={true}
                    title={`${data?.user.name} ${data?.user.surname}`}
                  />
                </Typography>

                <CardHeader
                  className={styles.date}
                  disableTypography={true}
                  title={`Account created ${
                    dateHandler(data?.time.toDate()).formatDate
                  }`}
                />
              </div>
              <CardContent className={styles.content}>
                {`Email: ${user.email}`}
                <Button onClick={() => setOpen(true)}>Delete Account</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Feed>
    </Fragment>
  );
};

export default Profile;
