const { check, validationResult } = require("express-validator")

exports.registerValidation = [
    check("name").trim().notEmpty().withMessage("required")
        .isLength({ min: 5, max: 20 }).withMessage("name must be within 5 to 20 character"),
    check("email").notEmpty().withMessage("required")
        .isEmail().withMessage("Invalid email address"),
    check("password").notEmpty().withMessage("required")
        .matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*[._]).{8,}$/)
        .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character")
]

exports.validator = (req, res, next) => {
    const result = validationResult(req).array()
    if (!result.length) return next()

    const error = result[0].msg
    res.status(404).json({
        success: false,
        message: error
    })
}