import { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { LoadingStatus, reset, retrieveInfos, selectUser, sendInfos } from '../../app/user/user.slice';
import componentsStyles from "../components.module.css";


export function PrivateInfos() {
  const { currentUser, loadingStatus, status } = useAppSelector(selectUser);
  const [currentInfos, setCurrentInfos] = useState<string>('');
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    const dataStored = sessionStorage.getItem("key")
    if (dataStored) {
      dispatch(retrieveInfos({ key: dataStored }))
      setCurrentInfos(currentUser.infos as string);
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(sendInfos({ infos: currentInfos }))
  }

  const logout = () => {
    dispatch(reset())
    history.push("/")
  }

  return ( 
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
          <form action="/informations" onBlur={(e) => handleSubmit(e)} className={componentsStyles.form}>
            <h2>Hello {currentUser.username}</h2>
            <p className={status.ok ? componentsStyles.ok : componentsStyles.error}>{status.message}</p>
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
              onChange={(e) => setCurrentInfos(e.target.value)}
              value={currentInfos} 
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
        </>
      )}
    </div>

   );
}
