import { auth } from "~/services/firebase";
import constant from "~/lib/constant";

const loginRoute = "/";

export default function ({ route, redirect }) {
  let isAuthenticated = auth.currentUser;
  if (route.path !== loginRoute) {
    if (!isAuthenticated) {
      return redirect("/");
    }
  } else if (route.path === loginRoute && isAuthenticated) {
    redirect(constant.routes.userReadingChecklist);
  }
}
