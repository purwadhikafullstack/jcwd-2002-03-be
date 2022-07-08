const { DataTypes } = require('sequelize')

const Prescription_image = (sequelize) => {
    return sequelize.define("Prescription_image", {
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

module.exports = Prescription_image