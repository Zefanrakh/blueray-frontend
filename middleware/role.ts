import { Middleware } from "@nuxt/types";
import { Meta } from "ant-design-vue/types/meta";

const role: Middleware = ({ $auth, redirect, route }) => {
  const user = $auth.$state.user;

  if (!user) {
    return;
  }

  const requiredRoles =
    route.meta?.find((meta: Meta & Record<string, any>) => meta.requiredRoles)
      ?.requiredRoles || [];

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return redirect("/");
  }
};

export default role;
