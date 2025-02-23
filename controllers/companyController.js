const Company = require('../models/companyModel');
const User = require('../models/userModel');

// Helper: Recursively build sub-company data
async function fetchSubCompanies(companyId) {
  // Find direct children
  const children = await Company.find({ parentCompany: companyId });
  
  // For each child, recursively find its children
  const subCompanies = [];
  for (const child of children) {
    const subOfChild = await fetchSubCompanies(child._id);
    subCompanies.push({
      _id: child._id,
      name: child.name,
      hierarchyLevel: child.hierarchyLevel,
      subCompanies: subOfChild
    });
  }
  return subCompanies;
}

exports.createCompany = async (req, res) => {
  try {
    const { name, parentCompanyId } = req.body;
    let hierarchyLevel = 1;
    
    if (parentCompanyId) {
      // Find the parent company to get its hierarchy level
      const parentCompany = await Company.findById(parentCompanyId);
      if (!parentCompany) {
        return res.status(404).json({ error: 'Parent company not found' });
      }
      hierarchyLevel = parentCompany.hierarchyLevel + 1;
    }
    
    const newCompany = new Company({
      name,
      parentCompany: parentCompanyId || null,
      hierarchyLevel
    });
    
    const savedCompany = await newCompany.save();
    
    return res.status(201).json({
      companyId: savedCompany._id,
      hierarchyLevel: savedCompany.hierarchyLevel
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Recursively fetch all sub-companies
    const subCompanies = await fetchSubCompanies(companyId);
    
 
    const users = await User.find({ company: companyId });
    
    return res.status(200).json({
      _id: company._id,
      name: company.name,
      hierarchyLevel: company.hierarchyLevel,
      users: users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role
      })),
      subCompanies
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
