import ExpenseFilter from '../components/ExpenseFilter.jsx'
import ExpenseTable from '../components/ExpenseTable.jsx'
import FilterExpenseTotalGrid from '../components/FilterExpenseTotalGrid.jsx';
import { useExpenseContext } from '../contexts/ExpenseContext.jsx'
import { useState } from 'react'
import { Flex } from '@mantine/core'

function Filter() {
    

    const { filteredExpenses, fetchFilteredExpenses, filteredExpenseTotal } = useExpenseContext()
    

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
            <Flex gap="xl" align="flex-start">
                <ExpenseFilter onFilter={fetchFilteredExpenses}/>
                <FilterExpenseTotalGrid total={filteredExpenseTotal} />
            </Flex>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <ExpenseTable filteredExpenses={filteredExpenses}/>
            </div>
        </div>
    )
}

export default Filter