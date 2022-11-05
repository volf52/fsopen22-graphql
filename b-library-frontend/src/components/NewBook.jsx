import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

const DEFAULT_PUBLISHED = 2000;

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(DEFAULT_PUBLISHED);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (err) => {
      console.error(err);
      props.setError(err.graphQLErrors?.[0]?.message);
    },
    update: (cache, resp) => {
      const book = resp.data.addBook;

      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(book),
        };
      });

      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const authorsCopy = [...allAuthors];
        const authorIdx = authorsCopy.findIndex((a) => a.id === book.author.id);

        if (authorIdx === -1) {
          // new
          authorsCopy.push({ ...book.author, bookCount: 1, born: null }); // born will be null for new author
        } else {
          const a = authorsCopy[authorIdx];
          authorsCopy[authorIdx] = { ...a, bookCount: a.bookCount + 1 };
        }

        return { allAuthors: authorsCopy };
      });
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await createBook({ variables: { title, author, published, genres } });

    setTitle("");
    setPublished(DEFAULT_PUBLISHED);
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div style={{ margin: "20px" }}>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
