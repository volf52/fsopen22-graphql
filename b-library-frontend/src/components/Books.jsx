import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_GENRES } from "../queries";
import FilteredBooks from "./FIlteredBooks";

const genreButtonStyle = {
  margin: 2,
};

const Books = () => {
  const { data, loading } = useQuery(ALL_GENRES);
  const [selectedGenre, setSelectedGenre] = useState("");

  if (loading) return <div>loading genres...</div>;

  const genres = data.genres;

  return (
    <div>
      <h2>books</h2>

      <FilteredBooks genre={selectedGenre} />

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
