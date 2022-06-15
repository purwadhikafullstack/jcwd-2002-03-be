const { DataTypes } = require('sequelize')

const Product_image = (sequelize) => {
    return sequelize.define("Product_image", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })
}

module.exports = Product_image