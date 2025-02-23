const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// POST /companies
router.post('/', companyController.createCompany);

// GET /companies/:companyId
router.get('/:companyId', companyController.getCompanyDetails);

module.exports = router;
