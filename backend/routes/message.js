const express = require('express');
const router = express.Router();
const messagecontroller = require('../controllers/message');
router.post('/project/:projectId/conversation/create', authenticateUser, createMessage);
router.get('/project/:projectId/conversation/read', authenticateUser, readMessages);
router.put('/project/:projectId/conversation/update/:messageId', authenticateUser, updateMessage);
router.delete('/project/:projectId/conversation/delete/:messageId', authenticateUser, deleteMessage);
