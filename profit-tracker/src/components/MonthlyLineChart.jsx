import { useState, useEffect,} from "react";
import { Paper, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';

function MonthlyLineChart({ height = 400, width = "40vw" }){
    const [monthlyPayoutTotals, setMonthlyPayoutTotals] = useState([])
    const [monthlyExpenseTotals, setMonthlyExpenseTotals] = useState([])
    const [data, setData] = useState([])

   /*async function refreshExpenses() {
        await Promise.all([fetchExpensesByMonth()])
    }*/
    

    const fetchAllMonthlyPayouts = async (req, res) => {
        try {
            const res = await fetch("http://localhost:5000/api/ebay-payouts");

            const data = await res.json();

            const monthlyTotals = {}

            for (let i=0; i<data.payouts.length; i++) {
                const month = data.payouts[i].payoutDate.slice(5,7);
                monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(data.payouts[i].amount.value)
            }

            const result = Object.entries(monthlyTotals).map(([month, total]) => ({
                month,
                total_payouts:  Math.round(total * 100) / 100
            }));
            setMonthlyPayoutTotals(result);
            //console.log(result)

        }catch(error){
                console.log("Error getting each month's payout: ", error)
                res.status(500).json({ error: 'eBay API error'})
            }
    }

    const fetchExpensesByMonth = async (req, res) => {
        try{
            const response = await fetch('http://localhost:5000/expenses/monthly');
            if(!response.ok) throw new Error('Failed to fetch expenses');
            const data = await response.json();
           const formatted = data.map(r => ({
                month: r.month,
                total_expenses: parseFloat(r.total_expenses)
            }))
            setMonthlyExpenseTotals(formatted);
            //console.log(formatted)
        } catch(error){
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'eBay API error'})
        }       
    }

    
    

    const mergeData = async () => {

        

        console.log("monthlyPayoutTotals:", monthlyPayoutTotals);
        console.log("monthlyExpenseTotals:", monthlyExpenseTotals);


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

        monthlyPayoutTotals.forEach(p => {
            const month = monthNames[p.month] || p.month
            mergedMap[month] = {
                month,
                Payout: p.total_payouts,
                Expenses: 0
            };
        });

        monthlyExpenseTotals.forEach(e => {
            const month = monthNames[e.month] || e.month
            mergedMap[month].Expenses= e.total_expenses;
        })

        const mergedArray = Object.values(mergedMap)
        mergedArray.sort((a, b) => new Date(`2025-${a.month}-01`) - new Date(`2025-${b.month}-01`));
        setData(mergedArray)
        console.log(mergedArray)
    }

    
    useEffect(() => {
        fetchAllMonthlyPayouts();
        fetchExpensesByMonth();
        }, []);

    useEffect(() => {
        if (monthlyPayoutTotals.length > 0 && monthlyExpenseTotals.length > 0) {
            mergeData();
        }
        }, [monthlyPayoutTotals, monthlyExpenseTotals]);   
        
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
            {item.name}: {item.value}
          </Text>
        ))}
      </Paper>
        );
    }

    return(
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
            ]}
            curveType="linear"
            tickLine="y"
            tooltipProps={{
            content: CustomTooltip
            }}
            tooltipAnimationDuration={0}
            yAxisProps={{ domain: [0, 12000]}}
        />
    )
}
export default MonthlyLineChart