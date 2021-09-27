export interface User {
  username: string
  pw: string
}

export interface PrivateInfos {
  infos: string
}

export interface PrivateInfosKey {
  key: string
}

export interface LoginResponse {
  ok: boolean
  loggedIn: boolean
  message: string
}

export interface EncryptInfosResponse {
  ok: boolean
  key: string
  message: string
}

export interface DecryptInfosResponse {
  ok: boolean
  infos: string
  message: string
}