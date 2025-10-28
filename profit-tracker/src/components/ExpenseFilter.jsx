import { useState } from "react";
import { MultiSelect } from "@mantine/core";
import '../css/ExpenseFilter.css'


function ExpenseFilter({ onFilter }) {

    const expenseCategories = [
    'Thrift Store', 
    'Online Arbitrage', 
    'Retail Arbitrage', 
    'Supplies', 
    'Employees', 
    'Food', 
    'Miscellaneous'
]

    const [filters, setFilters] = useState({
        categories: [],
        description: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
    });

    const handleCategoryChange = (selectedValues) => {
        setFilters((prev) => ({ ...prev, categories: selectedValues }))
    }

    const handleChange = (e) => {
       const { name, value } = e.target;
       setFilters((prev) => ({ ...prev, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onFilter){
        onFilter(filters); }
    }

    return (
        <form class="expense-filter-form" onSubmit={handleSubmit}>
        <div class='category-description'>
            <MultiSelect 
                class = "multiselect"
                placeholder = 'Choose your categories'
                data={expenseCategories}
                onChange={handleCategoryChange}
                clearable
                w={"50%"}
            />
            <input
                type="text"
                class="description-input"
                name="description"
                placeholder="Search description"
                value={filters.description}
                onChange={handleChange}
            />
        </div>
        <div> 
            <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleChange}
                step="0.01" 
            />
            <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleChange}
                step="0.01"
            />
            <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={filters.startDate}
                onChange={handleChange}
            />
            <input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={filters.endDate}
                onChange={handleChange}
            />
            <button>Search</button>
        </div>       
        </form>
        
    )



}

export default ExpenseFilter