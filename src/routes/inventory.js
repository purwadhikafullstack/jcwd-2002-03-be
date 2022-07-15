const router = require("express").Router()
const { authorizedToken } = require("../middlewares/authMiddleware")
const controllers = require("../middlewares/controllers")
const inventoryService = require("../services/inventory")

router.post("/add-stock", authorizedToken, controllers(inventoryService.addStockProduct))
router.get("/sales-report", controllers(inventoryService.getSalesReport))

module.exports = router