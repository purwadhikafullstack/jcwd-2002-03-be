const Service = require("../service");
const { User, Address } = require("../../lib/sequelize");
class profileService extends Service {
  // npx nodemon . --inspect
  static getMyProfile = async (req) => {
    try {
      const findMyProfile = await User.findOne({
        where: {
          id: 1,
        },
        attributes: {
          exclude: ["password", "updatedAt", "id", "createdAt"],
        },
      });
      return this.handleSuccess({
        message: "My Profile found",
        statusCode: 200,
        data: findMyProfile,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static editNama = async (req) => {
    try {
      const { username } = req.body;
      const findUser = await User.findOne({
        where: {
          name: username,
        },
      });
      if (findUser) {
        return this.handleError({
          message: "username has been taken",
          statusCode: 400,
        });
      }
      await User.update(
        {
          name: username,
        },
        {
          where: {
            id: 1,
          },
        }
      );
      const name = await User.findOne({
        where: {
          id: 1,
        },
        attributes: ["name"],
      });
      return this.handleSuccess({
        message: "your name was changed successfully",
        statusCode: 201,
        data: name,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static tambahTl = async (req) => {
    try {
      const { birthdate } = req.body;
      const userBirthdate = await User.update(
        {
          birthDate: birthdate,
        },
        {
          where: {
            id: 1,
          },
        }
      );
      return this.handleSuccess({
        message: "your birthdate was added successfully",
        statusCode: 201,
        data: userBirthdate,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static tambahJk = async (req) => {
    try {
      const { gender } = req.body;
      console.log(gender);
      const userGender = await User.update(
        {
          gender,
        },
        {
          where: {
            id: 1,
          },
        }
      );

      return this.handleSuccess({
        message: "your gender was added successfully",
        statusCode: 201,
        data: userGender,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static editProfilePicture = async (req) => {
    try {
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = `profile-pictures`;
      const { filename } = req.file;

      await User.update(
        {
          ...req.body,
          image_url: `${uploadFileDomain}/${filePath}/${filename}`,
        },
        {
          where: {
            id: 1,
          },
        }
      );
      const imageUrl = await User.findOne({
        where: {
          id: 1,
        },
        attributes: ["image_url"],
      });
      return this.handleSuccess({
        message: "your profile picture was created successfully",
        statusCode: 201,
        data: imageUrl,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static tambahAlamat = async (req) => {
    try {
      const {
        labelAlamat,
        nama,
        nomorHp,
        provinsi,
        kotaKabupaten,
        kecamatan,
        alamat,
        kodePos,
        UserId,
      } = req.body;
      const address = await Address.create({
        labelAlamat,
        nama,
        nomorHp,
        provinsi,
        kotaKabupaten,
        kecamatan,
        alamat,
        kodePos,
        UserId,
      });
      return this.handleSuccess({
        message: "your address was added successfully",
        statusCode: 201,
        data: address,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static tambahNomorHp = async (req) => {
    try {
      const { phone } = req.body;
      const userPhone = await User.update(
        {
          phone,
        },
        {
          where: {
            id: 1,
          },
        }
      );
      return this.handleSuccess({
        message: "your phone number was created successfully",
        statusCode: 201,
        data: userPhone,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getAddress = async (req) => {
    try {
      const address = await User.findAndCountAll({
        where: {
          id: 1,
        },
        include: [
          {
            model: Address,
            attributes: [
              "labelAlamat",
              "nama",
              "nomorHp",
              "provinsi",
              "kotaKabupaten",
              "kecamatan",
              "alamat",
              "kodePos",
              "id",
            ],
          },
        ],
      });
      return this.handleSuccess({
        message: "your address was added successfully",
        statusCode: 201,
        data: address.rows,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
}
module.exports = profileService;
