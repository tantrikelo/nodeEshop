const dotenv = require("dotenv");
dotenv.config();
//constractor
const Sequelize = require("sequelize");

//class
const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{ dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;
