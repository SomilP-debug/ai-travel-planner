import express from 'express';
import { addExpense, getExpenses } from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/:tripId').post(protect, addExpense).get(protect, getExpenses);

export default router;