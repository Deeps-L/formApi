// models/Form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobileNo: String,
    email: String,
    loginId: { type: String, unique: true }, 
    address: {
      street: String,
      city: String,
      state: String,
      country: String
    },
  
    password: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const FormModel = mongoose.model('Form', formSchema);

module.exports = FormModel;
