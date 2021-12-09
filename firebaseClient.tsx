import { initializeApp } from "firebase/app";
import firebase_config from "./firebaseClientConfig";

const firebaseApp = initializeApp(firebase_config);

export { firebaseApp };
