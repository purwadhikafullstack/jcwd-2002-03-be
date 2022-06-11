const { DataTypes } = require('sequelize');

const Stock_detail = (sequelize) => {
    return sequelize.define("Stock_detail", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // product_id
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cogs: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        expired_date: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        storage_location: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    });
};

module.exports = Stock_detail;
