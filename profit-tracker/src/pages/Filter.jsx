import ExpenseFilter from '../components/ExpenseFilter.jsx'
import ExpenseTable from '../components/ExpenseTable.jsx'
import FilterExpenseTotalGrid from '../components/FilterExpenseTotalGrid.jsx';
import { useExpenseContext } from '../contexts/ExpenseContext.jsx'
import { useState } from 'react'

function Filter() {
    

    const { filteredExpenses, fetchFilteredExpenses, filteredExpenseTotal } = useExpenseContext()
    

    return (
        <>
            <FilterExpenseTotalGrid total={filteredExpenseTotal} />
            <ExpenseFilter onFilter={fetchFilteredExpenses}/>
            <ExpenseTable filteredExpenses={filteredExpenses}/>
        </>
    )
}

export default Filter