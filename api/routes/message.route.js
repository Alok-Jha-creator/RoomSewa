import express from 'express';
import {
  sendMessage,
  getMessages,
  getConversations,
  deleteMessage,
} from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// All routes protected
router.post('/send', verifyToken, sendMessage);
router.get('/conversations', verifyToken, getConversations);
router.get('/:receiverId/:propertyId', verifyToken, getMessages);
router.delete('/:id', verifyToken, deleteMessage);

export default router;