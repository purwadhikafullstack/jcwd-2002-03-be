const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const { sequelize } = require('./lib/sequelize');
sequelize.sync({ alter: true });

const app = express();

app.use(cors());
app.use(express.json());

const { authRoutes, transactionRoutes, inventoryRoutes } = require("./routes")

app.use("/auth", authRoutes)
app.use("/transaction", transactionRoutes)
app.use("/inventory", inventoryRoutes)

app.listen(PORT, () => {
    console.log('Listening in PORT', PORT);
});