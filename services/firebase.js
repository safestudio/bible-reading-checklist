import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import firebaseConfig from "~/firebase.config";

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
export const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);
export const FieldValue = firestore.FieldValue;
export const auth = firebase.auth();
export default firebase;
