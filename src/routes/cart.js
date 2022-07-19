const router = require("express").Router();
const controllers = require("../middlewares/controllers");
const cartService = require("../services/cart");

router.post("/", controllers(cartService.addToCart));
router.get("/:UserId", controllers(cartService.getCart));
// router.get("/", controllers(cartService.getCartByUserId));
router.delete("/:id", controllers(cartService.deleteCart));

module.exports = router;
