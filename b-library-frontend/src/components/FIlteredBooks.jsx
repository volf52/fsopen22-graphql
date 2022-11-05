import { useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries";
import BookList from "./BookList";

const FilteredBooks = ({ genre }) => {
  const variables = {};
  let query = ALL_BOOKS;
  if (genre) {
    variables.genre = genre;
    query = BOOKS_BY_GENRE;
  }

  const { data, loading } = useQuery(query, { variables });

  if (loading) return <div>loading books...</div>;

  return <BookList books={data.allBooks} />;
};

export default FilteredBooks;
