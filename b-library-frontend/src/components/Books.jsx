import { useQuery } from "@apollo/client"
import { useState } from "react"
import { useMemo } from "react"
import { ALL_BOOKS } from "../queries"

const genreButtonStyle = {
  margin: 2,
}

const BookList = () => {
  const { data, loading } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState("")

  const books = data?.allBooks

  const genres = useMemo(() => {
    if (!books) return new Set()
    const allGenres = books.reduce((acc, book) => {
      acc.push(...book.genres)
      return acc
    }, [])
    const uniqueGenres = new Set(allGenres)

    console.log(uniqueGenres)

    return Array.from(uniqueGenres)
  }, [books])

  if (loading) return <div>loading...</div>

  let filteredBooks = books
  if (selectedGenre) {
    filteredBooks = books.filter((b) => b.genres.includes(selectedGenre))
  }

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
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  )
}

const Books = (props) => {
  if (!props.show) {
    return null
  }

  return <BookList />
}

export default Books
