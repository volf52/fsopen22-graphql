const { UserInputError, AuthenticationError } = require("apollo-server-core");
const { PubSub } = require("graphql-subscriptions");

const authorService = require("../services/author");
const bookService = require("../services/book");
const userService = require("../services/user");
const events = require("./events");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: () => bookService.getCount(),
    authorCount: () => authorService.getCount(),
    allAuthors: () => authorService.getAll(),
    genres: async () => {
      const genres = await bookService.getAllGenres();

      return genres;
    },
    allBooks: async (_root, args) => {
      const filters = {};

      if (args.author !== undefined) {
        const author = await authorService.getByName(args.author);
        filters.author = author._id;
      }

      if (args.genre !== undefined) {
        filters.genre = args.genre;
      }

      let books = await bookService.getFiltered(filters);

      return books;
    },

    me: (_root, _args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (_root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("Not authenticated");
      }
      const book = { ...args };

      let a = await authorService.getByName(args.author);

      if (!a) a = await authorService.create({ name: args.author });

      book.author = a._id;

      try {
        const added = await bookService.create(book);

        a.books.push(added._id);
        await a.save();
        await added.populate("author");

        await pubsub.publish(events.BOOK_ADDED, { bookAdded: added });

        return added;
      } catch (err) {
        if (err.name === "ValidationError") {
          console.error("Validation Error");
        } else {
          console.error(err);
        }

        throw new UserInputError(err.message, { invalidArgs: args });
      }
    },

    editAuthor: async (_root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      const author = await authorService.getByName(args.name);

      if (!author) return null;

      author.born = args.setBornTo;
      const updatedAuthor = await author.save();

      return updatedAuthor;
    },

    createUser: async (_root, args) => {
      const alreadyExists = await userService.getByUsername(args.username);
      if (alreadyExists) {
        throw new UserInputError("Username must be unique", {
          invalidArgs: args,
        });
      }

      try {
        const user = await userService.create(args);
        return user;
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args });
      }
    },

    login: async (_root, args) => {
      const tokenValue = await userService.login(args.username, args.password);

      if (!tokenValue) {
        throw new UserInputError("Wrong credentials", { invalidArgs: args });
      }

      const token = {
        value: tokenValue,
      };

      return token;
    },
  },
  Author: {
    bookCount: (root) => root.books.length,
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([events.BOOK_ADDED]),
    },
  },
};

module.exports = resolvers;
