const router = require("express").Router()
const controllers = require("../middleware/controllers")
const { authorizedToken } = require("../middleware/authMiddleware")
const { registerValidation, validator, adminValidation } = require("../middleware/authValidator/registerValidator")
const authService = require("../services/auth/index.js")

router.post("/register", registerValidation, validator, controllers(authService.register))
router.get("/verify/:token", controllers(authService.verifyEmail))

// admin validator
router.post("/admin/register", registerValidation, validator, controllers(authService.adminRegister))
router.post("/admin/login", adminValidation, validator, controllers(authService.adminLogin))

module.exports = router