const Service = require("../service");
const { Product, Product_image } = require("../../lib/sequelize");
class productService extends Service {
  // npx nodemon . --inspect
  static getProduct = async (req) => {
    try {
      const { _sortBy = "", _sortDir = "", _limit = 5, _page = 1 } = req.query;
      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      const findProducts = await Product.findAndCountAll({
        where: {
          ...req.query,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
        include: [
          {
            model: Product_image,
            attributes: ["image_url"],
          },
        ],
      });
      return this.handleSuccess({
        message: "Products found",
        statusCode: 200,
        data: findProducts,
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
module.exports = productService;
