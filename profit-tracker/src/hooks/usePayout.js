import { useState, useEffect } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext.jsx'

export const usePayout = () => {

    const { totalExpenses } = useExpenseContext();

    const [grossPayout, setGrossPayout] = useState(0);
    const [loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

    const netPayout = (grossPayout - totalExpenses);

    const fetchGrossPayout = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ebay-payouts`);

                const data = await res.json();
                console.log(data);

                let grossPayout = 0;

                for (let i=0; i<data.payouts.length; i++){
                    grossPayout += parseFloat(data.payouts[i].amount.value);
                }

                setGrossPayout(grossPayout.toFixed(2));
                console.log(grossPayout.toFixed(2));
            }catch(error){
                setError('Failed to load payout data');
                console.log(error);
            }finally{
                setLoading(false);
            }
        } 

    useEffect(() => {   
        fetchGrossPayout();
        console.log(totalExpenses)
    }, []);

    return {
        netPayout,
        grossPayout,
        totalExpenses,
        loading,
        error,
        fetchGrossPayout
    }
}
