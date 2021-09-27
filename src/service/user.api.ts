import axios from "axios";
import { User, LoginResponse, PrivateInfos, EncryptInfosResponse, DecryptInfosResponse, PrivateInfosKey } from "../app/user/user.types";

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
      url: "/user/login",
      method: "POST",
      data: user,
    })
    return {
      ok: true,
      loggedIn: true,
      message: "Login successful"
    }
  }   
  catch (error: any) {
    console.error(error);
    return {
      ok: false,
      loggedIn: false,
      message: "Unauthorized user"
    }
  }
}

export async function encryptInfos(infos : PrivateInfos): Promise<EncryptInfosResponse> {
  
  try {
    const response = await axiosInstance({
      url: "/user/encrypt-infos",
      method: "POST",
      data: infos,
    })

    return {
      ok: true,
      key: response.data.key,
      message: "Informations saved"
    }
  }   
  catch (error: any) {
    console.error(error);
    return {
      ok: false,
      key: "",
      message: "Informations could not be saved",
    }
  }
}

export async function decryptInfos(key : PrivateInfosKey): Promise<DecryptInfosResponse> {  
  try {
    const response = await axiosInstance({
      url: "/user/decrypt-infos",
      method: "POST",
      data: key,
    })

    return {
      ok: true,
      infos: response.data.infos,
      message: "Informations retrieved"
    }
  }   
  catch (error: any) {
    console.error(error);
    return {
      ok: false,
      infos: "",
      message: "Decryption error"
    }
  }
}