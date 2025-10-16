import express from 'express'
import axios from "axios";
import 'dotenv/config';
const router = express.Router()

const BEARER_TOKEN = process.env.EBAY_BEARER_TOKEN

const date = new Date();
let currentDate = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`;

//Gets ebay payouts for the entire year and is used in fetchGrossPayouts()
router.get("/payouts", async (req, res) => {
    console.log("✅ eBay payouts route was hit!");
    try{
        const response = await axios.get(`https://apiz.ebay.com/sell/finances/v1/payout?filter=payoutDate:[${date.getFullYear()}-1-1T00:00:01.000Z..${currentDate}T00:00:01.000Z]&limit=200&offset=0`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    res.json(response.data);
    
    } catch (error){
        console.log("eBay API error: ", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from eBay" });
    }
})

router.get("/monthly-payouts", async (req, res) => {
    try{
        const response = await axios.get(`https://apiz.ebay.com/sell/finances/v1/payout?filter=payoutDate:[${date.getFullYear()}-${date.getMonth() +1}-1T00:00:01.000Z..${currentDate}T00:00:01.000Z]&limit=200&offset=0`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    res.json(response.data);
    } catch (error){
        console.log("eBay API error: ", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from eBay" });
    }
})

export default router;