const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// New Company
router.post('/', companyController.createCompany);

// Retreive Company
router.get('/:companyId', companyController.getCompanyDetails);

module.exports = router;
