import { User, LoginResponse } from "../app/user/user.types";

// A mock function to mimic making an async request for data
export function loginToAPI(user : User): LoginResponse {
  const res: LoginResponse = {
    ok: true,
    message: "Login successful"
  }
  return res
}
