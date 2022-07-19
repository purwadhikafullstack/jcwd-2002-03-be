const Service = require("../service")
const { Transaction, Transaction_items, Prescription_image, Product_image, Payment, Product, User, Address } = require("../../lib/sequelize");
const { Op } = require("sequelize");
const { nanoid } = require("nanoid")

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

            const checkAddress = await Address.findOne({
                where: {
                    UserId,
                    main_address: true

                }
            })

            const AddressId = checkAddress.dataValues.id
            const nomer_pesanan = nanoid(8)

            const buy = await Transaction.create({
                total_price: 0,
                isPaid: false,
                isPacking: false,
                isSend: false,
                isDone: false,
                UserId,
                AddressId,
                nomer_pesanan
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
    static getAllTransaction = async (req) => {
        try {
            const {
                _sortBy = "",
                _sortDir = "",
                _limit = 10,
                _page = 1,
            } = req.query

            delete req.query._limit;
            delete req.query._page;
            delete req.query._sortBy;
            delete req.query._sortDir;

            const findTransactions = await Transaction.findAndCountAll({
                where: {
                    ...req.query
                },
                limit: _limit ? parseInt(_limit) : undefined,
                offset: (_page - 1) * _limit,
                order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
                distinct: true,
                include: [
                    {
                        model: Address,
                    },
                    {
                        model: User,
                        attributes: ["name"]
                    },
                    {
                        model: Prescription_image
                    },
                    {
                        model: Transaction_items,
                        include: [
                            {
                                model: Product
                            }
                        ]
                    },
                    {
                        model: Payment
                    },

                ]
            })

            console.log(findTransactions)

            return this.handleSuccess({
                message: "get all product success",
                statusCode: 200,
                data: findTransactions
            })

        } catch (err) {
            console.log(err)
            return this.handleError({})
        }
    }
}

module.exports = TrasactionService