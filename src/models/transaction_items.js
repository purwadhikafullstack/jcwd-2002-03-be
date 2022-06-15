const { DataTypes } = require("sequelize")

const Transaction_items = (sequelize) => {
    return sequelize.define("Transaction_items", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
            // transaction_id
            // product_id
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        delivery_cost: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    })
}

module.exports = Transaction_items