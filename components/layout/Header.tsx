import { useState, Fragment } from "react";

import { useRouter } from "next/dist/client/router";
import Link from "next/link";

import styles from "./Header.module.css";
import Image from "next/image";

import logo from "../../assets/logo/default-monochrome.svg";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { Drawer } from "@mui/material";

import useAuthUser from "../hooks/useAuthUser";
import { useQueryClient } from "react-query";

const Header: React.FC = () => {
  const [menuState, setMenuState] = useState(false);
  const { sendSignOutReq } = useAuthUser();
  const queryClient = useQueryClient();

  const router = useRouter();

  const toggleDrawer = (state: boolean) => {
    setMenuState(state);
  };

  const logoHandler: () => void = () => {
    router.push("/");
  };

  const profileHandler: () => void = () => {
    router.push("/Profile")
  }

  const logoutHandler: () => void = () => {
    queryClient.invalidateQueries("tasks");
    sendSignOutReq();
  };

  return (
    <Fragment>
      <AppBar color="primary" position="static">
        <Toolbar className={styles.toolbar}>
          <div className={styles["icon-button-wrap"]}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div className={styles["image-container"]} onClick={logoHandler}>
            <Image src={logo} alt="logo" width="200px" height="150px" />
          </div>
          <div className={styles["nav-buttons"]}>
            <div className={styles["icon-button-wrap"]}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="logout"
                sx={{ mr: 2 }}
                onClick={profileHandler}
              >
                <PersonIcon />
              </IconButton>
            </div>
            <div className={styles["icon-button-wrap"]}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="logout"
                sx={{ mr: 2 }}
                onClick={logoutHandler}
              >
                <LogoutIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={"left"}
        open={menuState}
        onClose={() => toggleDrawer(false)}
      >
        <List className={styles.list}>
          <Typography variant="h6">
            <ListItem>
              <Link href="/">Home</Link>
            </ListItem>
            <ListItem>
              <Link href="/Calendar">Calendar</Link>
            </ListItem>
            <ListItem>
              <Link href="/Manage">Manage Plans</Link>
            </ListItem>
          </Typography>
        </List>
      </Drawer>
    </Fragment>
  );
};

export default Header;
