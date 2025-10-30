import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import EmailLogo from '../../assets/email_symbol.svg'
import ProfitTrackLogo from '../../assets/profittrack-logo.svg'
import '../../css/Signup.css'


function ForgotPassword(){

    const [email, setEmail] = useState("")

    async function resetPassword(e) {
        e.preventDefault()
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5173/confirm-passwords'
        })
    }    

    return(
         <div className='body'>
            <img class='logo' src={ProfitTrackLogo} />
            <div className='sign-up-div'>
                <h1>Reset your Password</h1>
                <form onSubmit={resetPassword} className='sign-up'>
                    <div>
                        <label for="email-input"><img src={EmailLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            autocomplete="off"
                            id='email-input'
                            placeholder='Email'
                        />
                    </div>
                    <button>Send Email</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword