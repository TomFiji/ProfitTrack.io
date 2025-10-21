import { useState } from 'react';
import { supabase } from '../config/supabase.js';
import { useNavigate, Link } from 'react-router-dom';
import PersonLogo from '../../assets/person.svg'
import LockLogo from '../../assets/lock.svg'
import EmailLogo from '../../assets/email_symbol.svg'
import '../../css/Signup.css'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    

    const handleSignup = async(e) => {
        e.preventDefault();
        if (password != repeatPassword){
            alert("Passwords do not match.");
            return;
        }
        const { data, error } = await supabase.auth.signup({
            email: email,
            password: password
        })
        if (error) {throw error}
        await supabase
            .from('profiles')
            .eq('id', data.user.id)
            .update({
                first_name: firstName,
                last_name: lastName
            })
        
    }

    return(
        <>
            <div className='sign-up-div'>
                <h1>Signup</h1>
                <form onSubmit={handleSignup} className='sign-up'>
                    <div>
                        <label for="first-name-input"><img src={PersonLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} 
                            required
                            autocomplete="off"
                            id='first-name-input'
                            placeholder='First Name'
                        />
                    </div>
                    <div>
                        <label for="last-name-input"><img src={PersonLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} 
                            required
                            autocomplete="off"
                            id='last-name-input'
                            placeholder='Last Name'
                        />
                    </div>
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
                    <div>
                        <label for="password-input"><img src={LockLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            autocomplete="off"
                            id='password-input'
                            placeholder='Password'
                        />
                    </div>
                    <div>
                        <label for="repeat-password-input"><img src={LockLogo} alt="" style={{ width: 48, height: 24 }} /> </label>
                        <input 
                            type="password" 
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)} 
                            required
                            autocomplete="off"
                            id='repeat-password-input'
                            placeholder='Repeat Password'
                        />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
                <p>Already have an Account? <Link to="/signin">Login</Link></p>
            </div>
        </>  
    )

}
export default Signup