const router = require("express").Router()
const PaymentService = require("../services/payment")
const controllers = require("../middlewares/controllers")
const fileUploader = require("../lib/uploader")

router.patch("/payment-image",
    fileUploader({
        destinationFolder: "payment_receipts",
        fileType: "image",
        prefix: "POST"
    }).single("payment_receipt"), controllers(PaymentService.addPaymentTransaction))

module.exports = router