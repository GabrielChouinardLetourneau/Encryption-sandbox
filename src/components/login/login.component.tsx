import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  LoadingStatus,
  loginUser,
  reset,
  selectUser,
} from "../../app/user/user.slice";
import { LoginResponse } from "../../app/user/user.types";
import componentsStyles from "../components.module.css";

export function Login() {
  const { currentUser, loadingStatus, userStatus, status } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  useEffect(() => {
    console.log(status.message);
  }, [loadingStatus, status])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await dispatch(loginUser({ username, pw }))
    console.log((response.payload as LoginResponse));
    if ((response.payload as LoginResponse).ok) history.push("/informations")
  }

  return (
    <>
      <div className={componentsStyles.row}>
        {loadingStatus === LoadingStatus.LOADING ? (
          <Loader
            type="Rings"
            color="rgb(22, 92, 124)"
            height={100}
            width={100}
            timeout={3000} 
          />
        ) : (
          <>
            {status.message && (
              <p className={componentsStyles.error}>{status.message}</p>
            )}
            <form action="/" onSubmit={(e) => handleSubmit(e)}>
              <input
                className={componentsStyles.textbox}
                required  
                type="text"
                aria-label="Enter your username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                className={componentsStyles.textbox}
                required
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
          </>
        )}
      </div>
    </>
  );
}
