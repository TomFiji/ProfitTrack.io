import { useState, useEffect } from 'react';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [filters, setFilters] = useState({});

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.cost, 0);

    const filteredExpenses = expenses.filter(expense => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return expense[key].toString().toLowerCase().includes(value.toLowerCase());
        });
    });

    const addExpense = (newExpense) => {
        const newSubmission = {
            ...newExpense,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            cost: parseFloat(newExpense.expenseCost) || 0
            //Will have to add userId later for authentication
        };
        setExpenses(prev => [...prev, newSubmission]);
    };

    return{
        expenses,
        totalExpenses,
        addExpense,
        setFilters,
        filteredExpenses
    }
}