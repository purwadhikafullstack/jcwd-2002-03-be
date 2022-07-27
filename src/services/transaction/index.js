const Service = require("../service");
const {
  Transaction,
  Transaction_items,
  Prescription_image,
  Product_image,
  Payment,
  Product,
  User,
  Address,
  Category,
  Cart,
  Inventory,
  Stock_opname
} = require("../../lib/sequelize");
const { Op } = require("sequelize");
const { nanoid } = require("nanoid");

class TrasactionService extends Service {
  static newTransactionByPrescription = async (req) => {
    try {
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "prescriptions";
      const UserId = req.token.id;
      const selectedFile = req.files;

      const nomer_pesanan = nanoid(8);

      if (selectedFile.length === 0) {
        return this.handleError({
          message: "there's no picture selected",
          statusCode: 400,
        });
      }

      const buy = await Transaction.create({
        isValid: true,
        nomer_pesanan,
        total_price: 0,
        isPaid: false,
        isDone: false,
        isSend: false,
        isPacking: false,
        UserId,
      });

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
        data: buy
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  };
  static getAllTransaction = async (req) => {
    try {
      const {
        _sortBy = "",
        _sortDir = "",
        _limit = "",
        _page = "",
        isPacking,
        isSend,
        isValid,
        isDone,
        isPaid,
        searchName,
      } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;
      delete req.query.isDone;
      delete req.query.isPacking;
      delete req.query.isSend;
      delete req.query.isValid;
      delete req.query.isPaid;
      delete req.query.searchName;

      let searchByNameClause = {};
      let whereCondition = { ...req.query };
      if (isPaid === "false") { whereCondition.isPaid = false }
      if (isPaid === "true") { whereCondition.isPaid = true }
      if (isPacking === "false") { whereCondition.isPacking = false; }
      if (isPacking === "true") { whereCondition.isPacking = true; }
      if (isDone === "true") { whereCondition.isDone = true; }
      if (isDone === "false") { whereCondition.isDone = false; }
      if (isSend === "true") whereCondition.isSend = true;
      if (isSend === "false") whereCondition.isSend = false;
      if (isValid === "true") whereCondition.isValid = true;
      if (isValid === "false") whereCondition.isValid = false;

      if (searchName) {
        searchByNameClause = {
          name: { [Op.like]: `%${searchName}%` },
        };
      }

      const findTransactions = await Transaction.findAndCountAll({
        where: whereCondition,
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
            attributes: ["name"],
            where: {
              ...req.query,
              ...searchByNameClause,
            },
          },
          {
            model: Prescription_image,
          },
          {
            model: Transaction_items,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: Product_image,
                  },
                  {
                    model: Category,
                  },
                ],
              },
            ],
          },
          {
            model: Payment,
          },
        ],
      });

      const result = {
        ...findTransactions,
        totalPages: Math.ceil(findTransactions.count / _limit),
      };

      return this.handleSuccess({
        message: "get all product success",
        statusCode: 200,
        data: result,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  };
  static addTransactionItemsByAdmin = async (req) => {
    try {
      const data = req.body;
      const addTransactionItems = await Transaction_items.bulkCreate(data);

      const findAllTransactionItems = await Transaction_items.findAll({
        where: {
          TransactionId: data[0].TransactionId
        }
      })

      const totalPriceAllItems = findAllTransactionItems.reduce((sum, object) => {
        return sum + object.sub_total;
      }, 0);

      const updateTrasactions = await Transaction.update(
        {
          total_price: totalPriceAllItems,
          AdminId: req.token.id,
          isValid: true,
        },
        {
          where: {
            id: data[0].TransactionId,
          },
        }
      );

      data.forEach(async (val) => {
        await Stock_opname.increment({
          amount: val.quantity * -1
        }, {
          where: {
            id: val.ProductId
          }
        })
      })

      const dataWithType = data.map((val) => {
        return { ...val, type: "keluar" }
      })

      const createLog = await Inventory.bulkCreate(dataWithType)

      const createPayment = await Payment.create({
        TransactionId: data[0].TransactionId,
        AdminId: req.token.id,
        method: "BCA VA",
      });

      return this.handleSuccess({
        message: "Order with a doctor's prescription successfully handled",
        statusCode: 201,
        data: addTransactionItems,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  };
  static getAllUserTransaction = async (req) => {
    // setiap query ato params datanya pasti string

    try {
      const { isPacking, isSend, isValid, isDone, isPaid } = req.query;
      delete req.query.isDone;
      delete req.query.isPacking;
      delete req.query.isSend;
      delete req.query.isValid;
      delete req.query.isPaid;
      delete req.query.isAll;

      let whereCondition = { ...req.query, UserId: req.token.id };
      if (isPaid === "false") { whereCondition.isPaid = false }
      if (isPaid === "true") { whereCondition.isPaid = true }
      if (isPacking === "false") { whereCondition.isPacking = false; }
      if (isPacking === "true") { whereCondition.isPacking = true; }
      if (isDone === "true") { whereCondition.isPacking = true; }
      if (isDone === "false") { whereCondition.isPacking = false; }
      if (isSend === "true") whereCondition.isSend = true;
      if (isSend === "false") whereCondition.isSend = false;
      if (isValid === "true") whereCondition.isValid = true;
      if (isValid === "false") whereCondition.isValid = false;

      const findTransactions = await Transaction.findAndCountAll({
        where: whereCondition,
        distinct: true,
        include: [
          {
            model: Address,
          },
          {
            model: Prescription_image,
          },
          {
            model: Transaction_items,
            include: {
              model: Product,
              include: {
                model: Product_image,
              },
            },
          },
          {
            model: Payment,
          },
        ],
      });

      console.log(findTransactions)
      return this.handleSuccess({
        message: "get all transaction success",
        statusCode: 200,
        data: findTransactions,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static createTransaction = async (req) => {
    try {
      const data = req.body;
      const nomer_pesanan = nanoid(8)
      const UserId = req.token.id

      const cardId = data.map(val => val.id)

      // destroy cart
      const destroyCart = await Cart.destroy({
        where: {
          id: cardId
        }
      })

      // delete all cartId in data 
      data.forEach((val) => delete val.id)

      // sum all sub_total transaction items
      const totalPriceAllItems = data.reduce((sum, object) => {
        return sum + object.sub_total;
      }, 0);

      const createTransaction = await Transaction.create({
        total_price: totalPriceAllItems,
        nomer_pesanan,
        isPaid: false,
        isPacking: false,
        isSend: false,
        isDone: false,
        isValid: true,
        UserId,
        ongkos_kirim: 0
      })

      const transactionId = createTransaction.dataValues.id

      const dataWithTransactionId = data.map((val) => {
        delete val.Product
        return { ...val, TransactionId: transactionId, type: "keluar" }
      })

      const addTransactionItems = await Transaction_items.bulkCreate(dataWithTransactionId);

      // decrement every stock opname
      dataWithTransactionId.forEach(async (val) => {
        await Stock_opname.increment({
          amount: val.quantity * -1
        }, {
          where: {
            id: val.ProductId
          }
        })
      })

      const createLog = await Inventory.bulkCreate(dataWithTransactionId)

      return this.handleSuccess({
        message: "transaction sumbit success",
        statusCode: 201,
        data: transactionId
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  };
  static approveTransaction = async (req) => {
    try {
      const { TransactionId } = req.params
      const data = req.body
      const approve = await Transaction.update(
        data
        , {
          where: {
            id: TransactionId
          }
        })
      return this.handleSuccess({
        message: "transaction approve success",
        data: approve,
        statusCode: 201
      })
    } catch (err) {
      return this.handleError({})
    }
  }
  static rejectTransactionAutomaticByUserId = async (req) => {
    try {
      let UserId = req.token.id
      const findTransaction = await Transaction.findAll({
        where: {
          UserId,
          isValid: true
        }
      })

      if (findTransaction.length === 0) {
        return this.handleSuccess({
          message: "This user has no transactions yet",
          statusCode: 200,
        })
      }

      const expiredTransaction = findTransaction.map((val) => {
        const createdDate = new Date(val.dataValues.createdAt)
        const dueDate = createdDate.setDate(createdDate.getDate() + 1)
        if (Date.now() > dueDate) {
          return val.dataValues.id
        }
      })

      const filterId = expiredTransaction.filter((obj) => {
        return obj !== undefined
      })

      if (filterId.length === 0) {
        return this.handleSuccess({
          message: "no expired transaction",
          statusCode: 200,
        })
      }

      const invalidExpired = await Transaction.update({
        isValid: false,
      },
        {
          where: {
            id: filterId
          }
        }
      )

      return this.handleSuccess({
        message: "invalid transaction expired success",
        data: invalidExpired,
        statusCode: 201
      })
    } catch (err) {
      console.log(err)
      return this.handleError({})
    }
  }
  static getTransactionItems = async (req) => {
    try {
      const { id } = req.query
      const UserId = req.token.id

      delete req.query.id
      const isPrescription = await Prescription_image.findOne({ where: { TransactionId: parseInt(id) } })

      const getData = await Transaction.findOne({
        where: { id: parseInt(id), UserId },
        include: [
          {
            model: Transaction_items,
            include: {
              model: Product,
              include: {
                model: Product_image
              }
            }
          },
          { model: Prescription_image }
        ]
      })

      return this.handleSuccess({
        data: getData,
        message: "get data success",
        statusCode: 200
      })

    } catch (err) {
      console.log(err)
      return this.handleError({})
    }
  }
  static cancelTransaction = async (req) => {
    try {
      const data = req.body
      const AdminId = req.token.id

      const validatingTransaction = await Transaction.update({ isValid: false, AdminId }, { where: { id: data.id } })

      data.Transaction_items.forEach(async (val) => {
        await Stock_opname.increment({ amount: val.quantity, }, { where: { ProductId: val.ProductId } })
        await Inventory.create({
          quantity: val.quantity,
          type: "masuk",
          ProductId: val.ProductId,
          TransactionId: val.TransactionId,
          AdminId
        })
      })

      return this.handleSuccess({
        message: "Transaction canceled",
        statusCode: 201
      })
    } catch (err) {
      return this.handleError({})

    }
  }
}

module.exports = TrasactionService;
