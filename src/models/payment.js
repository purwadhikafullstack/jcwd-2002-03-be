const { DataTypes } = require("sequelize")

const Payment = (sequelize) => {
    return sequelize.define("Payment", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
            // transaction_id
            // admin_id
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        method: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}

module.exports = Payment