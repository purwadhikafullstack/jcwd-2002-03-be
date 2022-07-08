const Service = require("../service")
const { Transaction, Transaction_items, Prescription_image } = require("../../lib/sequelize")

class TrasactionService extends Service {
    static newTransactionByPrescription = async (req) => {
        try {
            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
            const filePath = "prescriptions";
            const UserId = req.token.id
            const selectedFile = req.files

            if (!selectedFile) {
                return this.handleError({
                    message: "there's no picture selected",
                    statusCode: 400,
                });
            }

            const buy = await Transaction.create({
                total_price: 0,
                isPaid: false,
                isPacking: false,
                isSend: false,
                isDone: false,
                UserId,
            })

            const data = selectedFile.map((val) => {
                return {
                    TransactionId: buy.dataValues.id,
                    image_url: `${uploadFileDomain}/${filePath}/${val.filename}`,
                };
            });

            await Prescription_image.bulkCreate(data);

            return this.handleSuccess({
                message: "transaction sumbit success",
                statusCode: 201,
            })
        } catch (err) {
            console.log(err)
            return this.handleError({})
        }
    }
}

module.exports = TrasactionService