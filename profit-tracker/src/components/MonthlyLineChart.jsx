import { useState, useEffect,} from "react";
import { Paper, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { supabase } from "./config/supabase";
import '../css/Chart.css'
import { useYearContext } from "../contexts/YearContext";
import { usePoshmarkContext } from "../contexts/PoshmarkContext";
import { usePlatformContext } from "../contexts/PlatformContext";

function MonthlyLineChart({ height = "40vh", width = "100%" }){
    const [ebayMonthlyPayoutTotals, setMonthlyPayoutTotals] = useState([])
    const [monthlyExpenseTotals, setMonthlyExpenseTotals] = useState([])
    const [data, setData] = useState([])
    const { selectedYear } = useYearContext();
    const { poshmarkEarningsByMonth } = usePoshmarkContext();
    const { selectedPlatforms } = usePlatformContext();
    

    const fetchAllMonthlyPayouts = async (req, res) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ebay/payouts?year=${selectedYear}`, {
                headers: {'Authorization': `Bearer ${session.access_token}`}
            });

            if (!response.ok) throw new Error('Failed to fetch gross payout');

            const data = await response.json();

            const ebayMonthlyTotals = {}

            for (let i=0; i<data.payouts.length; i++) {
                const month = data.payouts[i].payoutDate.slice(5,7);
                ebayMonthlyTotals[month] = (ebayMonthlyTotals[month] || 0) + parseFloat(data.payouts[i].amount.value)
            }

            const result = Object.entries(ebayMonthlyTotals).map(([month, total]) => ({
                month,
                total_payouts:  Math.round(total * 100) / 100
            }));
            setMonthlyPayoutTotals(result);
            //console.log(result)

        }catch(error){
                console.log("Error getting each month's payout: ", error)
            }
    }

    const fetchExpensesByMonth = async (req, res) => {
        const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/monthly?year=${selectedYear}`, {
                    headers: {'Authorization': `Bearer ${session.access_token}`}
                });
            if(!res.ok) throw new Error('Failed to fetch expenses');
            const data = await res.json();
           const formatted = data.map(r => ({
                month: r.month,
                total_expenses: parseFloat(r.total_expenses)
            }))
            setMonthlyExpenseTotals(formatted);
        } catch(error){
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'eBay API error'})
        }       
    }

    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const monthCount = selectedYear === currentYear ? currentMonth : 12;

    const mergeData = async () => {


        const monthNames = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
        };

        const mergedMap = {};

        for (let i = 1; i<= monthCount; i++){
            const monthKey = String(i).padStart(2, '0');
            const month = monthNames[monthKey];
            mergedMap[month] = {
                month,
                Payout: 0,
                Expenses: 0,
                Profit: 0
                };
            };

        if (selectedPlatforms.includes('ebay')){
            ebayMonthlyPayoutTotals.forEach(p => {
                const month = monthNames[p.month] || p.month;
                mergedMap[month].Payout += p.total_payouts;
            })
        }

        if (selectedPlatforms.includes('poshmark')){
            poshmarkEarningsByMonth.forEach(p => {
                const month = monthNames[p.month] || p.month;
                mergedMap[month].Payout += p.total;
            });
        }

        monthlyExpenseTotals.forEach(e => {
            const month = monthNames[e.month] || e.month
            if (mergedMap[month]) {
                mergedMap[month].Expenses = e.total_expenses || 0;
                mergedMap[month].Profit = mergedMap[month].Payout - (e.total_expenses || 0);
            }
        })

        Object.values(mergedMap).forEach(entry => {
            entry.Profit = entry.Payout - entry.Expenses;
        });

        const mergedArray = Object.values(mergedMap);
        mergedArray.sort((a, b) => new Date(`${selectedYear}-${a.month}-01`) - new Date(`${selectedYear}-${b.month}-01`));
        setData(mergedArray)
    }

    
    useEffect(() => {
        fetchAllMonthlyPayouts();
        fetchExpensesByMonth()
        }, [selectedYear]);

    useEffect(() => {
        mergeData()
        }, [ebayMonthlyPayoutTotals, monthlyExpenseTotals, poshmarkEarningsByMonth, selectedPlatforms]);   
        
    const CustomTooltip = ({ payload, label }) => {
    if (!payload || payload.length === 0) return null;
    return (
      <Paper withBorder p="xs">
        <Text size="xs">{label}</Text>
        {payload.map(item => (
          <Text
            key={item.name}
            size="sm"
            style={{
              color: item.color,
              marginTop: 4
            }}
          >
            {item.name}: ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        ))}
      </Paper>
        );
    }

    return(
        <div className="linechart">
            <h3>Profit by Month</h3>
            <LineChart
                h={height}
                w= {width}
                data={data}
                dataKey="month"
                strokeDasharray="15 15"
                xAxisProps={{padding: {right: 30}}}
                xAxisLabel="Month"
                yAxisLabel="Amount ($)"
                series={[
                    { name: 'Payout', color: 'blue.6' },
                    { name: 'Expenses', color: 'red.6' },
                    { name: 'Profit', color: 'green.6'},
                    
                ]}
                curveType="linear"
                tickLine="y"
                tooltipProps={{
                content: CustomTooltip
                }}
                tooltipAnimationDuration={0}
                //yAxisProps={{ domain: [0, 12000]}}
            />
        </div>
    )
}
export default MonthlyLineChart