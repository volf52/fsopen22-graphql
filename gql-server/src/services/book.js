const Book = require("../model/book")

const getAll = async () => {
  return await Book.find({}).populate("author")
}

const getFiltered = async (filters) => {
  let f = {}

  if (filters.author) {
    f.author = filters.author
  }

  if (filters.genre) {
    f.genres = { $in: [filters.genre] }
  }

  return await Book.find(f).populate("author")
}

const getCount = async () => {
  return await Book.count()
}

const getAuthorBookCount = async (authorId) => {
  return await Book.count({ author: authorId })
}

const create = async (book) => {
  return await Book.create(book)
}

const bookService = {
  getAll,
  getCount,
  create,
  getFiltered,
  getAuthorBookCount,
}

module.exports = bookService
