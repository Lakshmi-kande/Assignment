const express = require('express');
const router = express.Router();
const { signIn, signUp , getMe} = require('../controllers/userController');
const authenticateToken = require('../Token/auth');
router.use (authenticateToken);
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
router.get('/auth/me', authenticateToken, getMe);

module.exports = router;
