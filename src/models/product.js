const { DataTypes } = require('sequelize')

const Product = (sequelize) => {
    return sequelize.define("Product", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // product_category
            // product_inventory
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        indikasi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        kandungan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        kemasan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resep: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        penyimpanan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        principal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        NIE: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
}

module.exports = Product