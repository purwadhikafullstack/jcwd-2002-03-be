const { DataTypes } = require('sequelize');

const Inventory = (sequelize) => {
    return sequelize.define("inventory", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // stock_detail
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
};

module.exports = Inventory;
