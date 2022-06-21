const { DataTypes } = require('sequelize')

const Stock_order = (sequelize) => {
    return sequelize.define("Stock_order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // product_id
            // admin_id
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cost_of_good_sold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expired_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    })
}

module.exports = Stock_order