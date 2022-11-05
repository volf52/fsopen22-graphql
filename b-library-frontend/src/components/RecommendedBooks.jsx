import { useQuery } from "@apollo/client";
import { ME_Q } from "../queries";
import FilteredBooks from "./FIlteredBooks";

const RecommendedBooks = () => {
  const { data, loading } = useQuery(ME_Q);

  if (loading) return <div>loading...</div>;

  const { favouriteGenre } = data.me;

  return (
    <div style={{ margin: "10px" }}>
      <h2>recommendations</h2>
      <p>
        books in your favourite genre <strong>{favouriteGenre}</strong>
      </p>
      <FilteredBooks genre={favouriteGenre} />
    </div>
  );
};

export default RecommendedBooks;
