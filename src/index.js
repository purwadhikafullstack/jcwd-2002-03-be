const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT;
const { sequelize } = require("./lib/sequelize");
sequelize.sync({ alter: true });

const app = express();

app.use(cors());
app.use(express.json());

const {
  authRoutes,
  transactionRoutes,
  inventoryRoutes,
  profileRoutes,
  productRoutes,
  categoryRoutes,
  paymentRoutes
} = require("./routes");

app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/profile", profileRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes)
app.use("/payment", paymentRoutes)
app.use(
  "/profile-pictures",
  express.static(`${__dirname}/public/profile_pictures`)
);
app.use(
  "/products", express.static(`${__dirname}/public/products`)
)

app.listen(PORT, () => {
  console.log("Listening in PORT", PORT);
});
