import Cookie from "js-cookie";
import Router from "next/router";
import { logoutMutation } from "@helpers/api-mutations";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import { useQuery } from "react-query";
import { userDetailsQuery } from "@helpers/api-queries";

export const redirectErrors = (status) => {
  if (status === 401) {
    Cookie.remove("token");
    Cookie.remove("user_id");
    // logoutQuery.refetch();
    Router.push("/error/401");
  }
};

export const logOut = async () => {
  const logoutQuery = (await api(
    Method.POST,
    logoutMutation,
    null
  )) as AxiosPromise<any>;
  Cookie.remove("token");
  Cookie.remove("user_id");
  console.log(JSON.stringify(logoutQuery));
  if ((await logoutQuery).status === 200) Router.push("/");
};

export const routeGuard = async (route: string) => {
  const user = Cookie.get("user_id");
  const queryUserModules = useQuery(
    "getuserModules",
    async () =>
      (await api(
        Method.GET,
        `${userDetailsQuery}/${user}`,
        "?select=modules"
      )) as any,
    { refetchOnWindowFocus: false }
  );

  // console.log(queryUserModules?.data);

  return await routeExist(route, queryUserModules?.data?.moduleDetails);
};

const routeExist = (route: string, arr: any) => {
  return arr?.some(function (el) {
    return route.includes(el.reference);
  });
};
