const { DataTypes } = require('sequelize');

const Category = (sequelize) => {
    return sequelize.define("category", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
            // productId
            // transactionId
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};

module.exports = Category;