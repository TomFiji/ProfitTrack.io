import { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext.jsx'
import cx from 'clsx';
import { ScrollArea, Table, Button } from '@mantine/core';
import classes from '../css/TableScrollArea.module.css';
import { format } from 'date-fns';


function ExpenseTable({ filteredExpenses = [] }) {
  const [scrolled, setScrolled] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedExpense, setEditedExpense] = useState({
        category: "",
        description: "",
        amount: "",
        date: "",
    })

  const { allExpenses, handleEditSubmit, handleDelete } = useExpenseContext()

  const expenseTypes = ['Thrift Store', 'Online Arbitrage', 'Supplies', 'Food', 'Miscellaneous'].map(
        item => ({ label:item, value:item})
    )

    const handleChange = (e) => {
      const {name, value} = e.target;
      setEditedExpense(prev => ({
          ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value
            }));
        }
  


   const startEditing = (expense) => {
        setEditingId(expense.id);
        setEditedExpense({
            id: expense.id,
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            expense_date: expense.expense_date
        });
    };

     const handleSave = async () => {
        // Normalize field names to match server expectations before sending
        const formattedExpense = {
            ...editedExpense,
            expense_date: editedExpense.date || editedExpense.expense_date,
            amount: editedExpense.amount !== undefined ? Number(editedExpense.amount) : undefined
        };

        await handleEditSubmit(formattedExpense);
        setEditingId(null);
    }

    const handleCancel = () => {
            setEditingId(null);
            console.log(expenses)
            console.log(filteredExpenses)
        }

  var expenses = []      

  if (filteredExpenses.length !== 0){
    expenses = filteredExpenses
  } 
  else {expenses = allExpenses}

  const rows = expenses.map((expense) => (
    <Table.Tr key={expense.id}>
      {editingId === expense.id ? (
        <>
          <Table.Td>
            <select name="category" value={editedExpense.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {expenseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
          </Table.Td>  
          <Table.Td>
            <input
                type='text'
                name='description'
                placeholder={expense.description}
                value={editedExpense.description}
                onChange={handleChange}
            />
          </Table.Td>  
          <Table.Td>
            <input
                type='number'
                step="0.01"
                name='amount'
                value={editedExpense.amount}
                onChange={handleChange}
            />
          </Table.Td>  
          <Table.Td>
            <input
                type='date'
                name='date'
                placeholder={expense.expense_date}
                value={editedExpense.date}
                onChange={handleChange}
            />
          </Table.Td>  
          <Table.Td>
            <div>
                <Button onClick={handleSave} variant="filled" size="md" color='indigo'>Save</Button>
                <Button onClick={handleCancel} variant="filled" color="red" size="md">Cancel</Button>
            </div>
          </Table.Td>
        </>  
      ) : (
        <>
          <Table.Td>{expense.category}</Table.Td>
          <Table.Td>{expense.description}</Table.Td>
          <Table.Td>${expense.amount.toFixed(2)}</Table.Td>
          <Table.Td>{format(new Date(expense.expense_date + 'T12:00:00'), 'MM/dd/yyyy')}</Table.Td>
          <Table.Td>
            <Button onClick={() => startEditing(expense)} variant="filled" size="md">Edit</Button>
            <Button onClick={() => handleDelete(expense.id)} variant="filled" color="rgba(247, 45, 45, 1)" size="md">Delete</Button>
          </Table.Td>  
        </>  
      )}
    </Table.Tr>
  ));

  return (
    <ScrollArea h="74vh" onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>Type</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th> </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export default ExpenseTable
