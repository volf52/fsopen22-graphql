import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useMemo } from "react";
import { ALL_BOOKS } from "../queries";
import BookList from "./BookList";

const genreButtonStyle = {
  margin: 2,
};

const Books = () => {
  const { data, loading } = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState("");

  const books = data?.allBooks;

  const genres = useMemo(() => {
    if (!books) return new Set();
    const allGenres = books.reduce((acc, book) => {
      acc.push(...book.genres);
      return acc;
    }, []);
    const uniqueGenres = new Set(allGenres);

    console.log(uniqueGenres);

    return Array.from(uniqueGenres);
  }, [books]);

  if (loading) return <div>loading...</div>;

  let filteredBooks = books;
  if (selectedGenre) {
    filteredBooks = books.filter((b) => b.genres.includes(selectedGenre));
  }

  return (
    <div>
      <h2>books</h2>

      <BookList books={filteredBooks} />

      <div>
        <h3>genres: </h3>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={genreButtonStyle}
          >
            {genre}
          </button>
        ))}
        <button
          style={genreButtonStyle}
          key="allGenres"
          onClick={() => setSelectedGenre("")}
        >
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
