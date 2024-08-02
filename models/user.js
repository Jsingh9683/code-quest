const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Assuming you want to require this field
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  parentPassword: {
    type: String,
    required: false, // This field is optional
  },
  childPassword: {
    type: String,
    required: false, // This field is optional
  },


});

const User = mongoose.model('User', userSchema);

module.exports = User;
