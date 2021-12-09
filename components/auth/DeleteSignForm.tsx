import { useState } from "react";

import styles from "./DeleteSignForm.module.css";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { CardHeader } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";

import useFirestoreData from "../hooks/useFirestoreData";
import useAuthUser from "../hooks/useAuthUser";
interface signInData {
  email: string;
  password: string;
}

interface Props {
  uid: string;
}

const DeleteSignForm: React.FC<Props> = ({
  uid,
}): JSX.Element => {
  const [signInInput, setSignInInput] = useState<signInData>({
    email: "",
    password: "",
  });

  const { deleteUserTasks } = useFirestoreData();
  const { sendSignInReq, sendDeleteUserReq } = useAuthUser();

  function signInInputHandler(id: string, input: string): void {
    setSignInInput((prevState) => ({ ...prevState, [id]: input }));
  }

  async function deleteUserHandler(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    await sendSignInReq(signInInput, true);
    deleteUserTasks(uid)
    await sendDeleteUserReq();
  }

  return (
    <Card sx={{ width: 600 }}>
      <div className={styles.header}>
        <CardHeader title="Enter your credentials" />
      </div>
      <CardContent>
        <form id="auth" className={styles.form}>
          <div className={styles["input-container"]}>
            <Stack spacing={3}>
              <TextField
                fullWidth={true}
                id="email"
                label="Enter email"
                variant="outlined"
                value={signInInput.email}
                onChange={(e) => signInInputHandler("email", e.target.value)}
              />
              <TextField
                fullWidth={true}
                id="password"
                label="Enter password"
                variant="outlined"
                value={signInInput.password}
                onChange={(e) => signInInputHandler("password", e.target.value)}
              />
            </Stack>
          </div>
        </form>
      </CardContent>
      <CardActions className={styles["button-container"]}>
        <Button onClick={deleteUserHandler}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default DeleteSignForm;
