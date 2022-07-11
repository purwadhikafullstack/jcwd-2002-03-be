const router = require("express").Router()
const controllers = require("../middlewares/controllers")
const TransactionService = require("../services/transaction")
const fileUploder = require("../lib/uploader")
const { authorizedTokenAdmin } = require("../middlewares/authMiddlewareAdmin")
const { authorizedToken } = require("../middlewares/authMiddleware")

router.post("/prescription",
    authorizedToken,
    fileUploder({
        destinationFolder: "prescriptions",
        fileType: "image",
        prefix: "POST"
    }).array("prescriptions"), controllers(TransactionService.newTransactionByPrescription))
router.get("/", authorizedTokenAdmin, controllers(TransactionService.getAllTransaction))

module.exports = router