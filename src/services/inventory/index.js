const Service = require("../service");
const {
  Product,
  Inventory,
  Stock_opname,
  Transaction,
  Transaction_items,
} = require("../../lib/sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

class inventoryService extends Service {
  static addStockProduct = async (req) => {
    try {
      const { quantity, expired_date, ProductId, buying_price, type } =
        req.body;

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
      const {
        _limit = 30,
        _page = 1,
        _sortBy = "",
        _sortDir = "",
        searchProduct,
      } = req.query;

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
          },
        ],
      });

      return this.handleSuccess({
        message: "Sales report found",
        statusCode: 200,
        data: findSalesReport,
      });
    } catch (err) {
      // console.log(err);
      this.handleError({
        message: "Server error",
        statusCode: 500,
      });
    }
  };
  static getRevenue = async (req) => {
    try {
      const { filterByMonth, filterByYear } = req.query;

      delete req.query.filterByMonth;
      delete req.query.filterByYear;

      let searchByMonthOrYear = {};

      if (filterByMonth && filterByYear) {
        searchByMonthOrYear = {
          createdAt: {
            [Op.between]: [
              `${filterByYear}-${moment(filterByMonth).format(
                "MM"
              )}-01T00:00:00.000Z`,
              `${filterByYear}-${moment(filterByMonth)
                .add(1, "month")
                .format("MM")}-01T00:00:00.000Z`,
            ],
          },
        };
      } else if (filterByMonth) {
        searchByMonthOrYear = {
          createdAt: {
            [Op.between]: [
              `${moment().format("YYYY")}-${moment(filterByMonth).format(
                "MM"
              )}-01T00:00:00.000Z`,
              `${moment().format("YYYY")}-${moment(filterByMonth)
                .add(1, "month")
                .format("MM")}-01T00:00:00.000Z`,
            ],
          },
        };
      } else if (filterByYear) {
        searchByMonthOrYear = {
          createdAt: {
            [Op.between]: [
              `${filterByYear}-01-01T00:00:00.000Z`,
              `${filterByYear}-12-31T23:59:59.000Z`,
            ],
          },
        };
      }

      const findOutRevenue = await Inventory.findAll({
        where: {
          ...searchByMonthOrYear,
        },
      });

      const revenueOutResult = findOutRevenue.reduce(
        (previousValue, currentValue) => {
          return (
            previousValue +
            currentValue.quantity * currentValue.buying_price
          );
        },
        0
      );

      const findInRevenue = await Transaction_items.sum("sub_total", {
        where: {
          ...searchByMonthOrYear
        }
      })

      return this.handleSuccess({
        message: "Get revenue",
        statusCode: 200,
        data: {
          outCome: revenueOutResult,
          inCome: findInRevenue,
        },
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
