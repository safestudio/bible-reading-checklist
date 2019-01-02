import { auth } from "~/services/firebase";
import constant from "~/lib/constant";

export default ({ store, redirect }) => {

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        store.dispatch("userProfile/closeDBChannel", {clearModule: true}).catch(console.error);
      }
      else {
        if (!store.state.userProfile.userProfile) {
          console.log(store.state.userProfile);
          store.dispatch("userProfile/openDBChannel").catch(console.error);
          store.commit("setProfileConnectionState");
        }
        redirect(constant.routes.userReadingChecklist);
      }
      resolve();
    });
  });
};
