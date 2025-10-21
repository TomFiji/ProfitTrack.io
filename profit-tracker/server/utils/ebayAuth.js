import { authenticateUser } from '../middleware/auth.js';
import supabase from '../config/supabase.js';


export const getValidAccessToken = async(expires_at, r_token) => {
    if (expires_at < Date.now()){
        console.log("New access token created")
        try{
            const credentials_encoded = Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')

            const tokenResponse = await axios.post('https://api.sandbox.ebay.com/identity/v1/oauth2/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: r_token,
                    scope : `${process.env.EBAY_SCOPES}`
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
        }catch(error){
            console.error({ 'Error getting access token from refresh token:': error })
            res.status(500).json({ error: 'Authentication error' })
        }
    }
}
