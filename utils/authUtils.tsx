import Cookie from "js-cookie";
import Router from "next/router";
import { useMutation } from "react-query";
import { logoutMutation } from "@helpers/api/mutations";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";

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
