const router = require("express").Router()
const controllers = require("../middleware/controllers")
const { authorizedToken } = require("../middleware/authMiddleware")
const authService = require("../services/auth/index.js")

router.post("/register", controllers(authService.register))
router.get("/verify/:token", controllers(authService.verifyEmail))
router.post("/signin", controllers(authService.login))



module.exports = router