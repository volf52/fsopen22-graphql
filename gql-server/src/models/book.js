const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  published: {
    type: Number,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
});

bookSchema.set("toJSON", {
  transform: function (_doc, returned) {
    returned.id = returned._id.toString();

    delete returned._id;
    delete returned.__v;
  },
});

module.exports = model("Book", bookSchema, "books");
