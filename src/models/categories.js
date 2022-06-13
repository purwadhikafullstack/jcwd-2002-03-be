const { DataTypes } = require('sequelize');

const Category = (sequelize) => {
    return sequelize.define("Category", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};

module.exports = Category;
