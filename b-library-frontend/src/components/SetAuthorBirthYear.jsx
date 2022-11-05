import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, SET_BIRTH_YEAR } from "../queries";

const SetAuthorBirthYear = ({ onSuccess, author, onCancel }) => {
  const [birthYear, setBirthYear] = useState(author.born || "");

  const [editAuthor] = useMutation(SET_BIRTH_YEAR, {
    update: (cache, resp) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const author = resp.data.editAuthor;
        const authorsCopy = [...allAuthors];

        const aIdx = authorsCopy.find((a) => a.id === author.id);
        if (aIdx === -1) return;

        authorsCopy[aIdx] = { ...authorsCopy[aIdx], ...author };

        return {
          allAuthors: authorsCopy,
        };
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const variables = { name: author.name, birthYear: Number(birthYear) };

    editAuthor({ variables })
      .then((r) => {
        onSuccess(r.data.editAuthor);
      })
      .catch(console.error);

    setBirthYear("");
  };

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">Author: </label>
          <input
            id="author"
            aria-label="author"
            name="author"
            value={author.name}
            disabled
            required
          />
        </div>

        <div>
          <label htmlFor="birthYear">Birth Year: </label>
          <input
            id="birthYear"
            aria-label="birthYear"
            name="birthYear"
            value={birthYear}
            type="number"
            onChange={(e) => setBirthYear(e.target.value)}
            required
          />
        </div>

        <div>
          <button style={{ margin: "0.5em" }} onClick={() => onCancel()}>
            Cancel
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SetAuthorBirthYear;
