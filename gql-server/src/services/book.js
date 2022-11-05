const Book = require("../models/book");

const getAll = async () => {
  return await Book.find({}).populate("author");
};

const getFiltered = async (filters) => {
  let f = {};

  if (filters.author) {
    f.author = filters.author;
  }

  if (filters.genre) {
    f.genres = { $in: [filters.genre] };
  }

  return await Book.find(f).populate("author");
};

const getCount = async () => {
  return await Book.count();
};

const getAuthorBookCount = async (authorId) => {
  return await Book.count({ author: authorId });
};

const create = async (book) => {
  const newBook = new Book(book);

  await newBook.save();
  await newBook.populate("author");

  return newBook;
};

const getAllGenres = async () => {
  const books = await Book.find({}, { genres: true });
  const genres = books.reduce((genres, book) => {
    genres.push(...book.genres);

    return genres;
  }, []);

  const uniqueGenres = Array.from(new Set(genres));

  return uniqueGenres;
};

const bookService = {
  getAll,
  getCount,
  create,
  getFiltered,
  getAuthorBookCount,
  getAllGenres,
};

module.exports = bookService;
