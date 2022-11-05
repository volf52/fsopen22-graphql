const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favouriteGenre: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.set("toJSON", {
  transform: function (_doc, returned) {
    returned.id = returned._id.toString();

    delete returned._id;
    delete returned.__v;
    delete returned.password;
  },
});

module.exports = model("User", userSchema, "users");
