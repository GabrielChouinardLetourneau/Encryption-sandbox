import axios from "axios";
import { User, LoginResponse } from "../app/user/user.types";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  },
});

export async function loginToAPI(user : User): Promise<LoginResponse> {
  try {
    await axiosInstance({
      url: `/login`,
      method: "POST",
      data: user,
    })
    return {
      ok: true,
      message: "Login successful"
    }
  }   
  catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: "Unauthorized user"
    }
  }
}

export async function encryptInfos(infos : string): Promise<LoginResponse> {
  try {
    await axiosInstance({
      url: `/encrypt-infos`,
      method: "POST",
      data: infos,
    })
    return {
      ok: true,
      message: "Informations saved"
    }
  }   
  catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: "Unauthorized user"
    }
  }
}