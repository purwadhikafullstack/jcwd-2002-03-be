const { DataTypes } = require('sequelize');

const Transaction = (sequelize) => {
    return sequelize.define("Transaction", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // product_id
            // user_id
            // admin_id
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        recipient_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recipient_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recipient_phone: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isPacking: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isSend: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    });
};

module.exports = Transaction;