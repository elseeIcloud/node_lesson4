const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Task = db.define('task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
});

module.exports = Task;
