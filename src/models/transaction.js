const { DataTypes } = require("sequelize");

const Transaction = (sequelize) => {
    return sequelize.define("Transaction", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
            // user_id
            // admin_id
            // address_id
        },
        nomer_pesanan: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isPacking: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isSend: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        ongkos_kirim: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        kurir: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};

module.exports = Transaction;
