const { DataTypes } = require('sequelize');

const ForgotPasswordToken = (sequelize) => {
  return sequelize.define('ForgotPasswordToken', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};

module.exports = ForgotPasswordToken;
