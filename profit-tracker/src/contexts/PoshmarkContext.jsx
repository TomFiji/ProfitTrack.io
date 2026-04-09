import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useYearContext } from './YearContext.jsx';
import { supabase } from '../components/config/supabase.js';


const PoshmarkContext = createContext();

export const usePoshmarkContext = () => useContext(PoshmarkContext);

export const PoshmarkProvider = ({ children }) => {
    const { selectedYear } = useYearContext();
    const [ annualPoshmarkEarnings, setAnnualPoshmarkEarnings ]  = useState(0)
    const [ monthlyPoshmarkEarnings, setMontlyPoshmarkEarnings ] = useState(0)
    const [ poshmarkEarningsByMonth, setPoshmarkEarningsByMonth ] = useState([])
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(null)



    const fetchAllEarnings = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/poshmark/year-total?year=${selectedYear}`, {
                headers: {'Authorization': `Bearer ${session.access_token}`}
            });

            if (!res.ok) throw new Error('Failed to fetch annual poshmark earnings');

            const data = await res.json();
            
            setAnnualPoshmarkEarnings(data.total);
        }catch(error){
            setError("Failed to get this year's earnings");
            console.log(error);
        }
    }, [selectedYear])

    const fetchMonthlyEarnings = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/poshmark/current-monthly-total`, {
                headers: {'Authorization': `Bearer ${session.access_token}`}
            });

            if (!res.ok) throw new Error('Failed to fetch monthly poshmark earnings');

            const data = await res.json();
            
            setMontlyPoshmarkEarnings(data.total);
        }catch(error){
            setError("Failed to get this month's earnings");
            console.log(error);
        }
    }

    const fetchEarningsByMonth = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/poshmark/transactions?year=${selectedYear}`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const data = await res.json();

            const monthlyMap = {};
            data.forEach(row => {
                const month = row.order_date.slice(5, 7);  // "YYYY-MM-DD" → "MM"
                monthlyMap[month] = (monthlyMap[month] || 0) + (parseFloat(row.net_earnings) ||   0);
            });

            const result = Object.entries(monthlyMap).map(([month, total]) => ({
                month,
                total: Math.round(total * 100) / 100
            }));
            setPoshmarkEarningsByMonth(result);
        }catch(error){
            setError("Failed to get each month's earnings");
            console.log(error);
        }
        }, [selectedYear]);

    const value = {
            loading,
            error,
            annualPoshmarkEarnings,
            monthlyPoshmarkEarnings,
            poshmarkEarningsByMonth,
            selectedYear,
            
        }
    
        useEffect(() => {
            fetchAllEarnings();
            fetchMonthlyEarnings();
            fetchEarningsByMonth();
        }, [])
    
        // Listen to auth changes and clear state on logout
        useEffect(() => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_OUT') {
                    // Clear all state when user signs out
                    setAnnualPoshmarkEarnings(0);
                    setMontlyPoshmarkEarnings(0);
                    setPoshmarkEarningsByMonth({});
                    setError(null);
                    
                }
                // Removed automatic refetch on SIGNED_IN to prevent
                // unexpected data refreshes that ignore selectedYear
            });
    
            return () => subscription.unsubscribe();
        }, [])

    return (
        <PoshmarkContext.Provider value={value}>
            {children}
        </PoshmarkContext.Provider>
    );
}