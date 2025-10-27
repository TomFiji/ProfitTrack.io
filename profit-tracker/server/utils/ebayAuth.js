import supabase from '../config/supabase.js';
import axios from "axios";
import { Buffer } from 'node:buffer';


export const getValidAccessToken = async(userId) => {
    const { data, error } = await supabase
        .from('ebay_connections')
        .select('*')
        .eq('user_id', userId)
        .single();
        if (error) { throw error || "No data found"}
        if (!data) { console.log('eBay account not connected. Please connect your eBay account first')}
        const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()){
        console.log("New access token created")
        try{
            const credentials_encoded = Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')

            const tokenResponse = await axios.post('https://api.ebay.com/identity/v1/oauth2/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: data.refresh_token,
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
           return access_token
        }catch(error){
            console.error({ 'Error getting access token from refresh token:': error })
            throw error;
        }
    }
    else{
        console.log("Old access token used");
        return data.access_token
    }
}
