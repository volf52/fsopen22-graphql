const { Schema, model } = require("mongoose")

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
})

authorSchema.set("toJSON", {
  transform: function (doc, returned) {
    returned.id = returned._id
  },
})

module.exports = model("Author", authorSchema, "authors")
