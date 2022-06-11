const { DataTypes } = require('sequelize');

const Cart = (sequelize) => {
    return sequelize.define("Cart", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // product_id
        },
        quntities: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};

module.exports = Cart;