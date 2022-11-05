import LoginForm from "./LoginForm";

const LoginContainer = ({ show, setToken, setError }) => {
  if (!show) return null;

  return (
    <div>
      <h2>Login</h2>
      <LoginForm setToken={setToken} setError={setError} />
    </div>
  );
};

export default LoginContainer;
