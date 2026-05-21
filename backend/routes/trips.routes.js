import express from 'express';
import { createTrip, getMyTrips, inviteCollaborator,joinTrip,deleteTrip ,getTripById,addPhotoToTrip} from '../controllers/trips.controller.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.route('/').post(protect, aiLimiter, createTrip).get(protect, getMyTrips);
router.route('/:id/invite').post(protect, inviteCollaborator);
router.route('/:id/join').post(protect, joinTrip);

router.route('/:id').get(protect, getTripById).delete(protect, deleteTrip);
router.route('/:id/photos').post(protect, addPhotoToTrip);
export default router;