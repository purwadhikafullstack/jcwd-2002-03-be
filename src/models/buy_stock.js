const { DataTypes } = require("sequelize")

const Buy_stock = (sequelize) => {
    return sequelize.define("Buy_stock", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
            // stock_orderId
            // Stok_opnameId
        }
    })
}

module.exports = Buy_stock