const express = require('express');
const router = express.Router();
const platformController = require('../Controllers/companyPlataform');  // O mejor renombra el controller

router.get('/', platformController.getPlatforms);  // ✅ getPlatforms

module.exports = router;