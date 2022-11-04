import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, SET_BIRTH_YEAR } from "../queries"

const SetAuthorBirthYear = () => {
  const [author, setAuthor] = useState("")
  const [birthYear, setBirthYear] = useState("")

  const [editAuthor] = useMutation(SET_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const variables = { name: author, birthYear: Number(birthYear) }

    editAuthor({ variables })
      .then((r) => {
        console.log(r.data)
      })
      .catch(console.error)

    setAuthor("")
    setBirthYear("")
  }

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
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SetAuthorBirthYear
