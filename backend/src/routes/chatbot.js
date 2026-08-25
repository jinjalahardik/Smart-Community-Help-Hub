import { Router } from 'express';
import { getChatbotResponse } from '../services/chatbot.js';
import { validateChatbot } from '../middleware/validate.js';

const router = Router();

router.post('/', validateChatbot, (req, res) => {
  const { message } = req.body;
  const reply = getChatbotResponse(message);
  res.json(reply);
});

export default router;
