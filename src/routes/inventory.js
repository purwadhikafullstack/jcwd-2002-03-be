const router = require("express").Router()
const { authorizedToken } = require("../middleware/authMiddleware")
const controllers = require("../middlewares/controllers")
const inventoryService = require("../services/inventory")

router.post("/add-stock", authorizedToken, controllers(inventoryService.addStockProduct))

module.exports = router