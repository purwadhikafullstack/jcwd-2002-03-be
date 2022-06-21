const { DataTypes } = require("sequelize")

const Stock_sold = (sequelize) => {
    return sequelize.define("Stock_sold", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
            // stock_orderId
            // Transaction_id
        }
    })
}

module.exports = Stock_sold