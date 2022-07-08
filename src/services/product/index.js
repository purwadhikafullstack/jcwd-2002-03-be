const Service = require("../service");
const { Product, Product_image, Category } = require("../../lib/sequelize");
const { Op } = require("sequelize");
class productService extends Service {
  // npx nodemon . --inspect
  static getProduct = async (req) => {
    try {
      const {
        _sortBy = "",
        _sortDir = "",
        _limit = 30,
        _page = 1,
        priceMin,
        priceMax,
        selectedProduct,
        searchProduct,
      } = req.query;
      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.priceMin;
      delete req.query.priceMax;
      delete req.query.selectedProduct;
      delete req.query.searchProduct;

      let whereCategoryClause = {};
      let searchByNameClause = {};

      if (selectedProduct) {
        whereCategoryClause.categoryId = selectedProduct;
      }

      if (searchProduct) {
        searchByNameClause = {
          med_name: { [Op.like]: `%${searchProduct}%` },
        };
      }

      const findProducts = await Product.findAndCountAll({
        where: {
          ...req.query,
          // med_name: {[Op.like]: `%${req.query.med_name}%`}
          selling_price: {
            [Op.between]: [priceMin || 0, priceMax || 999999999],
          },
          ...searchByNameClause,
          ...whereCategoryClause,
        },

        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
        distinct: true,
        include: [
          {
            model: Product_image,
            attributes: ["image_url"],
          },
          {
            model: Category,
            attributes: ["category_name", "id"],
            where: req.query?.categoryId ? { id: req.query.categoryId } : {},
          },
        ],
      });
      console.log(findProducts);
      return this.handleSuccess({
        message: "Products found",
        statusCode: 200,
        data: {
          result: findProducts,
          meta: {
            page: _page,
            limit: _limit,
            count: findProducts.count,
            totalPages: Math.ceil(findProducts.count / _limit),
          },
        },
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getProductById = async (req) => {
    try {
      const { id } = req.params;
      const findProduct = await Product.findByPk(id, {
        include: {
          model: Product_image,
          attributes: ["image_url"],
        },
      });
      return this.handleSuccess({
        message: "Product found successfully",
        statusCode: 200,
        data: findProduct,
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
        nomor_med,
        nomor_bpom,
        selling_price,
        discount,
        indikasi,
        kandungan,
        kemasan,
        categoryId,
      } = req.body;

      const checkNameRegister = await Product.findOne({
        where: {
          med_name,
        },
      });

      if (checkNameRegister) {
        return this.handleError({
          message: "Product Already Registered",
          statusCode: 400,
        });
      }

      const checkNoMedRegister = await Product.findOne({
        where: {
          nomor_med,
        },
      });

      if (checkNoMedRegister) {
        return this.handleError({
          message: "No_med already Registered to other Product",
          statusCode: 400,
        });
      }
      const checkBpomRegister = await Product.findOne({
        where: {
          nomor_bpom,
        },
      });

      if (checkBpomRegister) {
        return this.handleError({
          message: "No_bpom already Registered to other Product",
          statusCode: 400,
        });
      }

      const inputProduct = await Product.create({
        med_name,
        nomor_med,
        nomor_bpom,
        selling_price,
        discount,
        indikasi,
        kandungan,
        kemasan,
        categoryId,
      });

      return this.handleSuccess({
        message: "your address was added successfully",
        statusCode: 201,
        data: inputProduct,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  };
  static addProductImage = async (req) => {
    try {
      const { id } = req.params;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = `products`;
      const selectedFile = req.files;
      console.log(selectedFile.length);

      if (!selectedFile) {
        return this.handleError({
          message: "there's no picture selected",
          statusCode: 400,
        });
      }

      const data = selectedFile.map((val) => {
        return {
          ProductId: id,
          image_url: `${uploadFileDomain}/${filePath}/${val.filename}`,
        };
      });

      console.log(data);

      const uploadPicture = await Product_image.bulkCreate(data);

      if (!uploadPicture) {
        return this.handleError({
          message: "upload error",
          statusCode: 400,
        });
      }

      return this.handleSuccess({
        message: "upload success",
        statusCode: 201,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  };
  static deleteProduct = async (req) => {
    try {
      const { id } = req.params;

      const deleteFile = await Product.destroy({
        where: {
          id,
        },
      });

      return this.handleSuccess({
        message: "Get categoryId",
        statusCode: 200,
        data: findCategory,
      });
    } catch (err) {
      console.log(err);
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
}
module.exports = productService;
