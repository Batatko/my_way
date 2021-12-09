import { Fragment, useState } from "react";

import styles from "./TaskForm.module.css";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { CardHeader } from "@mui/material";
import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { DateTimePicker } from "@mui/lab";
import { Typography } from "@mui/material";

import { useQuery } from "react-query";
import useFirestoreData from "../hooks/useFirestoreData";

import { AppProps } from "next/app";

interface propsData {
  user_id: string
}

const TaskForm = (props: propsData) => {
  const { addNewTask, getTasks } = useFirestoreData();
  const [enteredData, setEnteredData] = useState<{
    name: string;
    data: string;
  }>({
    name: "",
    data: "",
  });
  const [date, setDate] = useState<Date | null>(new Date());
  const { refetch } = useQuery("tasks", () => getTasks(props.user_id), {
    enabled: false,
  });

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredData((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleDate = (newValue: Date | null) => {
    setDate(newValue);
    console.log(newValue);
  };

  const handleData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredData((prevState) => ({
      ...prevState,
      data: event.target.value,
    }));
  };

  async function addNewTaskHandler(): Promise<void> {
    await addNewTask(props.user_id, enteredData.name, date, enteredData.data);
    refetch();
  }

  return (
    <Fragment>
      <Typography variant="h3" component="div">
        <CardHeader title="New Task" />
      </Typography>
      <CardContent>
        <form id="new-task" className={styles.form}>
          <Stack sx={{ width: "100%" }} spacing={3}>
            <TextField
              fullWidth={true}
              id="taskname"
              label="Enter task name"
              variant="outlined"
              value={enteredData.name}
              onChange={handleName}
            />
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DateTimePicker
                label="Date&Time picker"
                value={date}
                onChange={handleDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <TextField
              multiline
              rows={5}
              fullWidth={true}
              id="taskdata"
              label="Enter task data"
              variant="outlined"
              value={enteredData.data}
              onChange={handleData}
            />
          </Stack>
        </form>
      </CardContent>
      <CardActions className={styles["add-container"]}>
        <Button onClick={addNewTaskHandler}>Add Task</Button>
      </CardActions>
    </Fragment>
  );
};

export default TaskForm;
