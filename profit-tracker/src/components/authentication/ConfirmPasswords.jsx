import { useState, useEffect, useNavig } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "../config/supabase";
import LockLogo from '../../assets/lock.svg'
import ProfitTrackLogo from '../../assets/profittrack-logo.svg'
import '../../css/Signup.css'


function ConfirmPasswords(){

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();
    
    const updatePassword = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            document.getElementById('errors').innerText = "Passwords do not match."
            return
        }
        const { error } = await supabase
            .auth
            .updateUser({
                password: password
            })
        if (error) {
            throw error
        }
        else { navigate("/") }
    }

    return(
         <div className='body'>
            <img class='logo' src={ProfitTrackLogo} />
            <div className='sign-up-div'>
                <h1>Reset Password</h1>
                <form onSubmit={updatePassword} className='sign-up'>
                    
                    <div>
                        <label for="password-input"><img src={LockLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            autocomplete="off"
                            id='password-input'
                            placeholder='New Password'
                        />
                    </div>
                    <div>
                        <label for="confirm-password-input"><img src={LockLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required
                            autocomplete="off"
                            id='confirm-password-input'
                            placeholder='Confirm New Password'
                        />
                    </div>
                    <p id='errors' style={{ color: "red", fontSize: "20px" }}></p>
                    <button>Reset Password</button>
                </form>
            </div>
        </div>
    )
}
export default ConfirmPasswords