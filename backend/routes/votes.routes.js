import express from 'express';
import { voteOnActivity } from '../controllers/votes.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/:id').post(protect, voteOnActivity);

export default router;