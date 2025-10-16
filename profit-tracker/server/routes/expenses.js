import express from 'express'
import pool from '../config/database.js'
const router = express.Router()

const date = new Date();


//GET ALL EXPENSES
router.get('/', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
        res.json(result.rows);
    }catch(error){
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//CREATE NEW EXPENSE
router.post('/', async(req, res) => {
    const { category, description, expense_date, amount } = req.body

    if(!category || !description || !expense_date || !amount) {
        return res.status(400).json({ error: "All field are required" }); 
    }

    try{
        const result = await pool.query(
            'INSERT INTO expenses (category, description, expense_date, amount) VALUES ($1, $2, $3, $4) RETURNING *',
            [category, description, expense_date, amount]
        );
        res.status(201).json(result.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Database error'});
    }
})

//GET TOTAL SUM OF ALL EXPENSES
router.get('/total', async(req, res) => {
    try {
        const total = await pool.query('SELECT SUM(amount) AS total_amount FROM expenses');
        res.json({total: total.rows[0].total_amount || 0});
    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//GET THIS MONTH'S TOTAL SUM OF EXPENSES
router.get('/monthly-total', async(req, res) => {
    try {
        const total = await pool.query(`SELECT SUM(amount) AS monthly_total_amount FROM expenses WHERE EXTRACT(MONTH FROM expense_date) = ${date.getMonth()+1}`);
        res.json({total: total.rows[0].monthly_total_amount || 0});
    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//DELETE EXPENSE FROM THE DATABASE
router.delete('/:id', async(req, res) =>{
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)){return res.status(400).json({ error: 'Invalid expense id' })}
    try {
        await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
        res.json({ message: 'Expense deleted successfully' })
    }catch(error){
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


//Filter through expenses
router.get("/filter", async (req, res) => {
  const { categories, description, minPrice, maxPrice, startDate, endDate } = req.query;

  let query = "SELECT * FROM expenses WHERE 1=1";
  const params = [];

  // Category
  if (categories) {
    const categoryArray = Array.isArray(categories)
      ? categories
      : categories.split(","); // if sent as comma-separated string

    // Example: ['Food', 'Supplies'] → $1, $2
    const placeholders = categoryArray.map((_, i) => `$${params.length + i + 1}`).join(", ");
    query += ` AND category IN (${placeholders})`;
    params.push(...categoryArray);
  }

  // Description (case-insensitive search)
  if (description) {
    params.push(`%${description}%`);
    query += ` AND description ILIKE $${params.length}`;
  }

  // Price range
  if (minPrice) {
    params.push(minPrice);
    query += ` AND amount >= $${params.length}`;
  }
  if (maxPrice) {
    params.push(maxPrice);
    query += ` AND amount <= $${params.length}`;
  }

  // Date range
  if (startDate) {
    params.push(startDate);
    query += ` AND expense_date >= $${params.length}`;
  }
  if (endDate) {
    params.push(endDate);
    query += ` AND expense_date <= $${params.length}`;
  }

  query += " ORDER BY expense_date DESC";

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error filtering expenses:", err);
    res.status(500).json({ error: "Database error" });
  }
});

//EDIT EXPENSE
router.put('/:id', async(req,res) => {
    const { id } = req.params;
    const { category, description, expense_date, amount } = req.body;

    try{
        const result = await pool.query(
            `UPDATE expenses
            SET category = $1, description = $2, expense_date = $3, amount = $4
            WHERE id = $5
            RETURNING *`,
            [category, description, expense_date, amount, id]
        );
        if (!result || !result.rowCount) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(result.rows[0])
    }catch(err){
        console.error('Error updating expense:', err);
        res.status(500).json({ error: 'Database error' });
    }
})

//GET SUM OF EXPENSES FROM EACH MONTH
router.get('/monthly', async(req,res) => {
    try{
        const result = await pool.query(
            `SELECT TO_CHAR(expense_date, 'MM') AS month, 
            SUM(amount) AS total_expenses 
            FROM expenses 
            GROUP BY month 
            ORDER BY month`)
        res.json(result.rows)    
    }catch(err){
        console.log("Error getting expenses by month: ", err)
        res.status(500).json({ error: 'Database error' });
    }
})

export default router;