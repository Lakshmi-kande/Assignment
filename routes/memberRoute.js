const express = require('express');
const router = express.Router();
const {addMember, removeMember} = require('../controllers/memberController');
const authenticateToken = require('../Token/auth');

router.post('/member',authenticateToken, addMember);

router.delete('/member/:id',authenticateToken, removeMember);
module.exports = router;
