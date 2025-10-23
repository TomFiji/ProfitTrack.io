import { useState } from 'react';
import { supabase } from '../config/supabase.js';
import { useNavigate, Link } from 'react-router-dom';
import LockLogo from '../../assets/lock.svg'
import EmailLogo from '../../assets/email_symbol.svg'


function Signin(){
    return(
        <h1>This is the signin page</h1>
    )
}
export default Signin