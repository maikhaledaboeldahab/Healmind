const express = require('express');
const router = express.Router();
const { handleAIChat } = require('../controllers/rag.controller');

// Public or authenticated AI Assistant chat endpoint
router.post('/chat', handleAIChat);

module.exports = router;
