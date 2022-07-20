const Service = require("../service");
const { User, Cart, Product, Product_image } = require("../../lib/sequelize");
class cartService extends Service {
  static getCart = async (req) => {
    try {
      const { UserId } = req.params;
      const findCart = await Cart.findAndCountAll({
        where: {
          UserId,
        },
        include: [
          {
            model: Product,
            // attributes: ["med_name", "discount"],
            include: [
              {
                model: Product_image,
                attributes: ["image_url"],
                // where: {
                //   id: 1,
                // },
              },
            ],
          },
        ],
      });
      console.log(findCart);
      return this.handleSuccess({
        message: "get cart was successfull",
        statusCode: 200,
        data: findCart,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static getCartByUserId = async (req) => {
    try {
      const { ProductId, UserId } = req.query;
      const findCart = await Cart.findOne({
        where: {
          UserId,
          ProductId,
        },
        include: [
          {
            model: Product,
            attributes: ["med_name", "discount"],
            include: [
              {
                model: Product_image,
                attributes: ["image_url"],
                where: {
                  id: 1,
                },
              },
            ],
          },
        ],
      });
      return this.handleSuccess({
        message: "get cart was successfull",
        statusCode: 200,
        data: findCart,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static addToCart = async (req) => {
    try {
      const { ProductId, UserId, quantity, price } = req.body;
      console.log("product", ProductId);
      console.log("userId", UserId);
      console.log("quan", quantity);
      console.log("harga", price);
      const findCart1 = await Cart.findOne({
        where: {
          UserId,
          ProductId,
        },
      });
      console.log(findCart1.id);
      if (findCart1) {
        await Cart.update(
          {
            quantity,
          },
          {
            where: {
              id: findCart1.id,
            },
          }
        );
      }
      if (!findCart1) {
        await Cart.create({
          ProductId,
          quantity,
          UserId,
          price,
        });
      }
      const findCart2 = await Cart.findOne({
        where: {
          UserId,
          ProductId,
        },
      });
      return this.handleSuccess({
        message: "added to cart was successfull",
        statusCode: 201,
        data: findCart2,
      });
    } catch (err) {
      console.log(err);
      this.handleError({
        message: "Server Error",
        statusCode: 500,
      });
    }
  };
  static deleteCart = async (req) => {
    try {
      const { id } = req.params;
      console.log(id);

      await Cart.destroy({
        where: {
          id,
        },
      });
      return this.handleSuccess({
        message: "delete cart was successfull",
        statusCode: 200,
        data: null,
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
module.exports = cartService;
