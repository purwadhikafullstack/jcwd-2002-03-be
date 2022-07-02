const router = require("express").Router()
const categoryService = require("../services/category")
const controllers = require("../middleware/controllers")

router.post("/new-category", controllers(categoryService.addNewCategory))
router.get("/", controllers(categoryService.findAllCategory))

module.exports = router