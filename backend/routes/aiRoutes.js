import express from 'express';
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHstory
} from '../controllers/aiController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

//All routes are protected
router.use(protect);

router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-quiz', generateQuiz);
router.post('/generate-summary', generateSummary);
router.post('/chat', chat);
router.post('/explain-concept', explainConcept);
router.get('/chat-history', getChatHstory);

export default router;