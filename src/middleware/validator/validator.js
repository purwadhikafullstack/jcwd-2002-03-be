const { check, validationResult } = require("express-validator")

exports.registerValidation = [
    check("name").trim().notEmpty().withMessage(" name required")
        .isLength({ min: 5, max: 20 }).withMessage("name must be within 5 to 20 character"),
    check("email").notEmpty().withMessage("email required")
        .isEmail().withMessage("Invalid email address"),
    check("password").notEmpty().withMessage("password required")
        .matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*[._]).{8,}$/)
        .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character")
]


exports.adminValidation = [
    check("email").notEmpty().withMessage("email required")
        .isEmail().withMessage("Invalid email address"),
    check("password").notEmpty().withMessage("password required")
        .matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*[._]).{8,}$/)
        .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character")
]
exports.addProductValidation = [
    check("med_name").notEmpty().withMessage("med_name required"),
    check("nomer_med").notEmpty().withMessage("nomer_med required"),
    check("nomer_bpom").notEmpty().withMessage("nomer_bpom required"),
    check("selling_price").notEmpty().withMessage("selling_price required").isNumeric().withMessage("input number"),
    check("discount").isFloat().withMessage("input discount in decimal"),
    check("categoryId").notEmpty().withMessage("category required"),
    check("kemasan").notEmpty().withMessage("jenis kemasan require"),
    check("kandungan").notEmpty().withMessage("jenis kemasan require")
]

exports.validator = (req, res, next) => {
    const result = validationResult(req).array()
    if (!result.length) return next()

    const error = result[0].msg
    return res.status(404).json({
        success: false,
        message: error
    })
}