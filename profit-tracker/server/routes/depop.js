import express from 'express'
import supabase from '../config/supabase.js'
import { authenticateUser } from '../middleware/auth.js'
import { parseDepopCsv } from '../utils/csvParser.js'

const router = express.Router()


router.post('/upload', authenticateUser, async (req, res) => {
    const { rows } = req.body

    if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({ error: 'Invalid CSV data' })
    }

    try {
        const records = parseDepopCsv(rows).map(record => ({
            ...record,
            user_id: req.user.id
        }))

        const { error } = await supabase
            .from('depop_payouts')
            .upsert(records, { onConflict: 'user_id,order_id,listing_title,item_index' })

        if (error) throw error

        res.status(200).json({ message: `${records.length} records upserted` })
    } catch (err) {
        console.error('Error upserting poshmark data:', err)
        res.status(500).json({ error: 'Database error' })
    }
})

router.get('/year-total', authenticateUser, async(req, res)=>{
    try{
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const { data, error } = await supabase
            .from('depop_payouts')
            .select('net_earnings')
            .eq('user_id', req.user.id)
            .gte('order_date', `${year}-01-01`)
            .lt('order_date', `${year+1}-01-01`)

        if (error) throw error;

        const total = data.reduce((sum, row) => sum + (parseFloat(row.net_earnings) || 0), 0);
        res.json({ total });

    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

router.get('/current-monthly-total', authenticateUser, async(req, res)=>{
    try{
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const firstDayThisMonth = `${year}-${String(month).padStart(2, '0')}-01`;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextMonthYear = month === 12 ? year + 1 : year;
        const firstDayNextMonth = `${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-01`;

        const { data, error } = await supabase
            .from('depop_payouts')
            .select('net_earnings')
            .eq('user_id', req.user.id)
            .gte('order_date', firstDayThisMonth)
            .lt('order_date', firstDayNextMonth)

        if (error) throw error;

        const total = data.reduce((sum, row) => sum + (parseFloat(row.net_earnings) || 0), 0);
        res.json({ total });
    }catch(error){
        console.error('Error fetching monthly total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

router.get('/transactions', authenticateUser, async(req, res)=>{
    try{
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const { data, error } = await supabase
            .from('depop_payouts')
            .select('*')
            .eq('user_id', req.user.id)
            .gte('order_date', `${year}-01-01`)
            .lt('order_date', `${year+1}-01-01`)

        if (error) throw error;

        res.json(data);

    }catch(error){
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

export default router
