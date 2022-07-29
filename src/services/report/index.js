const Service = require("../service");
const { Op, Sequelize } = require("sequelize");
const {
  Transaction,
  Inventory,
  Stock_opname,
  sequelize,
  Transaction_items,
  Product,
  Admin,
  Product_image,
} = require("../../lib/sequelize");
const moment = require("moment");

const TODAY_START = new Date().setUTCHours(0, 0, 0, 0);
const NOW = new Date();
const endOfMonth = moment().endOf("month").format("YYYY-MM-DD hh:mm");
const nextThreeMonth = moment().add(3, "months");

class reportService extends Service {
  static getTransactionCount = async (req) => {
    try {
      let { isSend, isValid, isDone, isPaid, isPacking } = req.body;

      const findIsPaid = await Transaction.count({
        where: {
          isPaid: (isPaid = true),
          isPacking: false,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      const findIsPacking = await Transaction.count({
        where: {
          isPacking: (isPacking = true),
          isSend: false,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      const findIsSend = await Transaction.count({
        where: {
          isSend: (isSend = true),
          isDone: false,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      const findIsDone = await Transaction.count({
        where: {
          isDone: (isDone = true),
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      const findCancelOrder = await Transaction.count({
        where: {
          isValid: (isValid = false),
          isPaid: false,
          isPacking: false,
          isSend: false,
          isDone: false,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      return this.handleSuccess({
        message: "Get transaction",
        statusCode: 200,
        data: {
          findIsPaid,
          findIsPacking,
          findIsSend,
          findIsDone,
          findCancelOrder,
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
  static getExpInfo = async () => {
    try {
      const expProduct = await Inventory.findAll({
        where: {
          expired_date: {
            [Op.lt]: NOW,
          },
        },
        attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
        raw: true,
      });

      const expSoon = await Inventory.findAll({
        where: {
          expired_date: {
            [Op.between]: [NOW, endOfMonth],
          },
        },
        attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
        raw: true,
      });

      const expIn3Months = await Inventory.findAll({
        where: {
          expired_date: {
            [Op.between]: [endOfMonth, nextThreeMonth],
          },
        },
        attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
        raw: true,
      });

      const getData = {
        expStok: expProduct[0],
        expSoon: expSoon[0],
        expIn3Months: expIn3Months[0],
      };

      return this.handleSuccess({
        message: "Get product",
        data: getData,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getTodayOrder = async (req) => {
    try {
      const todayOrder = await Transaction.count({
        where: {
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      });

      const yesterdayOrder = await Transaction.count({
        where: {
          createdAt: {
            [Op.gt]: moment(TODAY_START).subtract(1, "day"),
            [Op.lt]: TODAY_START,
          },
        },
      });

      const getOrderData = {
        todayOrder,
        yesterdayOrder,
      };

      return this.handleSuccess({
        message: "Get transaction",
        statusCode: 200,
        data: getOrderData,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getTodayStock = async (req) => {
    try {
      const todayStock = await Stock_opname.findAll({
        attributes: [[Sequelize.fn("sum", Sequelize.col("amount")), "sum"]],
        raw: true,
      });

      const yesterdayStock = await Stock_opname.findAll({
        where: {
          updatedAt: {
            [Op.lt]: TODAY_START,
          },
        },
        attributes: [[Sequelize.fn("sum", Sequelize.col("amount")), "sum"]],
        raw: true,
      });

      const stockInfo = {
        todayStock: todayStock[0],
        yesterdayStock: yesterdayStock[0],
      };

      return this.handleSuccess({
        message: "Get stok",
        statusCode: 200,
        data: stockInfo,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getSales = async (req) => {
    try {
      const { stateOfDate = "Bulanan" } = req.body;

      let results, metadata;

      if (stateOfDate === "Mingguan") {
        [results, metadata] = await sequelize.query(
          "SELECT WEEK(createdAt) as `week`, sum(`quantity`) AS `sum` FROM `Transaction_items` AS `Transaction_items` GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC"
        );
      } else if (stateOfDate === "Bulanan") {
        [results, metadata] = await sequelize.query(
          "SELECT createdAt as `month`, sum(`quantity`) AS `sum` FROM `Transaction_items` AS `Transaction_items` WHERE YEAR (createdAt) = " +
          moment().format("YYYY") +
          " GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC"
        );
      } else if (stateOfDate === "Tahunan") {
        [results, metadata] = await sequelize.query(
          "SELECT createdAt as `year`, sum(`quantity`) AS `sum` FROM `Transaction_items` AS `Transaction_items` GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC"
        );
      }

      return this.handleSuccess({
        message: "Get sales",
        statusCode: 200,
        data: results,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getTodayRevenue = async (req) => {
    try {
      const todayRevenue = await Transaction_items.findAll({
        where: {
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
        attributes: [[Sequelize.literal("SUM(price * quantity)"), "result"]],
        raw: true,
      });

      const yesterdayRevenue = await Transaction_items.findAll({
        where: {
          createdAt: {
            [Op.gt]: moment(TODAY_START).subtract(1, "day"),
            [Op.lt]: TODAY_START,
          },
        },
        attributes: [[Sequelize.literal("SUM(price * quantity)"), "result"]],
        raw: true,
      });

      const revenue = {
        todayRevenue: todayRevenue[0],
        yesterdayRevenue: yesterdayRevenue[0],
      };

      return this.handleSuccess({
        message: "Today revenue",
        statusCode: 200,
        data: revenue,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getProfit = async (req) => {
    try {
      const { stateOfDate = "Bulanan" } = req.body;

      let revenue;
      let capital;

      if (stateOfDate === "Mingguan") {
        const [resultRevenue, metadata] = await sequelize.query(
          "SELECT WEEK(createdAt) as `week`, sum(price * quantity) AS `sum` FROM `Transaction_items` AS `Transaction_items` GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC"
        );

        const [resultCapital, metaData] = await sequelize.query(
          "SELECT Week(createdAt), sum(buying_price * quantity) AS `sum` FROM `inventories` AS `inventories` WHERE WEEK(createdAt) GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC"
        );

        capital = resultCapital;
        revenue = resultRevenue;
      } else if (stateOfDate === "Bulanan") {
        const [resultRevenue, metadata] = await sequelize.query(
          "SELECT createdAt as `month`, sum(price * quantity) AS `sum` FROM `Transaction_items` AS `Transaction_items` WHERE YEAR (createdAt) = " +
          moment().format("YYYY") +
          " GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC"
        );
        const [resultCapital, metaData] = await sequelize.query(
          "SELECT createdAt as `month`, sum(buying_price * quantity) AS `sum` FROM `inventories` AS `inventories` WHERE YEAR (createdAt) = " +
          moment().format("YYYY") +
          " GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC"
        );

        capital = resultCapital;
        revenue = resultRevenue;
      } else if (stateOfDate === "Tahunan") {
        const [resultRevenue, metadata] = await sequelize.query(
          "SELECT createdAt as `year`, sum(price * quantity) AS `sum` FROM `Transaction_items` AS `Transaction_items` GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC"
        );

        const [resultCapital, metaData] = await sequelize.query(
          "SELECT createdAt as `year`, sum(buying_price * quantity) AS `sum` FROM `inventories` AS `inventories` WHERE YEAR(createdAt) GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC"
        );

        capital = resultCapital;
        revenue = resultRevenue;
      }

      let data = {
        revenue,
        capital,
      };

      return this.handleSuccess({
        message: "Profit Found!",
        statusCode: 200,
        data,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getProductSold = async (req) => {
    try {
      const { stateOfDate = "Bulanan", ProductId } = req.body;

      let qtySold, yesterdayQtySold;

      if (stateOfDate === "Mingguan") {
        qtySold = await Transaction_items.findAll({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(1, "week"),
              [Op.lt]: NOW,
            },
            ProductId,
          },
          attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
          raw: true,
        });

        yesterdayQtySold = await Transaction_items.findAll({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(2, "weeks"),
              [Op.lt]: moment(TODAY_START).subtract(1, "week"),
            },
            ProductId,
          },
          attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
          raw: true,
        });
      } else if (stateOfDate === "Bulanan") {
        qtySold = await Transaction_items.findAll({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(1, "month"),
              [Op.lt]: NOW,
            },
            ProductId,
          },
          attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
          raw: true,
        });

        yesterdayQtySold = await Transaction_items.findAll({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(2, "months"),
              [Op.lt]: moment(TODAY_START).subtract(1, "month"),
            },
            ProductId,
          },
          attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
          raw: true,
        });
      } else if (stateOfDate === "Tahunan") {
        qtySold = await Transaction_items.findAll({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(1, "year"),
              [Op.lt]: NOW,
            },
            ProductId,
          },
          attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
          raw: true,
        });

        yesterdayQtySold = await Transaction_items.findAll({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(2, "years"),
              [Op.lt]: moment(TODAY_START).subtract(1, "year"),
            },
            ProductId,
          },
          attributes: [[Sequelize.fn("sum", Sequelize.col("quantity")), "sum"]],
          raw: true,
        });
      }

      const qtySoldData = {
        data: qtySold[0].sum,
        prevData: yesterdayQtySold[0].sum,
      };
      return this.handleSuccess({
        message: "Product Report Found",
        statusCode: 200,
        data: qtySoldData,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getProductStock = async (req) => {
    try {
      const { id } = req.params;

      const {
        _limit = 10,
        _page = 1,
        filterByMonth,
        filterByYear,
        filterByActivity,
      } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query.filterByMonth;
      delete req.query.filterByYear;
      delete req.query.filterByActivity;

      let searchByMonthOrYear = {};
      let whereActivityClause = {};

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

      if (filterByActivity) {
        whereActivityClause = {
          type: {
            [Op.like]: `%${filterByActivity}%`,
          },
        };
      }

      const findProduct = await Product.findByPk(id, {
        include: [
          {
            model: Product_image,
            attributes: ["image_url"],
          },
          {
            model: Inventory,
            where: {
              ...req.query,
              ...searchByMonthOrYear,
              ...whereActivityClause,
            },
            limit: _limit ? parseInt(_limit) : undefined,
            offset: (_page - 1) * _limit,
            distinct: true,
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: Admin,
              },
              {
                model: Product,
                attributes: ["selling_price"],
                include: Stock_opname,
              },
            ],
          },
        ],
      });

      const countData = await Product.findByPk(id, {
        attributes: ["id"],
        include: [
          {
            model: Inventory,
            attributes: [
              [Sequelize.fn("COUNT", Sequelize.col("quantity")), "count"],
            ],
          },
        ],
      });

      const count = countData.inventories[0];

      return this.handleSuccess({
        message: "Product found successfully",
        statusCode: 200,
        data: {
          findProduct,
          count,
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
  static getCancelOrder = async (req) => {
    try {
      const { stateOfDate = "Bulanan" } = req.body;

      let results, metadata;

      if (stateOfDate === "Mingguan") {
        [results, metadata] = await sequelize.query(
          "SELECT WEEK(createdAt) as `week`, count(*) AS `count` FROM `Transactions` AS `transactions` WHERE `isValid` = 0 GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC"
        );
      } else if (stateOfDate === "Bulanan") {
        [results, metadata] = await sequelize.query(
          "SELECT createdAt as `month`, count(*) AS `count` FROM `Transactions` AS `transactions` WHERE `isValid` = 0 AND YEAR (createdAt) = " +
          moment().format("YYYY") +
          " GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC"
        );
      } else if (stateOfDate === "Tahunan") {
        [results, metadata] = await sequelize.query(
          "SELECT createdAt as `year`, count(*) AS `count` FROM `Transactions` AS `transactions` WHERE `isValid` = 0 GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC"
        );
      }
      return this.handleSuccess({
        message: "Cancel transaction found",
        statusCode: 200,
        data: results,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  }
}

module.exports = reportService;
