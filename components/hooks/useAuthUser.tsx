import { useRouter } from "next/router";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";

import useFirestoreData from "./useFirestoreData";
import { setCookies, removeCookies } from "cookies-next";


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

const useAuthUser = () => {
  const router = useRouter();
  const auth = getAuth();
  const { createUser, deleteUserData } = useFirestoreData();

  async function sendSignInReq(data: signInData, isDelete: boolean = false): Promise<void> {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user: any = userCredential.user;

        if (isDelete) return;
        setCookies("refreshToken", user.stsTokenManager.refreshToken);
        router.push("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  async function sendSignUpReq(data: signUpData): Promise<void> {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user: any = userCredential.user

        createUser({
          userId: user.reloadUserInfo.localId,
          email: data.email,
          user: { name: data.name, surname: data.surname },
        });

        setCookies("refreshToken", user.stsTokenManager.refreshToken);
        router.push("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function sendSignOutReq(): void {
    signOut(auth)
      .then(() => {
        removeCookies("refreshToken");
        router.push("/Auth");
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  async function sendDeleteUserReq(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      await deleteUser(user).then(() => {
        deleteUserData(user.uid)
        sendSignOutReq();
      }).catch(error => {
        alert(error.message);
      })
    } else {
      alert("User not logged in.");
    }
  }

  return {
    sendSignInReq,
    sendSignUpReq,
    sendSignOutReq,
    sendDeleteUserReq
  };
};

export default useAuthUser;
