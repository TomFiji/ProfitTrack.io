import supabase from '../config/supabase.js'

export const authenticateUser = async(req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ error: 'No token provided' })}
        const supabaseJWT = authHeader.split('Bearer ')[1];    
        const { data: {user}, error } = await supabase.auth.getUser(supabaseJWT)
        if (error || !user) {
            return res.status(401).json({error: 'Invalid or expired token' })
        }
        req.user = user;
        next()
    }catch(error){
        console.error({ 'Error authenticating user:': error })
        res.status(500).json({ error: 'Authentication error' })
    }

}