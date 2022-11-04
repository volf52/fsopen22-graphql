const { ApolloServer, gql, UserInputError } = require("apollo-server")
const { connectDb } = require("./src/db")

const authorService = require("./src/services/author")
const bookService = require("./src/services/book")

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`
const resolvers = {
  Query: {
    bookCount: () => bookService.getCount(),
    authorCount: () => authorService.getCount(),
    allAuthors: () => authorService.getAll(),
    allBooks: async (_root, args) => {
      const filters = {}

      if (args.author !== undefined) {
        const author = await authorService.getByName(args.author)
        filters.author = author._id
      }

      if (args.genre !== undefined) {
        filters.genre = args.genre
      }

      let books = await bookService.getFiltered(filters)

      return books
    },
  },
  Mutation: {
    addBook: async (_root, args) => {
      const book = { ...args }

      const a = await authorService.getByName(args.author)

      if (!a) {
        const addedAuthor = await authorService.create({ name: args.author })
        book.author = addedAuthor._id
      } else {
        book.author = a._id
      }

      try {
        const added = await bookService.create(book)
        return added
      } catch (err) {
        if (err.name === "ValidationError") {
          console.error("Validation Error")
        } else {
          console.error(err)
        }

        throw new UserInputError(err.message, { invalidArgs: args })
      }
    },

    editAuthor: async (_root, args) => {
      const author = await authorService.getByName(args.name)

      if (!author) return null

      author.born = args.setBornTo
      const updatedAuthor = await author.save()

      return updatedAuthor
    },
  },
  Author: {
    bookCount: (root) => root.books.length,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

connectDb().then(() => {
  console.log("Connected to mongoose")
})

server.listen().then(({ url }) => {
  console.log(`Server up at ${url}`)
})
