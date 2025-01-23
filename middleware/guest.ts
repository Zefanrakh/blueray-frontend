import { Middleware } from "@nuxt/types";

const guest: Middleware = ({ $auth, route, redirect }) => {
  if ($auth.loggedIn) {
    return redirect("/");
  }
};

export default guest;
