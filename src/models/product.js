const { DataTypes } = require("sequelize");

const Product = (sequelize) => {
  return sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    med_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomer_med: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomer_bpom: {
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = Product;
