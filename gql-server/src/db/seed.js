const { default: mongoose } = require("mongoose")
const { connectDb } = require(".")
const { authors } = require("./seedData")

const Author = require("../model/author")
const Book = require("../model/book")

connectDb().then(async () => {
  console.log("Connected to mongo")

  await Author.deleteMany({})
  await Book.deleteMany({})

  for (const author of authors) {
    const created = await Author.create(author)

    const authorBooks = author.books.map((book) => ({
      ...book,
      author: created._id,
    }))
    await Book.insertMany(authorBooks)
  }

  await mongoose.disconnect()
})
