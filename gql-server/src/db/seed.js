const { default: mongoose } = require("mongoose")
const { connectDb } = require(".")
const { authors } = require("./seedData")

const Author = require("../models/author")
const Book = require("../models/book")

connectDb().then(async () => {
  console.log("Connected to mongo")

  await Author.deleteMany({})
  await Book.deleteMany({})

  for (const author of authors) {
    const created = await Author.create({ ...author, books: [] })

    const authorBooks = author.books.map((book) => ({
      ...book,
      author: created._id,
    }))

    const result = await Book.insertMany(authorBooks)

    created.books = result.map((r) => r._id)

    await created.save()
  }

  await mongoose.disconnect()
})
