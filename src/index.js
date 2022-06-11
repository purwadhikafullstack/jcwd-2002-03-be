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

app.listen(PORT, () => {
    console.log('Listening in PORT', PORT);
});