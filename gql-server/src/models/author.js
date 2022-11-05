const { Schema, model } = require("mongoose");

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
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

authorSchema.set("toJSON", {
  transform: function (_doc, returned) {
    returned.id = returned._id.toString();

    delete returned._id;
    delete returned.__v;
  },
});

module.exports = model("Author", authorSchema, "authors");
