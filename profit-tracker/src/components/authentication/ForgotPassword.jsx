import { useState } from "react";
import { supabase } from "../config/supabase";

function ForgotPassword(){
    const { data, error } = await supabase.auth  
        .resetPasswordForEmail('user@email.com')
        
    /** * Step 2: Once the user is redirected back to your application, * ask the user to reset their password. */ 
    useEffect(() => {   
        supabase.auth.onAuthStateChange(async (event, session) => {     
            if (event == "PASSWORD_RECOVERY") {       
                const newPassword = prompt("What would you like your new password to be?");       
                const { data, error } = await supabase.auth         
                .updateUser({ password: newPassword })       
                if (data) alert("Password updated successfully!")       
                if (error) alert("There was an error updating your password.")     
            }   
        }) 
    }, [])

    return(
        <>
        </>
    )
}