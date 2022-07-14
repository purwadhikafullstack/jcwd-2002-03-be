const Service = require("../service");
const {
  Product,
  Inventory,
  Stock_opname,
  Transaction,
  Transaction_items,
} = require("../../lib/sequelize");
const { Op } = require("sequelize");

class inventoryService extends Service {
  static addStockProduct = async (req) => {
    try {
      const { quantity, expired_date, ProductId, buying_price, type } =
        req.body;
      console.log(req.body);

      const addStock = await Inventory.create({
        quantity,
        expired_date,
        ProductId,
        buying_price,
        type,
        AdminId: req.token.id,
      });

      const updateStock = await Stock_opname.increment(
        {
          amount: quantity,
        },
        {
          where: {
            ProductId,
          },
        }
      );

      return this.handleSuccess({
        message: "Stock added",
        data: addStock,
      });
    } catch (err) {
      console.log;
      this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
  static getSalesReport = async (req) => {
    try {
      const { _limit = 30, _page = 1, _sortBy = "", _sortDir = "", searchProduct, } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.searchProduct;

      let searchByNameClause = {};

      if (searchProduct) {
        searchByNameClause = {
          med_name: { [Op.like]: `%${searchProduct}%` },
        };
      }

      const findSalesReport = await Inventory.findAndCountAll({
        where: {
          ...req.query,
        //   ...searchByNameClause,
        },
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        // order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
        order: [["createdAt", "DESC"]],
        distinct: true,
        include: [
          {
            model: Transaction,
            include: Transaction_items,
          },
          {
            model: Product,
            where: {
                ...req.query,
                ...searchByNameClause,
              },
          }
        ],
      });

      return this.handleSuccess({
        message: "Sales report found",
        statusCode: 200,
        data: findSalesReport,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
}

module.exports = inventoryService;
