import { useState, useEffect,} from "react";
import { Paper, Text } from '@mantine/core';
import { PieChart } from '@mantine/charts'
import { supabase } from "./config/supabase";
import '../css/Chart.css'

function Piechart() {
    const [categoryExpenses, setCategoryExpenses] = useState([])

    const fetchExpensesByCategory = async (req, res) => {
        const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session');
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/categories`, {
                    headers: {'Authorization': `Bearer ${session.access_token}`}
                });
            if(!res.ok) throw new Error('Failed to fetch expenses');
            const data = await res.json();
            const formatted = data.map((r, index) => ({
                name: r.category,
                value: parseFloat(r.category_total),
                color: ['blue.6', 'teal.6', 'orange.6', 'grape.6', 'pink.6', 'cyan.6', 'lime.6', 'red.6'][index % 8]
            }))
            setCategoryExpenses(formatted);
            console.log(formatted)
        } catch(error){
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'eBay API error'})
        }       
    }

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

    useEffect(() => {
        fetchExpensesByCategory();
        }, []);

    return(
        <div className="piechart">
            <h3>Expenses by Category</h3>
            <PieChart
                data={categoryExpenses}
                w={"100%"}
                h={"35vh"}
                size={"80%"}
                strokeWidth={1.5}
                withTooltip
                tooltipProps={{
                content: CustomTooltip
                }}
                tooltipAnimationDuration={0}
            />
        </div>
    )    
}

export default Piechart