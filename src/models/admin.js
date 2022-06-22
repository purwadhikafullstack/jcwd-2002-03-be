const { DataTypes } = require('sequelize');

const Admin = (sequelize) => {
    return sequelize.define('Admin', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};

module.exports = Admin;
