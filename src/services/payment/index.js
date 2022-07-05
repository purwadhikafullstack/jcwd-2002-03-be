const { Payment } = require("../../lib/sequelize")
const Service = require("../service")

class PaymentService extends Service {
    static addPaymentTransaction = async (req) => {
        try {

            const { image_url, method, TransactionId } = req.body

            const paidTransaction = await Payment.update({
                image_url,
                method,
            }, {
                where: {
                    TransactionId
                }
            })
            return this.handleSuccess({
                message: "proof of payment received",
                statusCode: 201
            })
        } catch (err) {
            return this.handleError({})
        }
    }
}

module.exports = PaymentService