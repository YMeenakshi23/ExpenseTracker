const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
router.post('/add', expenseController.createExpense);
router.post('/settle', expenseController.settleDebt);

module.exports = router;