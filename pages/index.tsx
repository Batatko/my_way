import { useEffect, Fragment } from "react";

import styles from "./index.module.css";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardHeader } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import Header from "../components/layout/Header";
import Feed from "../components/layout/Feed";

import useFirestoreData from "../components/hooks/useFirestoreData";
import { useQuery } from "react-query";
import { getCookie } from "cookies-next";
import { dateHandler } from "../components/helper/tools";

import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import exchangeRefreshToken from "../components/helper/exchangeRefreshToken";

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

  return {
    props: {
      payload,
    },
  };
};

const HomePage = ({
  payload,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const { getTasks } = useFirestoreData();
  const { isLoading, data } = useQuery("tasks", () =>
    getTasks(payload.user_id)
  );

  return (
    <Fragment>
      <Header />
      <Feed>
        {data?.length === 0 && !isLoading && (
          <div className={styles["card-wrap"]}>
            <Card sx={{ width: 600 }}>
              <CardContent className={styles["no-data"]}>
                Find your way...
              </CardContent>{" "}
            </Card>
          </div>
        )}
        {isLoading ? (
          <div className={styles["loading-wrap"]}>
            <CircularProgress sx={{ padding: 100 }} />
          </div>
        ) : (
          data?.map((task) => (
            <div key={task.taskId} className={styles["card-wrap"]}>
              <Card sx={{ width: 600 }}>
                <div className={styles.header}>
                  <Typography variant="h4" component="div">
                    <CardHeader
                      disableTypography={true}
                      title={`${task.taskName}`}
                    />
                  </Typography>
                  <CardHeader
                    className={styles.date}
                    disableTypography={true}
                    title={` Scheduled for ${
                      dateHandler(task.taskDate).formatDate
                    }
                    ${dateHandler(task.taskDate).formatTime}`}
                  />
                </div>
                <CardContent>{`${task.taskData}`}</CardContent>
              </Card>
            </div>
          ))
        )}
      </Feed>
    </Fragment>
  );
};

export default HomePage;
