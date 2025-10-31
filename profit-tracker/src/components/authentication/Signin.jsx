import { useState } from 'react';
import { supabase } from '../config/supabase.js';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenseContext } from '../../contexts/ExpenseContext.jsx';
import LockLogo from '../../assets/lock.svg'
import EmailLogo from '../../assets/email_symbol.svg'
import ProfitTrackLogo from '../../assets/profittrack-logo.svg'
import '../../css/Signup.css'


function Signin(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setError] = useState(null)
    const navigate = useNavigate();

    function addIncorrectClass(idName){
        document.getElementById(idName).parentElement.classList.add('incorrect')
    }

    const { refreshExpenses } = useExpenseContext()


    const handleSignin = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        setLoading(false);

        if (error) {
            setError(error.message);
            addIncorrectClass('email-input');
            addIncorrectClass('password-input')
            document.getElementById('errors').innerText = err
        }
        else if (data.user){
            refreshExpenses()
            navigate('/');
        }
    
        
    }

    return(
            <div className='body'>
             <div className='sign-up-div'>
                <img class='logo' src={ProfitTrackLogo} />
                    <h1>Log in</h1>
                    <form onSubmit={handleSignin} className='sign-up'>
                        
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
                        <p id="errors"></p>
                        <button type='submit'>Sign In</button>
                    </form>
                    <p>Forgot your password? Click <Link to="/forgot-password">here</Link></p>
                    <p>Don't have an Account? <Link to="/signup">Signup</Link></p>
                </div>
            </div>  
        )
    
    }
export default Signin