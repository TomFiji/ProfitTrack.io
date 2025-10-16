//import { useState } from 'react';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Filter from './pages/Filter'
import Analytics from './pages/Analytics';
import {Routes, Route} from 'react-router-dom';
import NavbarMinimal from "./components/Sidebar"
import "./css/App.css"
import { ExpenseProvider } from './contexts/ExpenseContext';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';


function App() {
  return(
    <MantineProvider>
      <ExpenseProvider>
        <div className="app-shell">
          <NavbarMinimal />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/expenses" element={<Expenses />}/>
              <Route path="/filter" element={<Filter />}/>
              <Route path="/analytics" element={<Analytics />}/>
            </Routes>
          </main>
        </div>
      </ExpenseProvider>
    </MantineProvider>  
  )
}

export default App
