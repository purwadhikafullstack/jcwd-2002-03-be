const { Sequelize } = require('sequelize');
const mysqlConfig = require('../config/database');

const sequelize = new Sequelize({
    username: mysqlConfig.MYSQL_USERNAME,
    password: mysqlConfig.MYSQL_PASSWORD,
    database: mysqlConfig.MYSQL_DB_NAME,
    port: 3306,
    dialect: 'mysql',
    logging: false,
});

// models
const Address = require("../models/address")(sequelize)
const Cart = require("../models/cart")(sequelize)
const Category = require("../models/categories")(sequelize)
const Inventory = require("../models/inventory")(sequelize)
const Order = require("../models/order")(sequelize)
const Product = require("../models/product")(sequelize)
const Report = require("../models/report")(sequelize)
const Stock_detail = require("../models/stock_detail")(sequelize)
const Type = require("../models/type")(sequelize)
const User = require("../models/user")(sequelize)

// Associations

// 1:M
Address.belongsTo(User)
User.hasMany(Address)
Inventory.belongsTo(Stock_detail)
Stock_detail.hasMany(Inventory)
Product.hasMany(Stock_detail)
Report.hasMany(Order)
Order.belongsTo(Report)
Report.hasMany(Stock_detail)
Stock_detail.belongsTo(Report)


// M:N
Product.belongsToMany(User, { through: Order })
Product.belongsToMany(User, { through: Cart, as: "user_cart" })
Stock_detail.belongsToMany(Product, { through: Inventory })
Category.belongsToMany(Product, { through: "product_category" })
Type.belongsToMany(Product, { through: "product_type" })



module.exports = {
    Address,
    Cart,
    Category,
    Inventory,
    Order,
    Product,
    Report,
    Stock_detail,
    Type,
    User,
    sequelize
}