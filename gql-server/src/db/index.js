const mongoose = require("mongoose");
const config = require("../config");

const connectDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { connectDb };
