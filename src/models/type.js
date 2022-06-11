const { DataTypes } = require('sequelize');

const Type = (sequelize) => {
    return sequelize.define("Type", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};

module.exports = Type;