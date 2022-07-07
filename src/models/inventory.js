const { DataTypes } = require("sequelize");

const Inventory = (sequelize) => {
  return sequelize.define("inventory", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      // productId
      // transactionId
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expired_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buying_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};

module.exports = Inventory;
