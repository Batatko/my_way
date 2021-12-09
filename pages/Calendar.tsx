import { useState, useEffect, Fragment } from "react";

import Header from "../components/layout/Header";
import Feed from "../components/layout/Feed";

import styles from "./Calendar.module.css";
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import CalendarPicker from "@mui/lab/CalendarPicker";
import { Badge } from "@mui/material";
import { PickersDayProps } from "@mui/lab";
import { PickersDay } from "@mui/lab";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { CardHeader } from "@mui/material";
import { CardContent } from "@mui/material";

import useFirestoreData from "../components/hooks/useFirestoreData";
import { useQuery } from "react-query";
import { getCookie } from "cookies-next";

import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import exchangeRefreshToken from "../components/helper/exchangeRefreshToken";

interface taskData {
  userId: string;
  created: Date;
  taskName: string;
  taskDate: Date;
  taskData: string;
  taskId: string;
}

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

const Calendar = ({payload}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const [date, setDate] = useState<Date | null>(null);
  const [highlightTasks, setHiglightTasks] = useState<taskData[]>([]);
  const { getTasks } = useFirestoreData();
  const { data } = useQuery("tasks", () => getTasks(payload.user_id));


  function highlightDays(date: Date): boolean {
    let isHighlight: boolean = false;
    data?.map((el) => {
      if (el.taskDate.toDateString() === date.toDateString()) {
        isHighlight = true;
      }
    });
    return isHighlight;
  }

  function highlightTasksHandler(): void {
    let highlightTasks: taskData[] = [];
    data?.map((el) => {
      if (el.taskDate.toDateString() === date?.toDateString()) {
        highlightTasks.push(el);
      }
    });
    setHiglightTasks(highlightTasks);
  }

  function dateHandler(taskDate: Date): {
    formatDate: string;
    formatTime: string;
  } {
    const date = taskDate.toString().split(" ");
    const formatDate = `${date[0]}, ${date[1]}, ${date[2]}, ${date[3]}`;
    const formatTime = `${date[4]}`;

    return {
      formatDate,
      formatTime,
    };
  }

  function renderDayPicker(
    date: Date,
    selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ): JSX.Element {
    const isSelected =
      !pickersDayProps.outsideCurrentMonth && highlightDays(date);

    return (
      <Badge
        key={date.toString()}
        overlap="circular"
        badgeContent={isSelected ? "📓" : undefined}
      >
        <PickersDay {...pickersDayProps} />
      </Badge>
    );
  }

  useEffect(() => {
    highlightTasksHandler();
  }, [date]);

  return (
    <Fragment>
      <Header />
      <Feed className={styles.feed}>
        <div className={styles["card-wrap"]}>
        <Card sx={{ width: 1200, bgcolor: "secondary.light" }}>
          <Typography variant="h4" component="div">
            <CardHeader disableTypography={true} title={"Calendar"} />
          </Typography>
          <CardContent className={styles.content}>
            <div className={styles["calendar-container"]}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <CalendarPicker
                  date={date}
                  onChange={(newDate) => setDate(newDate)}
                  renderDay={renderDayPicker}
                />
              </LocalizationProvider>
            </div>
            <div className={styles["task-container"]}>
              <div className={styles["task-window"]}>
                {highlightTasks.length == 0 && (
                  <div className={styles["card-wrap"]}>
                    <Card
                      sx={{ width: 600, height: 300 }}
                      className={styles["card-free"]}
                    >
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Do you know the way?
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {highlightTasks?.map((task) => (
                  <div key={task.taskId} className={styles["card-wrap"]}>
                    <Card sx={{ width: 600 }}>
                      <Typography variant="h4" component="div">
                        <CardHeader
                          disableTypography={true}
                          title={`${task.taskName}`}
                        />
                      </Typography>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Scheduled for {dateHandler(task.taskDate).formatDate}{" "}
                          {dateHandler(task.taskDate).formatTime}
                        </Typography>
                      </CardContent>
                      <CardContent>{`${task.taskData}`}</CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </Feed>
    </Fragment>
  );
};

export default Calendar;
