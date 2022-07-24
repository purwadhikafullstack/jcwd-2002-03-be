const router = require("express").Router()
const PaymentService = require("../services/payment")
const controllers = require("../middlewares/controllers")
const fileUploader = require("../lib/uploader")
const { authorizedToken } = require("../middlewares/authMiddleware")

router.patch("/:TransactionId/payment-image",
    authorizedToken,
    fileUploader({
        destinationFolder: "payment_receipts",
        fileType: "image",
        prefix: "POST"
    }).single("payment_receipts"), controllers(PaymentService.addPaymentReceipt))

router.post("/payment", authorizedToken, controllers(PaymentService.createPayment))

module.exports = router