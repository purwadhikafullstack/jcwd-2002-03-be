const { DataTypes } = require("sequelize")

const Stock_order = (sequelize) => {
    return sequelize.define("Stock_order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            // Product_id
            // Admin_id
        },
        Stock_order_of_good_Sold: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    })
}

module.exports = Stock_order