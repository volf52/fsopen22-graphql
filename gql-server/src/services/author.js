const Author = require("../model/author")

const getAll = async () => {
  return await Author.find({})
}

const getCount = async () => {
  return await Author.count()
}

const getByName = async (name) => {
  return await Author.findOne({ name })
}

const create = async (author) => {
  return await Author.create(author)
}

const authorService = { getAll, getCount, getByName, create }

module.exports = authorService
