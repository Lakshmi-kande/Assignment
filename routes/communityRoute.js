const express = require('express');
const router = express.Router();
const { createCommunity, getAll, getMyOwnedCommunity, getMyJoinedCommunity } = require('../controllers/communityController');
const authenticateToken = require('../Token/auth');

router.post('/community', authenticateToken, createCommunity);

router.get('/community', authenticateToken, getAll);
router.get('/community/:id/members', authenticateToken, getAll);
router.get('/community/me/owner', authenticateToken, getMyOwnedCommunity);
router.get('/community/me/member', authenticateToken, getMyJoinedCommunity);

module.exports = router;
