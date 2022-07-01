const Service = require("../service");
const { Product, Product_image, Category } = require("../../lib/sequelize");
const { Op } = require("sequelize");
class productService extends Service {
  // npx nodemon . --inspect
  static getProduct = async (req) => {
    try {
      const { _sortBy = "", _sortDir = "", _limit = 30, _page = 1, priceMin, priceMax } = req.query;
      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.priceMin;
      delete req.query.priceMax;
      const findProducts = await Product.findAndCountAll({
        where: {
          ...req.query,
            // med_name: {[Op.like]: `%${req.query.med_name}%`}
        },
        selling_price: {
          [Op.between]: [priceMin || 0, priceMax || 999999999]
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
        include: [
          {
            model: Product_image,
            attributes: ["image_url"],
          },
          {
            model: Category,
            attributes: ["category_name"]
          }
        ],
      });
      return this.handleSuccess({
        message: "Products found",
        statusCode: 200,
        data: {
          result: findProducts,
          meta: {page: _page, limit:_limit, count: findProducts.count, totalPages: Math.ceil(findProducts.count / _limit)}
        }
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
  static addProduct = async (req) => {
    try {
      const {
        med_name,
        no_med,
        no_bpom,
        selling_price,
        discount,
        indikasi,
        kandungan,
        kemasan,
        category,

      } = req.body

      const checkNameRegister = await Product.findOne({
        where: {
          med_name
        }
      })

      if (checkNameRegister) {
        return this.handleError({
          message: "Product Already Registered",
          statusCode: 400
        })
      }

      const checkNoMedRegister = await Product.findOne({
        where: {
          no_med
        }
      })

      if (checkNoMedRegister) {
        return this.handleError({
          message: "No_med already Registered to other Product",
          statusCode: 400
        })
      }
      const checkBpomRegister = await Product.findOne({
        where: {
          no_med
        }
      })

      if (checkBpomRegister) {
        return this.handleError({
          message: "No_bpom already Registered to other Product",
          statusCode: 400
        })
      }

      const inputProduct = await Product.create({
        med_name,
        no_med,
        no_bpom,
        selling_price,
        discount,
        indikasi,
        kandungan,
        kemasan,
        category,
      })

      return this.handleSuccess({
        message: "add new product success",
        statusCode: 201,
        data: inputProduct
      })

    } catch (err) {
      console.log(err)
      return this.handleError({})
    }

  }
  static addProductImage = async (req) => {
    try {
      const { id } = req.params
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = `products`;
      const selectedFile = req.files
      console.log(selectedFile.length)

      if (!selectedFile) {
        return this.handleError({
          message: "there's no picture selected",
          statusCode: 400
        })
      }

      const data = selectedFile.map((val) => {
        return {
          ProductId: id,
          image_url: `${uploadFileDomain}/${filePath}/${val.filename}`
        }
      })

      console.log(data)

      const uploadPicture = await Product_image.bulkCreate(data)

      if (!uploadPicture) {
        return this.handleError({
          message: "upload error",
          statusCode: 400
        })
      }

      return this.handleSuccess({
        message: "upload success",
        statusCode: 201
      })
    } catch (err) {
      console.log(err)
      return this.handleError({})
    }

  }
  static deleteProduct = async (req) => {
    try {
      const { id } = req.params

      const deleteFile = await Product.destroy({
        where: {
          id
        }
      })

      return this.handleSuccess({
        message: "delete product success",
        statusCode: 200,
      })
    } catch (err) {
      console.log(err)
      return this.handleError({})

    }
  }
}

module.exports = productService;
