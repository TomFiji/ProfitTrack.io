import express from 'express'
import axios from "axios";
import supabase from '../config/supabase.js';
import { Buffer } from 'node:buffer';
import { authenticateUser } from '../middleware/auth.js';
import { getValidAccessToken } from '../utils/ebayAuth.js';
const router = express.Router()

const date = new Date();
let currentDate = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`;

//Gets ebay payouts for the entire year and is used in fetchGrossPayouts()
router.get("/payouts", authenticateUser, async (req, res) => {
    try{
        const access_token = await getValidAccessToken(req.user.id)
        const response = await axios.get(`https://apiz.ebay.com/sell/finances/v1/payout?filter=payoutDate:[${date.getFullYear()}-1-1T00:00:01.000Z..${currentDate}T00:00:01.000Z]&limit=200&offset=0`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
    res.json(response.data);
    
    } catch (error){
        console.log("eBay API error with payouts: ", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from eBay" });
    }
})

//Gets ebay payout for the total month to calculate monthly profit
router.get("/monthly-payouts", authenticateUser, async (req, res) => {
    try{
        const access_token = await getValidAccessToken(req.user.id)
        const response = await axios.get(`https://apiz.ebay.com/sell/finances/v1/payout?filter=payoutDate:[${date.getFullYear()}-${date.getMonth() +1}-1T00:00:01.000Z..${currentDate}T00:00:01.000Z]&limit=200&offset=0`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
    res.json(response.data);
    } catch (error){
        console.log("eBay API error with monthly payouts: ", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from eBay" });
    }
})

//Connect user to eBay's OAuth url
router.get("/connect", authenticateUser, (req, res) => {
    const state = Buffer.from(JSON.stringify({
        userId: req.user.id,
        timestamp: Date.now()
    })).toString('base64');

    const authUrl = 'https://auth.ebay.com/oauth2/authorize?' +
        `client_id=${process.env.EBAY_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${process.env.EBAY_RUNAME}&` +
        `scope=${encodeURIComponent(process.env.EBAY_SCOPES)}&` +
        `state=${state}`;

    res.json({ authUrl })
})

//Callback eBay's code to get tokens and if successful, add new user to ebay_connections database
router.get("/callback", async(req,res) =>{
    const { code, state } = req.query
    if(!code){return res.status(401).json({ error: 'Authentication Error' })}

    try{
        const { userId } = JSON.parse(Buffer.from(state, 'base64').toString())
        const credentials_encoded = Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')

        const tokenResponse = await axios.post('https://api.ebay.com/identity/v1/oauth2/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri : `${process.env.EBAY_RUNAME}`
            }),
            {
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${credentials_encoded}`
                }
            }    
           );
        
        const { access_token, refresh_token, expires_in } = tokenResponse.data
        const expiresAt = new Date(Date.now() + expires_in*1000);
        
        const { error } = await supabase
           .from('ebay_connections')
           .upsert({
                user_id: userId,
                access_token,
                refresh_token,
                expires_at : expiresAt.toISOString(),
                updated_at: new Date().toISOString()
           }, {
                onConflict: 'user_id'
           })
           if (error) throw error;
           res.redirect(`${process.env.FRONTEND_URL}/?ebay_connected=true`)
    }catch(error){
        console.log("Error authenticating your ebay profile, ", error)
        res.redirect(`${process.env.FRONTEND_URL}/error?message=Failed to connect eBay account`)
    }
})

export default router;