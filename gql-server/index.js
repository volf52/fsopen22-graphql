const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server")
const { connectDb } = require("./src/db")

const authorService = require("./src/services/author")
const bookService = require("./src/services/book")
const userService = require("./src/services/user")

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

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favouriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`
const resolvers = {
  Query: {
    bookCount: () => bookService.getCount(),
    authorCount: () => authorService.getCount(),
    allAuthors: () => authorService.getAll(),
    genres: async () => {
      const genres = await bookService.getAllGenres()

      return genres
    },
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

    me: (_root, _args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (_root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("Not authenticated")
      }
      const book = { ...args }

      let a = await authorService.getByName(args.author)

      if (!a) a = await authorService.create({ name: args.author })

      book.author = a._id

      try {
        const added = await bookService.create(book)

        a.books.push(added._id)
        await a.save()

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

    editAuthor: async (_root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("Not authenticated")
      }

      const author = await authorService.getByName(args.name)

      if (!author) return null

      author.born = args.setBornTo
      const updatedAuthor = await author.save()

      return updatedAuthor
    },

    createUser: async (_root, args) => {
      const alreadyExists = await userService.getByUsername(args.username)
      if (alreadyExists) {
        throw new UserInputError("Username must be unique", {
          invalidArgs: args,
        })
      }

      try {
        const user = await userService.create(args)
        return user
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args })
      }
    },

    login: async (_root, args) => {
      const tokenValue = await userService.login(args.username, args.password)

      if (!tokenValue) {
        throw new UserInputError("Wrong credentials", { invalidArgs: args })
      }

      const token = {
        value: tokenValue,
      }

      return token
    },
  },
  Author: {
    bookCount: (root) => root.books.length,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decoded = userService.decodeToken(auth.substring(7))

      const currentUser = await userService.findById(decoded.id)

      return { currentUser }
    }
  },
})

connectDb().then(() => {
  console.log("Connected to mongoose")
})

server.listen().then(({ url }) => {
  console.log(`Server up at ${url}`)
})
