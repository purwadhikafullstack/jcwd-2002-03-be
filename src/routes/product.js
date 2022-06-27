const router = require("express").Router();
const controllers = require("../middleware/controllers");
const productService = require("../services/product");

router.get("/", controllers(productService.getProduct));
router.post("/", )

module.exports = router;
