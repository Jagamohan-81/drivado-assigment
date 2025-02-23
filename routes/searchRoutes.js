const express = require('express');
const router = express.Router();

const User = require('../models/userModel');
const Company = require('../models/companyModel');

// GET /search?query=<searchTerm>
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Please provide a query parameter' });
    }

    // -- 1) Search Users (by name or email) --
    // We'll do a case-insensitive partial match using regex (not super optimized).
    // For large-scale, consider text indexes or $search with Atlas Search.
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('company')
      .limit(20); // Limit if you want to keep performance

    // Transform user results
    const userResults = users.map(u => ({
      type: 'user',
      userDetails: {
        name: u.name,
        email: u.email,
        role: u.role
      },
      companyDetails: {
        companyName: u.company ? u.company.name : null,
        parentHierarchy: u.company ? u.company.parentCompany : null
      }
    }));

    // -- 2) Search Companies (by name) --
    const companies = await Company.find({
      name: { $regex: query, $options: 'i' }
    }).limit(20);

    // For each matched company, we also want to show up to 5 users
    // You can get fancy with Mongoose aggregation,
    // but here's a straightforward approach:
    const companyResults = [];
    for (let c of companies) {
      const associatedUsers = await User.find({ company: c._id }).limit(5);
      companyResults.push({
        type: 'company',
        companyName: c.name,
        hierarchyLevel: c.hierarchyLevel,
        parentCompany: c.parentCompany,
        associatedUsers: associatedUsers.map(u => ({
          name: u.name,
          email: u.email,
          role: u.role
        }))
      });
    }

    // Combine all results
    const results = [...userResults, ...companyResults];

    return res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
