import { useState } from "react"
import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
import SetAuthorBirthYear from "./SetAuthorBirthYear"

const AuthorList = ({ onAuthorClick }) => {
  const { data, loading } = useQuery(ALL_AUTHORS)

  if (loading) return <div>loading authors...</div>
  const authors = data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name} onClick={() => onAuthorClick(a)}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Authors = (props) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)

  const onAuthorClick = (a) => {
    setSelectedAuthor(a)
  }

  const onUpdateSuccess = () => {
    setSelectedAuthor(null)
  }

  const onCancel = () => setSelectedAuthor(null)

  if (!props.show) {
    return null
  }

  return (
    <div>
      <AuthorList onAuthorClick={onAuthorClick} />
      {selectedAuthor && (
        <SetAuthorBirthYear
          author={selectedAuthor}
          onSuccess={onUpdateSuccess}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}

export default Authors
