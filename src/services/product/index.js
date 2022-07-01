const Service = require("../service");
const { Product, Product_image, Category } = require("../../lib/sequelize");
class productService extends Service {
  // npx nodemon . --inspect
  static getProduct = async (req) => {
    try {
      const { _sortBy = "", _sortDir = "", _limit = 5, _page = 1 } = req.query;
      console.log(req.query._sortBy);
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
}
module.exports = productService;
