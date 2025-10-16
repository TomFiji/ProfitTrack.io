import {createContext, useState, useContext, useEffect, useCallback} from "react"

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
            try {
                const res = await fetch("http://localhost:5000/api/ebay/payouts");

                const data = await res.json();
                let grossPayout = 0;

                for (let i=0; i<data.payouts.length; i++){
                    grossPayout += parseFloat(data.payouts[i].amount.value);
                }

                setGrossPayout(grossPayout.toFixed(2));
            }catch(error){
                setError('Failed to load payout data');
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

    const fetchMonthlyPayout = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/ebay/monthly-payouts");

                const data = await res.json();
                let grossPayout = 0;

                for (let i=0; i<data.payouts.length; i++){
                    grossPayout += parseFloat(data.payouts[i].amount.value);
                }
                setMonthlyPayout(grossPayout.toFixed(2));
            }catch(error){
                setError('Failed to load payout data');
                console.log(error);
            }finally{
                setLoading(false);
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
            const response = await fetch('http://localhost:5000/expenses', {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
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

            const response = await fetch(`http://localhost:5000/expenses/${updatedExpense.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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
        await fetch(`http://localhost:5000/expenses/${id}`, {
            method: 'DELETE'
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
            const response = await fetch('http://localhost:5000/expenses');
            if(!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            setExpenses(data);
        } catch(error){
            console.error('Error fetching expenses:', error);
        }
    }

    const fetchTotalExpenseAmount = async () => {
        try{
            const response = await fetch('http://localhost:5000/expenses/total');
            if(!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            const normalized = data && (data.total ?? 0);
            setTotalExpenseAmount(Number(normalized) || 0)
        }catch(error){
            console.error('Error fetching total amount of expenses:', error)
        }
    }

    const fetchMonthlyExpenseAmount = async () => {
        try{
            const response = await fetch('http://localhost:5000/expenses/monthly-total');
            if(!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
            const normalized = data && (data.total ?? 0);
            setMonthlyExpenseAmount(Number(normalized) || 0)
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
        const res = await fetch(`http://localhost:5000/expenses/filter?${params.toString()}`);
        const data = await res.json();
        setFilteredExpenses(data);
        // Compute total for the newly fetched filtered data immediately
        fetchFilteredExpensesTotal(data);
        console.log(data)
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
        fetchFilteredExpenses
    }

    useEffect(() => {
        fetchExpenses();
        fetchGrossPayout();
        fetchTotalExpenseAmount();
        fetchMonthlyPayout();
        fetchMonthlyExpenseAmount();
    }, [])

    return <ExpenseContext.Provider value={value}>
        {children}
    </ExpenseContext.Provider>
}