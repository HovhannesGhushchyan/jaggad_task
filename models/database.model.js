const { Sequelize, DataTypes } = require("sequelize");

// Initialize the database connection
const sequelize = new Sequelize('notification', 'user', 'password', {
    dialect: 'postgres',
    host: 'localhost',
});


const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

const Notification = sequelize.define('Notification', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = { User, Notification }