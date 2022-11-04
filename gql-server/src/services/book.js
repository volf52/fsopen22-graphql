const Book = require("../model/book")

const getAll = async () => {
  return await Book.find({})
}

const getCount = async () => {
  return await Book.count()
}

const create = async (book) => {
  return await Book.create(book)
}

const bookService = { getAll, getCount, create }

module.exports = bookService
