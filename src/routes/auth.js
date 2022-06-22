const router = require("express").Router()
const controllers = require("../middleware/controllers")
const { authorizedToken } = require("../middleware/authMiddleware")
const { registerValidation, validator } = require("../middleware/authValidator/registerValidator")
const authService = require("../services/auth/index.js")

router.post("/register", registerValidation, validator, controllers(authService.register))
router.get("/verify/:token", controllers(authService.verifyEmail))
router.post("/signin", controllers(authService.login))



module.exports = router