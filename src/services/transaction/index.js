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

      if (!selectedFile) {
        return this.handleError({
          message: "there's no picture selected",
          statusCode: 400,
        });
      }

      const checkAddress = await Address.findOne({
        where: {
          UserId,
          main_address: true,
        },
      });

      if (!checkAddress) {
        return this.handleError({
          message: "verify success",
          redirect: `http://localhost:3000/address-form`
        })
      }

      const AddressId = checkAddress.dataValues.id;

      const buy = await Transaction.create({
        isValid: true,
        nomer_pesanan,
        total_price: 0,
        isPaid: false,
        isDone: false,
        isSend: false,
        isPacking: false,
        UserId,
        AddressId,
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

      console.log("query", req.query)

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
      if (isDone === "true") { whereCondition.isPacking = true; }
      if (isDone === "false") { whereCondition.isPacking = false; }
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
      console.log(findTransactions)

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
      console.log(data);
      const addTransactionItems = await Transaction_items.bulkCreate(data);
      console.log("items", addTransactionItems);

      const totalPriceAllItems = data.reduce((sum, object) => {
        return sum + object.sub_total;
      }, 0);

      console.log({ subtotal: totalPriceAllItems });

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

      console.log("update", updateTrasactions);

      const createPayment = await Payment.create({
        TransactionId: data[0].TransactionId,
        AdminId: req.token.id,
        method: "BCA VA",
      });
      console.log("payment", createPayment);

      return this.handleSuccess({
        message: "Order with a doctor's prescription successfully handled",
        statusCode: 201,
        data: addTransactionItems,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({});
    }
  }
  static getAllUserTransaction = async (req) => {
    // setiap query ato params datanya pasti string
    // console.timeEnd()
    // console.time()

    try {
      const { isPacking, isSend, isValid, isDone, isPaid } = req.query;
      console.log(req.query);
      delete req.query._isDone;
      delete req.query._isPacking;
      delete req.query._isSend;
      delete req.query._isValid;
      delete req.query._isPaid;
      delete req.query.isAll;
      let whereCondition = { ...req.query, UserId: 2 };
      if (isPaid) whereCondition.isPaid = true;

      if (isPacking) whereCondition.isPacking = true;

      if (isDone) whereCondition.isPacking = true;

      if (isSend) whereCondition.isSend = true;

      if (isValid) whereCondition.isValid = true;

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
      // const UserId = req.token.id;
      const UserId = 2;
      // const { method } = req.body;
      const data = req.body;
      console.log(req.body);
      const checkAddress = await Address.findOne({
        where: {
          UserId,
          main_address: true,
        },
      });
      const AddressId = checkAddress.dataValues.id;

      const createTransaction = await Transaction.create({
        total_price: data.grandTotal,
        isPaid: false,
        isPacking: false,
        isSend: false,
        isDone: false,
        UserId,
        AddressId,
      });
      await Transaction_items.bulkCreate(data);
      const findTransaction = await Transaction.findOne({
        where: {
          UserId,
        },
      });

      const TransactionId = findTransaction.dataValues.id;
      await Payment.create({
        TransactionId,
        method,
      });
      await Cart.destroy({
        where: {
          id: [],
        },
      });

      return this.handleSuccess({
        message: "transaction sumbit success",
        statusCode: 201,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
}

module.exports = TrasactionService;
