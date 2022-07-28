const { Payment, Transaction } = require("../../lib/sequelize")
const Service = require("../service")

class PaymentService extends Service {
    static addPaymentReceipt = async (req) => {
        try {
            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
            const filePath = "payment_receipts";
            const UserId = req.token.id;
            const { filename } = req.file

            const { TransactionId } = req.params
            const { method } = req.body
            const image_url = `${uploadFileDomain}/${filePath}/${filename}`

            const findPaymentId = await Payment.findOne({
                where: {
                    TransactionId
                }
            })

            if (findPaymentId) {
                const paidTransaction = await Payment.update({
                    image_url,
                    method,
                }, {
                    where: {
                        TransactionId
                    }
                })

                return this.handleSuccess({
                    message: "upload payment receipt success",
                    statusCode: 201,
                    data: paidTransaction
                })
            }

            const createPayment = await Payment.create({
                image_url,
                method,
                TransactionId
            })
            return this.handleSuccess({
                message: "upload payment receipt success",
                statusCode: 201,
                data: createPayment
            })
        } catch (err) {
            console.log(err)
            return this.handleError({})
        }
    }
    static createPayment = async (req) => {
        try {
            const { ongkos_kirim, AddressId, kurir, TransactionId } = req.body

            if (!ongkos_kirim || !kurir) {
                return this.handleError({
                    message: "Kurir belum di pilih",
                    statusCode: 404,
                })
            }
            if (!AddressId) {
                return this.handleError({
                    message: "Alamat belum dipilih atau data tidak valid",
                    statusCode: 404,
                })
            }

            const updateongkirAndAddress = await Transaction.update({
                ongkos_kirim,
                AddressId,
                kurir
            }, {
                where: {
                    id: TransactionId
                }
            })

            const cekPayment = await Payment.findOne({
                where: {
                    TransactionId
                }
            })

            if (cekPayment) {
                await Payment.update({
                    methode: "BCA VA",
                }, {
                    where: {
                        TransactionId
                    }
                })
            }

            const payment = await Payment.create({
                methode: "BCA VA",
                TransactionId
            })

            return this.handleSuccess({
                message: "Pilih Pembayaran Berhasil",
                statusCode: 201,
            })
        } catch (err) {
            console.log(err)
            return this.handleError({})
        }
    }
}

module.exports = PaymentService