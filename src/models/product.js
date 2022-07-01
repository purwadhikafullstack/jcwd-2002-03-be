const { DataTypes } = require("sequelize")

const Product = (sequelize) => {
    return sequelize.define("Product", {
        med_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        no_med: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        no_bpom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        selling_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        kemasan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        indikasi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
    })
}

module.exports = Product