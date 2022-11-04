const jwt = require("jsonwebtoken")
const config = require("../config")

const User = require("../models/user")

const HARDCODED_PASSWORD = "secret"

const getAll = async () => {
  return await User.find({})
}

const create = async (user) => {
  user.password = HARDCODED_PASSWORD

  const newUser = new User(user)

  return await newUser.save()
}

const getByUsername = async (username) => {
  return await User.findOne({ username })
}

const comparePassword = (password, userPassword) => {
  return password === userPassword
}

const login = async (username, password) => {
  const user = await getByUsername(username)

  if (!user || !comparePassword(password, user.password)) {
    return null
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    config.JWT_SECRET,
  )

  return token
}

const decodeToken = (token) => jwt.decode(token, config.JWT_SECRET)

const findById = async (id) => await User.findById(id)

const userServices = {
  getAll,
  create,
  getByUsername,
  login,
  decodeToken,
  findById,
}

module.exports = userServices
