const router = require("express").Router();
const { authorizedToken } = require("../middlewares/authMiddleware");
const controllers = require("../middlewares/controllers");
const cartService = require("../services/cart");

router.post("/", authorizedToken, controllers(cartService.addToCart));
router.get("/", authorizedToken, controllers(cartService.getCart));
// router.get("/", controllers(cartService.getCartByUserId));
router.delete("/:id", controllers(cartService.deleteCart));

module.exports = router;
