const router = require("express").Router();
const fileUploader = require("../lib/uploader")
const controllers = require("../middleware/controllers");
const productService = require("../services/product");
const { validator, addProductValidation } = require("../middleware/validator/validator")

router.get("/", controllers(productService.getProduct));
router.get("/:id", controllers(productService.getProductById))
router.post("/newProduct", addProductValidation, validator, controllers(productService.addProduct))
router.post("/images/upload/:id", fileUploader({
    destinationFolder: "product", fileType: "image", prefix: "POST"
}).array("product_images", 5), controllers(productService.addProductImage))
router.delete("/delete/:id", controllers(productService.deleteProduct))

module.exports = router;
