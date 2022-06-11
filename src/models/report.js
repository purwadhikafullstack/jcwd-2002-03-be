const { DataTypes } = require('sequelize');

const Report = (sequelize) => {
    return sequelize.define("Report", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            // order_id
            // stock_detail_id
        },

    });
};

module.exports = Report;