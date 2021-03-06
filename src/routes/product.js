const router = require("express").Router();
const fileUploader = require("../lib/uploader");
const controllers = require("../middlewares/controllers");
const productService = require("../services/product");
const { validator, addProductValidation } = require("../middlewares/validator/validator");
const { authorizedTokenAdmin } = require("../middlewares/authMiddlewareAdmin")

router.get("/", controllers(productService.getProduct));
router.get("/:id", controllers(productService.getProductById))
router.post("/newProduct", authorizedTokenAdmin, addProductValidation, validator, controllers(productService.addProduct))
router.post("/images/upload/:id", authorizedTokenAdmin,
  fileUploader({
    destinationFolder: "products",
    fileType: "image",
    prefix: "POST"
  }).array("product_images"), controllers(productService.addProductImage))
router.delete("/delete/:id", authorizedTokenAdmin, controllers(productService.deleteProduct))
router.delete("/:ProductId/images/:id", authorizedTokenAdmin, controllers(productService.deleteProductImage))
router.patch("/:id/update-data", authorizedTokenAdmin, controllers(productService.updateProduct))

module.exports = router;
