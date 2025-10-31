//import { useState } from 'react';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Filter from './pages/Filter'
import Analytics from './pages/Analytics';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin_Page';
import VerifyEmailPage from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPassword';
import ConfirmPasswordsPage from './pages/ConfirmPasswords';
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute';
import {Routes, Route, useLocation} from 'react-router-dom';
import "./css/App.css"
import { ExpenseProvider } from './contexts/ExpenseContext';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';


function App() {
  const location = useLocation();
  
  // Pages where navbar should be hidden
  const showHeaderRoutes = ['/signup', '/signin', '/verify-email', '/error', '/forgot-password', '/confirm-passwords'];
  const shouldShowHeader = !showHeaderRoutes.includes(location.pathname);
  return(
    <MantineProvider>
      <ExpenseProvider>
        <div className="app-shell">
          {shouldShowHeader && <Header />}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProtectedRoute>{<Home />}</ProtectedRoute>}/>
              <Route path="/expenses" element={<ProtectedRoute>{<Expenses />}</ProtectedRoute>}/>
              <Route path="/filter" element={<ProtectedRoute>{<Filter />}</ProtectedRoute>}/>
              <Route path="/analytics" element={<ProtectedRoute>{<Analytics />}</ProtectedRoute>}/>
              <Route path="/signup" element={<SignupPage />}/>
              <Route path="/signin" element={<SigninPage />}/>
              <Route path="/verify-email" element={<VerifyEmailPage />}/>
              <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
              <Route path="/confirm-passwords" element={<ProtectedRoute>{<ConfirmPasswordsPage />}</ProtectedRoute>}/>
            </Routes>
          </main>
        </div>
      </ExpenseProvider>
    </MantineProvider>  
  )
}

export default App
