const express = require('express');
const router = express.Router();
const {createRole, getAll} = require('../controllers/roleController');

router.post('/', createRole, getAll);
router.get('/', getAll);

module.exports = router;

