const router = require("express").Router()
const controllers = require("../middleware/controllers")
const { authorizedToken } = require("../middleware/authMiddleware")
const authService = require("../services/auth/index.js")

router.post("/signup", controllers(authService.register))
router.post("/signin", controllers(authService.login))



module.exports = router