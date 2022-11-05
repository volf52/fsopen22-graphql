import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import { useEffect } from "react";
import { TOKEN_KEY } from "../constants";

const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPasswd] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;

      setToken(token);

      localStorage.setItem(TOKEN_KEY, token);
    }
  }, [result.data, setToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            name="username"
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPasswd(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
