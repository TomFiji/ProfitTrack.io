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
            minHeight: '100%'
        }}>
            <Flex
                gap={{ base: 'md', md: 'xl' }}
                align="flex-start"
                direction={{ base: 'column', md: 'row' }}
                mb={{ base: 'sm', md: 'md' }}
            >
                <ExpenseFilter onFilter={fetchFilteredExpenses}/>
                <FilterExpenseTotalGrid total={filteredExpenseTotal} />
            </Flex>
            <div style={{ flex: 1 }}>
                <ExpenseTable filteredExpenses={filteredExpenses}/>
            </div>
        </div>
    )
}

export default Filter