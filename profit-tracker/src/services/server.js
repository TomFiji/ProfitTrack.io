import express from "express";
import axios from "axios";
import cors from "cors";
import pg from "pg";
const { Pool } = pg;
const app = express();
const PORT = 5000;
const BEARER_TOKEN = "v^1.1#i^1#r^1#I^3#f^0#p^3#t^Ul4xMF83OjM1NEMyMzBBMkRGRDQxODFCRTg2MTg2NTE4ODU5QTczXzFfMSNFXjI2MA=="

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eBay_Expenses',
  password: '1234',
  port: 5432,
});

const date = new Date();
let currentDate = `${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}`;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());

//EBAY API CALLS

//Gets ebay payouts for the entire year and is used in fetchGrossPayouts()
app.get("/api/ebay-payouts", async (req, res) => {
    try{
        const response = await axios.get(`https://apiz.ebay.com/sell/finances/v1/payout?filter=payoutDate:[${date.getFullYear()}-1-1T00:00:01.000Z..${currentDate}T00:00:01.000Z]&limit=200&offset=0`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    res.json(response.data);
    
    } catch (error){
        console.log("eBay API error: ", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from eBay" });
    }
})

//Gets ebay payout for current month and is used in fetchMonthlyPayout()
app.get("/api/ebay-monthly-payouts", async (req, res) => {
    try{
        const response = await axios.get(`https://apiz.ebay.com/sell/finances/v1/payout?filter=payoutDate:[${date.getFullYear()}-${date.getMonth() +1}-1T00:00:01.000Z..${currentDate}T00:00:01.000Z]&limit=200&offset=0`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    res.json(response.data);
    } catch (error){
        console.log("eBay API error: ", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch data from eBay" });
    }
})

//EXPENSE DATABASE CALLS

//Saves new expense into database
app.post('/expenses', async(req, res) => {
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

//Gets all expenses from the database
app.get('/expenses', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
        res.json(result.rows);
    }catch(error){
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//Gets the total amount of expenses from the year to subtract from gross payouts
app.get('/expenses/total', async(req, res) => {
    try {
        const total = await pool.query('SELECT SUM(amount) AS total_amount FROM expenses');
        res.json({total: total.rows[0].total_amount || 0});
    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//Gets total amount of expenses for the month to subtract from monthly payouts
app.get('/expenses/monthly-total', async(req, res) => {
    try {
        const total = await pool.query(`SELECT SUM(amount) AS monthly_total_amount FROM expenses WHERE EXTRACT(MONTH FROM expense_date) = ${date.getMonth()+1}`);
        res.json({total: total.rows[0].monthly_total_amount || 0});
    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//Deletes an expense from the database
app.delete('/expenses/:id', async(req, res) =>{
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

//Edits an expense in the database
app.put('/expenses/:id', async(req,res) => {
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

app.get('/expenses/monthly', async(req,res) => {
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

//Filter through expenses
app.get("/expenses/filter", async (req, res) => {
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

// Fallback JSON 404 to avoid HTML pages when a route isn't matched
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})