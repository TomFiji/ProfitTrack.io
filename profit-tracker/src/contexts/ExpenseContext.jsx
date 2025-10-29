import {createContext, useState, useContext, useEffect, useCallback} from "react";
import { supabase } from '../components/config/supabase.js';

const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({children}) => {
    const [allExpenses, setExpenses] = useState([]);
    const [totalExpenseAmount, setTotalExpenseAmount] = useState(0)
    const [monthlyExpenseAmount, setMonthlyExpenseAmount] = useState(0)
    const [grossPayout, setGrossPayout] = useState(0);
    const [monthlyPayout, setMonthlyPayout] = useState(0);
    const [loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredExpenseTotal, setFilteredExpeneseTotal] = useState(0);

    

    const fetchGrossPayout = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            try {
                const res = await fetch("http://localhost:5000/api/ebay/payouts", {
                    headers: {'Authorization': `Bearer ${session.access_token}`}
                });

                if (!res.ok) throw new Error('Failed to fetch gross payout');

                const data = await res.json();
                let grossPayout = 0;

                for (let i=0; i<data.payouts.length; i++){
                    grossPayout += parseFloat(data.payouts[i].amount.value);
                }
                console.log(data)
                setGrossPayout(grossPayout);
            }catch(error){
                setError('Failed to load payout data');
                console.log(error);
            }
        }

    const fetchMonthlyPayout = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            try {
                const res = await fetch("http://localhost:5000/api/ebay/monthly-payouts", {
                    headers: {'Authorization': `Bearer ${session.access_token}`}
                });

                if (!res.ok) throw new Error('Failed to fetch gross payout');

                const data = await res.json();
                let total = 0;

                for (let i=0; i<data.payouts.length; i++){
                    total += parseFloat(data.payouts[i].amount.value);
                }
                setMonthlyPayout(total);
            }catch(error){
                setError('Failed to load payout data');
                console.log(error);
            }
        }    
    
    async function refreshExpenses() {
        // don't call fetchFilteredExpensesTotal() here because filteredExpenses
        // may not have updated yet after a setFilteredExpenses call. We
        // recompute filtered total in a dedicated useEffect that listens for
        // changes to `filteredExpenses`.
        await Promise.all([fetchTotalExpenseAmount(), fetchGrossPayout(), fetchMonthlyExpenseAmount(), fetchMonthlyPayout()]);
    }

    const addExpense = async (newExpense) => {
        const payload = {
            category: newExpense.expenseType,
            description: newExpense.expenseName,
            expense_date: newExpense.expenseDate,
            amount: parseFloat(newExpense.expenseCost) || 0
        }

        try{
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            const response = await fetch('http://localhost:5000/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body:JSON.stringify(payload)
            })

            if(!response.ok) {
                throw new Error('Failed to save expense')
            }

            const savedExpense = await response.json();
            setExpenses(prev => [...prev, savedExpense])
            refreshExpenses()
        }catch(err){
            console.error('Error saving expense:', err);
            alert('There was a problem saving your expense.')
        }


    };  
    
    const handleEditSubmit = async (updatedExpense) =>{
         try{
            // Basic validation: ensure id exists
            if (!updatedExpense || !updatedExpense.id) {
                throw new Error('Invalid expense payload: missing id');
            }
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            const response = await fetch(`http://localhost:5000/expenses/${updatedExpense.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(updatedExpense)
            });

            // If the request failed, attempt to read server error for debugging
            if (!response.ok) {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch {
                    errorText = '<unable to read response body>';
                }
                console.error('Failed to update expense. Server response:', response.status, errorText);
                throw new Error(`Failed to update expense: ${response.status} ${errorText}`);
            }

            const savedExpense = await response.json();
            setExpenses(prev =>
                prev.map(exp => exp.id === savedExpense.id ? savedExpense : exp)
            );
            setFilteredExpenses(prev =>
                prev.map(exp => exp.id === savedExpense.id ? savedExpense : exp)
            );
            refreshExpenses();
        } catch(error){
            console.error('Failed to update expense:', error);
            // Show a slightly more helpful message to the user
            alert('Failed to save changes. See console for details.');
        }
    };

    const handleDelete = async (id) => {
       try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
        await fetch(`http://localhost:5000/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });
        setExpenses(prev => prev.filter(exp => exp.id !== id));
        setFilteredExpenses(prev => prev.filter(exp => exp.id !== id))
        refreshExpenses();
       } catch(error){
        console.error('Failed to delete expense:', error);
       }
    };

    
    const fetchExpenses = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            const response = await fetch('http://localhost:5000/expenses', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if(!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setExpenses(data);
        } catch(error){
            console.error('Error fetching expenses:', error);
        }
    }

    const fetchTotalExpenseAmount = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            const response = await fetch('http://localhost:5000/expenses/total', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            
            if(!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setTotalExpenseAmount(data)
        }catch(error){
            console.error('Error fetching total amount of expenses:', error)
        }
    }

    const fetchMonthlyExpenseAmount = async () => {
        try{
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            const response = await fetch('http://localhost:5000/expenses/monthly-total', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            if(!response.ok) throw new Error('Failed to fetch monthly expenses');
            const data = await response.json();
            setMonthlyExpenseAmount(data)
        }catch(error){
            console.error('Error fetching total amount of expenses:', error)
        }
    }

    const fetchFilteredExpensesTotal = useCallback((e = filteredExpenses) => {
        const total = e.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        setFilteredExpeneseTotal(total);
    }, [filteredExpenses]);

    const fetchFilteredExpenses = async (filters = {}) => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, v]) => v !== "")
        );
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
        const res = await fetch(`http://localhost:5000/expenses/filter?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await res.json();
        setFilteredExpenses(data);
        // Compute total for the newly fetched filtered data immediately
        fetchFilteredExpensesTotal(data);
    };

    // Ensure filteredExpenseTotal always reflects the current filteredExpenses
    useEffect(() => {
        // Recompute total whenever filteredExpenses changes (including deletes)
        fetchFilteredExpensesTotal(filteredExpenses);
    }, [filteredExpenses, fetchFilteredExpensesTotal]);



    const value = {
        loading,
        error,
        allExpenses,
        grossPayout,
        monthlyPayout,
        totalExpenseAmount,
        monthlyExpenseAmount,
        filteredExpenses,
        filteredExpenseTotal,
        addExpense,
        handleEditSubmit,
        handleDelete,
        fetchFilteredExpenses,
        refreshExpenses
    }

    useEffect(() => {
        fetchExpenses();
        fetchGrossPayout();
        fetchTotalExpenseAmount();
        fetchMonthlyPayout();
        fetchMonthlyExpenseAmount();
    }, [])

    // Listen to auth changes and clear state on logout
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                // Clear all state when user signs out
                setExpenses([]);
                setTotalExpenseAmount(0);
                setMonthlyExpenseAmount(0);
                setGrossPayout(0);
                setMonthlyPayout(0);
                setFilteredExpenses([]);
                setFilteredExpeneseTotal(0);
                setError(null);
            } else if (event === 'SIGNED_IN' && session) {
                // Refetch data when user signs in
                fetchExpenses();
                fetchGrossPayout();
                fetchTotalExpenseAmount();
                fetchMonthlyPayout();
                fetchMonthlyExpenseAmount();
            }
        });

        return () => subscription.unsubscribe();
    }, [])

    return <ExpenseContext.Provider value={value}>
        {children}
    </ExpenseContext.Provider>
}