import { Route } from "react-router-dom";
import { useEffect } from "react";
import logo from "./lmi.svg";
import { Login } from "./components/login/login.component";
import "./App.css";
import { useAppSelector } from "./app/hooks";
import { selectUser } from "./app/user/user.slice";
import { PrivateInfos } from "./components/private-infos/private-infos.component";


function App() {
  const { userStatus } = useAppSelector(selectUser);


  useEffect(() => {
  console.log(userStatus);
    
  }, [userStatus])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Code challenge</h1>
      </header>
      <main className="App-main">
      <Route path="/" exact component={Login} />
      <Route path="/informations" component={PrivateInfos} />
      </main>
    </div>
  );
}

export default App;
