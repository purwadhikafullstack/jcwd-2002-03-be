const router = require("express").Router();
const { authorizedToken } = require("../middlewares/authMiddleware");
const controllers = require("../middlewares/controllers");
const reportService = require("../services/report");

router.get(
  "/get-transaction-count",
  controllers(reportService.getTransactionCount)
);
router.get("/get-exp-product", controllers(reportService.getExpInfo));
router.get("/get-today-transaction", controllers(reportService.getTodayOrder));
router.get("/get-today-stock", controllers(reportService.getTodayStock));
router.post("/get-sales", controllers(reportService.getSales));
router.get("/get-today-revenue", controllers(reportService.getTodayRevenue));
router.post("/get-profit", controllers(reportService.getProfit));
router.post("/get-product-qty-sold", controllers(reportService.getProductSold))
router.get("/get-product-stock-history/:id", controllers(reportService.getProductStock))

module.exports = router;
