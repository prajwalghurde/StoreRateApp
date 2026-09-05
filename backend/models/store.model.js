const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const Store = sequelize.define("Store", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING(400) },
});

User.hasMany(Store, { foreignKey: "ownerId" });
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

module.exports = Store;
