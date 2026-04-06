import express from 'express'
import supabase from '../config/supabase.js'
import { authenticateUser } from '../middleware/auth.js'
import { parsePoshmarkCsv } from '../utils/csvParser.js'

const router = express.Router()

router.post('/upload', authenticateUser, async (req, res) => {
    const { rows } = req.body

    if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({ error: 'Invalid CSV data' })
    }

    try {
        const records = parsePoshmarkCsv(rows).map(record => ({
            ...record,
            user_id: req.user.id
        }))

        const { error } = await supabase
            .from('poshmark_payouts')
            .upsert(records, { onConflict: 'order_id,listing_title' })

        if (error) throw error

        res.status(200).json({ message: `${records.length} records upserted` })
    } catch (err) {
        console.error('Error upserting poshmark data:', err)
        res.status(500).json({ error: 'Database error' })
    }
})

export default router
