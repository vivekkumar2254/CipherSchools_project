import express from 'express';
import { executeUserQuery, getHint } from '../controllers/queryController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/execute', optionalAuth, executeUserQuery);

router.post('/hint/:assignmentId', optionalAuth, getHint);

export default router;
