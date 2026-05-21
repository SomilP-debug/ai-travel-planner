import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['food', 'transport', 'stay', 'entry', 'other'], required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;