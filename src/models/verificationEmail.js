const { DataTypes } = require('sequelize');

const VerificationToken = (sequelize) => {
  return sequelize.define('VerificationToken', {
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

module.exports = VerificationToken;
