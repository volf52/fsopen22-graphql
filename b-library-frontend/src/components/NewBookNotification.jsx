import { useSubscription } from "@apollo/client";
import { useState } from "react";
import { BOOK_ADDED } from "../queries";

const NewBookNotification = () => {
  const [msg, setMsg] = useState("");

  const r = useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded;
      const msg = `Book Added: ${book.title} with id ${book.id}`;
      setMsg(msg);
    },
  });

  if (!msg || r.loading) return null;

  return <div style={{ color: "green" }}>{msg}</div>;
};

export default NewBookNotification;
