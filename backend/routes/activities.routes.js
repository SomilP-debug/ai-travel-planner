import express from 'express';
import { getTripActivities, updateActivity } from '../controllers/activities.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/trip/:tripId').get(protect, getTripActivities);
router.route('/:id').put(protect, updateActivity);

export default router;