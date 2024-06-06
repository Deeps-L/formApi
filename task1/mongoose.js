//here you are connecting your database
const mongoose = require ("mongoose");

const connection = mongoose.connect('mongodb://localhost:27017/mydatabase')
module.exports = connection;
