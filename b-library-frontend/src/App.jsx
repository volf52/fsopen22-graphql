import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useApolloClient } from "@apollo/client";
import Notify from "./components/Notify";
import { useEffect } from "react";
import { TOKEN_KEY } from "./constants";
import Page from "./components/Page";
import LoginForm from "./components/LoginForm";
import RecommendedBooks from "./components/RecommendedBooks";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setPage("authors");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <Notify errorMessage={errorMsg} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Page show={page === "authors"}>
        <Authors />
      </Page>
      <Page show={page === "books"}>
        <Books />
      </Page>
      <Page show={page === "add"}>
        <NewBook setError={setErrorMsg} />
      </Page>

      <Page show={page === "login"}>
        <LoginForm setToken={setToken} setError={setErrorMsg} />
      </Page>

      <Page show={page === "recommended"}>
        <RecommendedBooks />
      </Page>
    </div>
  );
};

export default App;
