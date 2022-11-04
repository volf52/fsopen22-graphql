import { gql, useQuery } from "@apollo/client"

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const Books = (props) => {
  const { data, loading } = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (loading) return <div>loading...</div>

  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
