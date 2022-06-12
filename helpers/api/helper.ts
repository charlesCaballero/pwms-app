import axios from "axios";
import Cookies from "js-cookie";

// export const url = 'https://icliquesms.apexfuelstation.com/api/v1';
export const url = "http://127.0.0.1:8000/api";

export enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export const api = (method: Method, endpoint: string, input?: any) => {
  if (method === Method.GET) {
    return axios({
      method: method,
      url: `${url}/${endpoint}${input ? input : ""}`,
      data: input,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status == 401) {
          return axios({
            method: Method.POST,
            url: `${url}/auth/logout`,
          });
        }
      });
  }

  if (method === Method.POST) {
    const headers =
      Cookies.get("token") != undefined
        ? {
            Authorization: `Bearer ${Cookies.get("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        : {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer`,
          };

    return axios({
      method: method,
      url: `${url}/${endpoint}`,
      data: input,
      headers: headers,
    }).catch((err) => {
      return err.response.data;
    });
  }

  if (method === Method.PUT) {
    return axios({
      method: method,
      url: `${url}/${endpoint}`,
      data: input,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status == 401) {
          return axios({
            method: Method.POST,
            url: `${url}/auth/logout`,
          });
        }
      });
  }

  if (method === Method.DELETE) {
    return axios({
      method: method,
      url: `${url}/${endpoint}`,
      data: input,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response.status == 401) {
          return axios({
            method: Method.POST,
            url: `${url}/auth/logout`,
          });
        }
      });
  }
};
