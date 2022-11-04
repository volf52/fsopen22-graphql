const { ApolloServer, gql } = require("apollo-server")
const { v4: newId } = require("@napi-rs/uuid")
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
    allBooks: async (_root, args) => {
      let books = await bookService.getAll()

      if (args.author !== undefined) {
        books = books.filter((b) => b.author === args.author)
      }

      if (args.genre !== undefined) {
        books = books.filter((b) => b.genres.includes(args.genre))
      }

      return books
    },
    allAuthors: () => authorService.getAll(),
  },
  Mutation: {
    addBook: async (root, args) => {
      const book = { ...args }

      const a = await authorService.getByName(args.author)

      if (!a) {
        const addedAuthor = await authorService.create({ name: args.author })
        book.author = addedAuthor._id
      } else {
        book.author = a._id
      }

      const added = await bookService.create(book)

      return added
    },

    editAuthor: (_root, args) => {
      const author = authors.find((a) => a.name === args.name)

      if (author) {
        author.born = args.setBornTo
      }

      return author
    },
  },
  Author: {
    bookCount: (root) => books.filter((b) => b.author === root.name).length,
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
