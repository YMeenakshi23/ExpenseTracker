const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

// Existing Balance Routes
router.get('/:userId', balanceController.getUserBalance);
router.get('/dues/:userId', balanceController.getIndividualDues);
router.get('/debts/:userId', balanceController.getIndividualDebts);

// NEW: This fixes the 404 error for Simplified Balances
router.get('/simplified/:userId', balanceController.getSimplifiedBalances); 

// Settlement Route
router.post('/settle', balanceController.settleDebt);

module.exports = router;