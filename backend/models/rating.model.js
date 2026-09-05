const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Store = require("./store.model");

const Rating = sequelize.define(
  "Rating",
  {
    rating: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "storeId"],
      },
    ],
  }
);

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

module.exports = Rating;
