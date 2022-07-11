const Service = require("../service");
const { Product, Inventory, Stock_opname } = require("../../lib/sequelize");
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
}

module.exports = inventoryService;