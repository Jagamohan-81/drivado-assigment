const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  role: {
    type: String,
    default: 'User'
  }
}, { timestamps: true });

userSchema.index({ name: "text", email: "text" });

const User = mongoose.model('User', userSchema);

module.exports = User;
