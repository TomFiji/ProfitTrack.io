import { useState } from "react";


function ExpenseFilter({ onFilter }) {

    const expenseCategories = [
    'Thrift Store',
    'Online Arbitrage',
    'Supplies',
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

    const handleCategoryChange = (category) => {
        setFilters((prev) => {
            const alreadySelected = prev.categories.includes(category);
            return{
                ...prev,
                categories: alreadySelected
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category] 
            };
        });
    };

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
        <form onSubmit={handleSubmit}>
            <legend>Categories</legend>
            {expenseCategories.map((cat) => (
                <label key={cat}>
                    <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                    />
                    {cat}
                </label>
            ))}
            <input
                type="text"
                name="description"
                placeholder="Search description"
                value={filters.description}
                onChange={handleChange}
            />
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
        </form>
        
    )



}

export default ExpenseFilter