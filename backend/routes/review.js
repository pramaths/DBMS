const express = require('express');
const router = express.Router();
const docs = require('../controllers/Reviews');
router.post('/submitreview/:projectId',  docs.review);
module.exports=router