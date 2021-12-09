import { useState, Fragment } from "react";

import styles from "./AuthForm.module.css";
import logo from "../../assets/logo/isolated-logo.svg";

import Image from "next/image";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { CardHeader } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";

import useAuthUser from "../hooks/useAuthUser";

interface signInData {
  email: string;
  password: string;
}

interface signUpData {
  email: string;
  password: string;
  name: string;
  surname: string;
}

const AuthForm = (): JSX.Element => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInInput, setSignInInput] = useState<signInData>({
    email: "",
    password: "",
  });
  const [signUpInput, setSignUpInput] = useState<signUpData>({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const { sendSignInReq, sendSignUpReq } = useAuthUser();

  function signInInputHandler(id: string, input: string): void {
    setSignInInput((prevState) => ({ ...prevState, [id]: input }));
  }

  function signUpInputHandler(id: string, input: string): void {
    setSignUpInput((prevState) => ({ ...prevState, [id]: input }));
  }

  async function signInHandler(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    await sendSignInReq(signInInput);
  }

  async function signUpHandler(e: React.SyntheticEvent): Promise<void> {
    e.preventDefault();
    await sendSignUpReq(signUpInput);
  }

  function modeHandler(): void {
    setIsSignUp(!isSignUp);
    setSignInInput({ email: "", password: "" });
    setSignUpInput({ name: "", surname: "", email: "", password: "" });
  }

  function inputRender(): JSX.Element | undefined {
    if (isSignUp) {
      return (
        <Stack spacing={3}>
          <TextField
            fullWidth={true}
            id="name"
            label="Enter name"
            variant="outlined"
            value={signUpInput.name}
            onChange={(e) => signUpInputHandler("name", e.target.value)}
          />
          <TextField
            fullWidth={true}
            id="surname"
            label="Enter surname"
            variant="outlined"
            value={signUpInput.surname}
            onChange={(e) => signUpInputHandler("surname", e.target.value)}
          />
          <TextField
            fullWidth={true}
            id="email"
            label="Enter email"
            variant="outlined"
            value={signUpInput.email}
            onChange={(e) => signUpInputHandler("email", e.target.value)}
          />
          <TextField
            fullWidth={true}
            id="password"
            label="Enter password"
            variant="outlined"
            value={signUpInput.password}
            onChange={(e) => signUpInputHandler("password", e.target.value)}
          />
        </Stack>
      );
    }

    if (!isSignUp) {
      return (
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
      );
    }
  }

  function buttonRender(): JSX.Element | undefined {
    if (isSignUp) {
      return (
        <Fragment>
          <Button onClick={() => modeHandler()}>Sign In</Button>
          <Button type="submit" form="auth" onClick={(e) => signUpHandler(e)}>
            Sign Up
          </Button>
        </Fragment>
      );
    }

    if (!isSignUp) {
      return (
        <Fragment>
          <Button onClick={() => modeHandler()}>Sign Up</Button>
          <Button type="submit" form="auth" onClick={(e) => signInHandler(e)}>
            Sign In
          </Button>
        </Fragment>
      );
    }
  }

  return (
    <Card sx={{ width: 600 }}>
      <div className={styles.header}>
        <CardHeader title="Do it your way..." />
      </div>
      <CardContent>
        <form id="auth" className={styles.form}>
          <div className={styles["logo-container"]}>
            <Image src={logo} alt="logo" width="200px" height="200px" />
          </div>
          <div className={styles["input-container"]}>{inputRender()}</div>
        </form>
      </CardContent>
      <CardActions className={styles["button-container"]}>
        {buttonRender()}
      </CardActions>
    </Card>
  );
};

export default AuthForm;
