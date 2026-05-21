import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function BudgetTracker({ tripId, totalBudget }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data } = await api.get(`/budget/${tripId}`);
      setExpenses(data);
    };
    fetchExpenses();
  }, [tripId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/budget/${tripId}`, { amount: Number(amount), category, description });
    setExpenses([...expenses, data]);
    setAmount(''); setDescription('');
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Group data for Pie Chart
  const chartData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) existing.value += exp.amount;
    else acc.push({ name: exp.category, value: exp.amount });
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div>
        <h2 className="text-2xl font-bold mb-4">Budget Tracker</h2>
        <div className="flex justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-xl font-bold">${totalBudget}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className={`text-xl font-bold ${totalBudget - totalSpent < 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${totalBudget - totalSpent}
            </p>
          </div>
        </div>

        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="flex gap-4">
            <input type="number" required value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount $" className="w-1/3 p-2 border rounded" />
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-2/3 p-2 border rounded">
              <option value="food">Food & Drink</option>
              <option value="transport">Transportation</option>
              <option value="stay">Accommodation</option>
              <option value="entry">Entry Tickets</option>
              <option value="other">Other</option>
            </select>
          </div>
          <input type="text" required value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description (e.g., Dinner at Rome)" className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Expense</button>
        </form>
      </div>

      <div className="h-64 mt-8 md:mt-0">
        {expenses.length > 0 ? (
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                 {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
               </Pie>
               <Tooltip />
               <Legend />
             </PieChart>
           </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">No expenses logged yet.</div>
        )}
      </div>
    </div>
  );
}