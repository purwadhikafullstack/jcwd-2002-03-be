const { DataTypes } = require("sequelize")

const Product = (sequelize) => {
  return sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    med_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomer_med: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nomer_bpom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kemasan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    indikasi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    kandungan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};

module.exports = Product
