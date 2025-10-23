import {useState, useEffect } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext.jsx'
import { usePayout } from '../hooks/usePayout.js';
import '../css/ExpenseInput.css'


function ExpenseInput() {
    const [newExpense, setNewExpense] = useState({
        expenseType: '',
        expenseName: '',
        expenseDate: '',
        expenseCost: ''
    });


    const { addExpense } = useExpenseContext()


    const expenseTypes = ['Thrift Store', 'Online Arbitrage', 'Supplies', 'Food', 'Miscellaneous'].map(
        item => ({ label:item, value:item})
    )

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewExpense(prevState => ({...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newExpense.expenseType || !newExpense.expenseName || !newExpense.expenseDate || !newExpense.expenseCost){
            alert("Please fill out all the fields in expense");
            return;
        }
        addExpense(newExpense);
        setNewExpense({
            expenseType: '',
            expenseName: '',
            expenseDate: '',
            expenseCost: ''
        })

    }

    return (
        <div className='html'>
            <div className='expense-form-div'>
                <form onSubmit={handleSubmit} className='expense-form'>
                    <label htmlFor='expense-type'>Expense Category: </label>
                    <select className='expense-type' name="expenseType" onChange={handleChange} value={newExpense.expenseType}>
                        <option value="">Select Expense Type</option> 
                        {expenseTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                ))}
                    </select>
                    <label htmlFor='expense_name'>Expense Name: </label>
                    <input type="text" className="expense-name" name="expenseName" onChange={handleChange} value={newExpense.expenseName} autocomplete="off"/>
                    <label htmlFor='expense_cost'>Expense Cost: </label>
                    <input type="number" className="expense-cost" name="expenseCost" onChange={handleChange} value={newExpense.expenseCost} min="0.01" step="0.01" placeholder="0.00" />
                    <label htmlFor='expense_date'>Date: </label>
                    <input type="date" className="expense-date" name="expenseDate" onChange={handleChange} value={newExpense.expenseDate} />
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            </div>
        </div>    
    )

}

export default ExpenseInput
