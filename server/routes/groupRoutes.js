const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const expenseController = require('../controllers/expenseController');

router.post('/create', groupController.createGroup);
router.get('/user/:userId', groupController.getUserGroups);
router.get('/:groupId/members', groupController.getGroupMembers);
router.post('/add-member', groupController.addMember); 
router.post('/settle', expenseController.settleDebt);

module.exports = router;