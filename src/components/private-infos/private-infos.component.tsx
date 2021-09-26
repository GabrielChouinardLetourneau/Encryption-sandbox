import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { reset, selectUser, sendInfos } from '../../app/user/user.slice';
import componentsStyles from "../components.module.css";


export function PrivateInfos() {
  const { currentUser, userStatus, statusMessage } = useAppSelector(selectUser);
  const [infos, setInfos] = useState<string>('');
  const dispatch = useAppDispatch();
  const history = useHistory();

  // useEffect(() => {
  //   if (!loggedIn) history.push("/")
  // }, [loggedIn])

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(sendInfos(infos))
  }

  const logout = () => {
    dispatch(reset())
    history.push("/")
  }

  return ( 
    <div className={componentsStyles.row}>
      <form action="/informations" onSubmit={(e) => handleSubmit(e)} className={componentsStyles.form}>

        <textarea 
          className={componentsStyles.textbox}
          style={{
            maxWidth: "100%",
            minWidth: 400,
            minHeight: 200,
            maxHeight: 400,
            textAlign: "left",
          }}
          rows={5}
          cols={5}
          maxLength={400}
          onChange={(e) => setInfos(e.target.value)}
          value={infos} 
          name="infos" 
          id="sc" 
        />
        <input type="submit" value="Save informations" className={componentsStyles.button} />
 
      </form>
      <button 
        onClick={() => logout()}
        className={componentsStyles.button}
      >
        Logout
      </button>
    </div>

   );
}
