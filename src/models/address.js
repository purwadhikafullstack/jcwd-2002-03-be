const { DataTypes } = require("sequelize");

const Address = (sequelize) => {
  return sequelize.define("Address", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    provinsi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kotaKabupaten: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kodePos: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labelAlamat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nomorHp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    main_address: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });
};

module.exports = Address;
