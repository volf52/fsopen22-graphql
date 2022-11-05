import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME_Q } from "../queries";
import BookList from "./BookList";

const RecommendedBooks = () => {
  const { data, loading } = useQuery(ME_Q);
  const booksQuery = useQuery(ALL_BOOKS);

  if (loading || booksQuery.loading) return <div>loading...</div>;

  const { favouriteGenre } = data.me;
  const { allBooks } = booksQuery.data;

  const filteredBooks = allBooks.filter((b) =>
    b.genres.includes(favouriteGenre)
  );

  return (
    <div style={{ margin: "10px" }}>
      <h2>recommendations</h2>
      <p>
        books in your favourite genre <strong>{favouriteGenre}</strong>
      </p>
      <BookList books={filteredBooks} />
    </div>
  );
};

export default RecommendedBooks;
