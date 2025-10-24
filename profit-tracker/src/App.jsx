//import { useState } from 'react';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Filter from './pages/Filter'
import Analytics from './pages/Analytics';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin_Page';
import Header from './components/Header'
import {Routes, Route, useLocation} from 'react-router-dom';
import "./css/App.css"
import { ExpenseProvider } from './contexts/ExpenseContext';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';


function App() {
  const location = useLocation();
  
  // Pages where navbar should be hidden
  const hideHeaderRoutes = ['/signup', '/signin'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  return(
    <MantineProvider>
      <ExpenseProvider>
        <div className="app-shell">
          {shouldShowHeader && <Header />}
          <main className="main-content">
            <Routes>
              
              <Route path="/" element={<Home />}/>
              <Route path="/expenses" element={<Expenses />}/>
              <Route path="/filter" element={<Filter />}/>
              <Route path="/analytics" element={<Analytics />}/>
              <Route path="/signup" element={<SignupPage />}/>
              <Route path="/signin" element={<SigninPage />}/>
            </Routes>
          </main>
        </div>
      </ExpenseProvider>
    </MantineProvider>  
  )
}

export default App
