import logo from './logo.svg';
import LoginInput from './components/login-input';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Code challenge</h1>

        <LoginInput typeInput="login" />
        <LoginInput typeInput="password" />

        <button>Login</button>
      </header>
    </div>
  );
}

export default App;
