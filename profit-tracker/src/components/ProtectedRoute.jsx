import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { supabase } from './config/supabase'

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkUser = async() => {
            const { data: {session} } = await supabase.auth.getSession();
            setUser(session?.user?? null)
            setLoading(false) ; 
        };
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        });
        return () => subscription.unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to='/signin' replace />
    }

    return children;
}

export default ProtectedRoute