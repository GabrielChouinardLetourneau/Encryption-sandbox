import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  loginUser,
  reset,
  selectUser,
} from "../../app/user/user.slice";
import { LoginResponse } from "../../app/user/user.types";
import componentsStyles from "../components.module.css";

export function Login() {
  const { currentUser, userStatus, statusMessage } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  // useEffect(() => {
  //   // console.log(loggedIn);
  //  dispatch(reset());
  // }, [])

  useEffect(() => {
    // console.log(loggedIn);

    // if (loggedIn) history.push("/informations");
  }, [userStatus])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("handleLogin");
    const response = await dispatch(loginUser({ username, pw }))
    if ((response.payload as LoginResponse).ok) history.push("/informations")
  }

  return (
    <>
      <div className={componentsStyles.row}>

        <p className={componentsStyles.error}>{statusMessage}</p>
        <form action="/" onSubmit={(e) => handleSubmit(e)}>
          <input
            className={componentsStyles.textbox}
            type="text"
            aria-label="Enter your username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className={componentsStyles.textbox}
            type="password"
            autoComplete="off"
            aria-label="Enter your password"
            placeholder="Enter password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <input 
            className={componentsStyles.button}  
            type="submit" 
            value="Login"
          />
        </form> 
      </div>
    </>
  );
}
