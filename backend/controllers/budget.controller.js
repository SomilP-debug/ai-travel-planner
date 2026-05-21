import Expense from '../models/Expense.model.js';

export const addExpense = async (req, res) => {
  const { amount, category, description } = req.body;
  try {
    const expense = await Expense.create({
      trip: req.params.tripId,
      paidBy: req.user._id,
      amount,
      category,
      description
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId }).populate('paidBy', 'name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};