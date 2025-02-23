const User = require('../models/userModel');
const Company = require('../models/companyModel');

exports.createUser = async (req, res) => {
  try {
    const { name, email, companyId } = req.body;
    
    // Check that the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Create user
    const newUser = new User({
      name,
      email,
      company: companyId
    });
    
    const savedUser = await newUser.save();
    
    return res.status(201).json({
      userId: savedUser._id,
      companyId: savedUser.company,
      role: savedUser.role
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('company');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // user.company is populated with the company document
    const companyInfo = {
      _id: user.company._id,
      name: user.company.name,
      hierarchyLevel: user.company.hierarchyLevel,
      parentCompany: user.company.parentCompany
    };
    
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: companyInfo
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
