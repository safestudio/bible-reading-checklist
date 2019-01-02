import Vuex from "vuex";
import constant from "~/lib/constant";
import firebase, { auth, firestore } from "~/services/firebase";
import VuexEasyFirestore from "vuex-easy-firestore";
import { CHECKLIST_UPDATE } from "~/lib/nuxt-event";

const defaultReadingCheckListValue = {
  "gen": [],
  "exo": [],
  "lev": [],
  "num": [],
  "deu": [],
  "jos": [],
  "jdg": [],
  "rut": [],
  "1sa": [],
  "2sa": [],
  "1ki": [],
  "2ki": [],
  "1ch": [],
  "2ch": [],
  "ezr": [],
  "neh": [],
  "est": [],
  "job": [],
  "psa": [],
  "pro": [],
  "ecc": [],
  "sng": [],
  "isa": [],
  "jer": [],
  "lam": [],
  "ezk": [],
  "dan": [],
  "hos": [],
  "jol": [],
  "amo": [],
  "oba": [],
  "jon": [],
  "mic": [],
  "nam": [],
  "hab": [],
  "zep": [],
  "hag": [],
  "zec": [],
  "mal": [],
  "mat": [],
  "mrk": [],
  "luk": [],
  "jhn": [],
  "act": [],
  "rom": [],
  "1co": [],
  "2co": [],
  "gal": [],
  "eph": [],
  "php": [],
  "col": [],
  "1th": [],
  "2th": [],
  "1ti": [],
  "2ti": [],
  "tit": [],
  "phm": [],
  "heb": [],
  "jas": [],
  "1pe": [],
  "2pe": [],
  "1jn": [],
  "2jn": [],
  "3jn": [],
  "jud": [],
  "rev": [],
};
const userProfile = {
  firestorePath: "users/{userId}",
  firestoreRefType: "doc",
  moduleName: "userProfile",
  statePropName: "userProfile",
  namespaced: true,
  actions: {
    saveProfile({}, user) {
      let newUser = {
        email: user.email,
        id: user.uid,
        imageUrl: user.avatar || "",
        isVerified: user.emailVerified || false,
      };
      return firestore.doc(`/users/${user.uid}`)
        .update(newUser)
        .catch((error) => {
          console.error(error);
        });
    },
  }
};

const userReadingChecklist = {
  firestorePath: "readingCheckLists/{userId}",
  firestoreRefType: "doc",
  moduleName: "userReadingChecklist",
  statePropName: "userReadingChecklist",
  namespaced: true,
  sync: {
    defaultValues: defaultReadingCheckListValue,
  },
  actions: {
    initEmptyChecklist({}, user) {
      return firestore.doc(`/readingCheckLists/${user.uid}`)
        .set(defaultReadingCheckListValue)
        .catch((error) => {
          console.error(error);
        });
    },
    mark({}, payload) {
      const user = payload.user;
      const bookCode = payload.bookCode;
      const chapter = payload.chapter;
      const value = payload.value;
      const data = {};
      if (value) {
        data[bookCode] = firebase.firestore.FieldValue.arrayUnion(chapter);
      } else {
        data[bookCode] = firebase.firestore.FieldValue.arrayRemove(chapter);
      }
      return firestore.doc(`/readingCheckLists/${user.uid}`)
        .update(data)
        .catch((error) => {
          console.error(error);
        });
    },
    subscribeChecklist({ dispatch }, user) {
      return firestore
        .doc(`/readingCheckLists/${user.uid}`)
        .onSnapshot(
          doc => $nuxt.$emit(CHECKLIST_UPDATE, doc.data()),
          error => dispatch("unsubscribeChecklist", user)
        );
    },
    unsubscribeChecklist({}, user) {
      let unsubscribe = firestore
        .doc(`/readingCheckLists/${user.uid}`)
        .onSnapshot(function() {});
      unsubscribe();
    }
  }
};

const vuexEasyFirestore = VuexEasyFirestore([userProfile, userReadingChecklist], {logging: true});

const getDefaultState = () => {
  return {
    locales: ["en", "vi"],
    locale: constant.fallbackLocale,
    isProfileConnectionOpen: false
  };
};

const createStore = () => {
  return new Vuex.Store({
    plugins: [vuexEasyFirestore],
    state: getDefaultState(),
    actions: {
      userRegister({ dispatch }, user) {
        return auth
          .createUserWithEmailAndPassword(user.email, user.password)
          .then(result => {
            dispatch("userProfile/saveProfile", result.user);
            dispatch("userReadingChecklist/initEmptyChecklist", result.user);
            dispatch("userSendVerificationEmail");
            return result.user;
          })
          .catch(error => {
            throw error;
          });
      },
      userLogin({ dispatch }, account) {
        return auth
          .signInWithEmailAndPassword(account.email, account.password)
          .then(result => {
            dispatch("userProfile/saveProfile", result.user);
            return result.user;
          })
          .catch((error) => {
            throw error;
          });
      },
      userLogout({ dispatch }) {
        let currentUser = auth.currentUser;
        dispatch("userReadingChecklist/unsubscribeChecklist", currentUser)
          .then(() => {
            auth.signOut();
          });
      },
      userSendVerificationEmail() {
        let currentUser = auth.currentUser;
        currentUser.sendEmailVerification()
          .then(function () {
            console.log("Sent verification email");
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    },
    mutations: {
      setProfileConnectionState() {
        this.state.isProfileConnectionOpen = true;
      },
    }
  });
};

export default createStore;
