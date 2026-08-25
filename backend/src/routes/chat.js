import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateSendMessage } from '../middleware/validate.js';

const router = Router();

router.get('/', requireAuth, chatController.listChats);
router.get('/:chatId/messages', requireAuth, chatController.getMessages);
router.post('/:chatId/messages', requireAuth, validateSendMessage, chatController.sendMessage);
router.post('/:chatId/read', requireAuth, chatController.markChatRead);

export default router;
