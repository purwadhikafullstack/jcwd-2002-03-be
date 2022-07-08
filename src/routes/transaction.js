const router = require("express").Router()
const controllers = require("../middlewares/controllers")
const TransactionService = require("../services/transaction")
const fileUploder = require("../lib/uploader")
const { authorizedToken } = require("../middlewares/authMiddleware")

router.post("/prescription",
    authorizedToken,
    fileUploder({
        destinationFolder: "prescriptions",
        fileType: "image",
        prefix: "POST"
    }).array("prescriptions"), controllers(TransactionService.newTransactionByPrescription))


module.exports = router