import axios from "axios";
import { getCookie } from "./cookies";

// frontend url
// https://hopa-menu-dev.loca.lt

// export const URL = "https://menuapi.hopa.tech/v1";
export const URL = "https://hopadevapi.kdev.co.in/v1";
export const WSURL = "wss://hopadevapi.kdev.co.in";
// export const URL = "http://localhost:4001/v1";
// export const URL = "http://172.16.0.74:4001/v1";

// export const WSURL = "ws://localhost:4001"
// export const WSURL = "ws://menuapi.hopa.tech:4001"

export const axiosGet = async (params, query = {}) => {
  let axiosGetConfig = {
    method: "get",
    url: `${URL}/${params}`,
    params: { ...query },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("idToken")}`,
    },
    // data: "dataregionf",
    withCredentials: true,
  };

  return await axios(axiosGetConfig);
};

export const axiosPost = async (params, data, headers = {}) => {
  let axiosGetConfig = {
    method: "post",
    url: `${URL}/${params}`,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("idToken")}`,
      ...headers,
    },
    data: JSON.stringify(data),
    withCredentials: true,
  };

  return await axios(axiosGetConfig);
};

export const axiosPatch = async (params, data) => {
  let axiosGetConfig = {
    method: "patch",
    url: `${URL}/${params}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("idToken")}`,
    },
    data: JSON.stringify(data),
    withCredentials: true,
  };

  return await axios(axiosGetConfig);
};

export const axiosDelete = async (params, data) => {
  let axiosGetConfig = {
    method: "delete",
    url: `${URL}/${params}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("idToken")}`,
    },
    data: JSON.stringify(data),
    withCredentials: true,
  };

  return await axios(axiosGetConfig);
};
