const express = require('express');
const router = express.Router();
const docs = require('../controllers/doc');
router.post("/postDoc/:project_id",docs.createDoc)
router.get('/verify-completion/:project_id/:token', docs.verifyCompletion);
router.post('/send-verification/:projectId', docs.sendVerificationEmail);
module.exports=router