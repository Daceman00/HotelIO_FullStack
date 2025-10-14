const express = require('express');
const crmController = require('../controllers/crmController')
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.
    route('/')
    .get(crmController.getAllCrmEntrys)

router.
    route('/:id')
    .get(crmController.getCrmEntry)

module.exports = router;