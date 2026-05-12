const express = require('express');
const router = express.Router();
const studioController = require('../Controllers/companycontroller');

router.get('/', studioController.getStudios);

module.exports = router;