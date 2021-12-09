import { useState, Fragment } from "react";

import styles from "./Manage.module.css";
import Header from "../components/layout/Header";
import Feed from "../components/layout/Feed";
import TaskForm from "../components/tasks/TaskForm";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import { CardHeader } from "@mui/material";
import { Button } from "@mui/material";
import { Accordion } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import { AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";

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

const ManagePlans = ({
  payload,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const { getTasks, deleteTask } = useFirestoreData();
  const { isLoading, data, refetch } = useQuery("tasks", () =>
    getTasks(payload.user_id)
  );

  const deleteTaskHandler = async (taskId: string): Promise<void> => {
    await deleteTask(taskId);
    refetch();
  };

  return (
    <Fragment>
      <Header />
      <Feed>
        <div className={styles["card-wrap"]}>
          <Accordion expanded={expanded} onClick={() => setExpanded(!expanded)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id="addTask"
              sx={{ width: 600 }}
            >
              Add Task
            </AccordionSummary>
            <AccordionDetails onClick={(e) => e.stopPropagation()}>
              <TaskForm user_id={payload.user_id} />
            </AccordionDetails>
          </Accordion>
        </div>

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
          <div className={styles["card-wrap"]}>
            <CircularProgress />
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
                <CardActions>
                  <Button
                    onClick={() => deleteTaskHandler(task.taskId)}
                    color={"primary"}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </div>
          ))
        )}
      </Feed>
    </Fragment>
  );
};

export default ManagePlans;
