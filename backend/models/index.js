const sequelize = require("../config/db");
const User = require("./user.model");
const Store = require("./store.model");
const Rating = require("./rating.model");

module.exports = { sequelize, User, Store, Rating };
