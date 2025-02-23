const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  hierarchyLevel: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

companySchema.index({ name: "text" });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
