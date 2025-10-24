import express from 'express'
import supabase from '../config/supabase.js'
import { authenticateUser } from '../middleware/auth.js';
const router = express.Router()

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth()+1)}-${String(date.getDate())}`
const first_day_month = `${date.getFullYear()}-${String(date.getMonth()+1)}-01`


//GET ALL EXPENSES
router.get('/', authenticateUser, async(req, res) => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', req.user.id)
        if (error) { throw error || "Could not retrieve all expenses"}
        res.json(data) 
    }catch(error){
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//CREATE NEW EXPENSE
router.post('/', authenticateUser, async(req, res) => {
    const { category, description, expense_date, amount } = req.body

    if(!category || !description || !expense_date || !amount) {
        return res.status(400).json({ error: "All field are required" }); 
    }

    try{
        const { data, error } = await supabase
            .from('expenses')
            .insert({
                user_id: req.user.id,
                category: category,
                description: description,
                expense_date: expense_date,
                amount: amount
            })
        if (error) { throw error || "Could not add expense"}
        res.status(201).json(data);
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Database error'});
    }
})

//GET TOTAL SUM OF ALL EXPENSES
router.get('/total', authenticateUser, async(req, res) => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('amount.sum()')
            .eq('user_id', req.user.id)

        if (error) { throw error || "Could not retrieve expenses total"}
        res.json(data[0]?.sum || 0);
    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//GET THIS MONTH'S TOTAL SUM OF EXPENSES
router.get('/monthly-total', authenticateUser, async(req, res) => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('sum(amount)')
            .gte('expense_date', first_day_month)
            .lte('expense_date', today)
            .eq('user_id', req.user.id)
        
        if (error) { throw error }
        res.json(data[0]?.sum || 0);
    }catch(error){
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Database error' });
    }
})

//DELETE EXPENSE FROM THE DATABASE
router.delete('/:id', authenticateUser, async(req, res) =>{
    const id = parseInt(req.params.id, 10)
    if (Number.isNaN(id)){return res.status(400).json({ error: 'Invalid expense id' })}
    try {
        const { error } = await supabase
            .from('expenses')
            .delete() 
            .eq('user_id', req.user.id)
            .eq('id', id)
               
        if (error) { throw error }
        res.json({ message: 'Expense deleted successfully' })
    }catch(error){
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


//Filter through expenses
router.get("/filter", authenticateUser, async (req, res) => {
  const { categories, description, minPrice, maxPrice, startDate, endDate } = req.query;
    try {
    let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', req.user.id)

    // Category
    if (categories) {
        const categoryArray = Array.isArray(categories)
        ? categories
        : categories.split(","); // if sent as comma-separated string

        // Example: ['Food', 'Supplies'] → $1, $2
        query = query.in('category', categoryArray)
    }

    // Description (case-insensitive search)
    if (description) {
        query = query.ilike('description', `%${description}%`)
    }

    // Price range
    if (minPrice) {
        query = query.gte('amount', minPrice)
    }
    if (maxPrice) {
        query = query.lte('amount', maxPrice)
    }

    // Date range
    if (startDate) {
        query = query.gte('expense_date', startDate)
    }
    if (endDate) {
        query = query.lte('expense_date', endDate)
    }

    query = query.order('expense_date', {ascending: false})

    const { data, error } = await query;
    if (error) {throw error}
    res.json(data);
  } catch (err) {
    console.error("Error filtering expenses:", err);
    res.status(500).json({ error: "Database error" });
  }
});

//EDIT EXPENSE
router.put('/:id', authenticateUser, async(req,res) => {
    const { id } = parseInt(req.params);
    const { category, description, expense_date, amount } = req.body;

    try{
        const { data, error } = await supabase
            .from('expenses')
            .update({
                category: category,
                description: description,
                expense_date: expense_date,
                amount: amount
            })
            .eq('user_id', req.user.id)
            .eq('id', id)
            .select()
            
        
        
        if (error) {
            throw error
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(data[0])
    }catch(err){
        console.error('Error updating expense:', err);
        res.status(500).json({ error: 'Database error' });
    }
})

//GET SUM OF EXPENSES FROM EACH MONTH
router.get('/monthly', authenticateUser, async(req,res) => {
    try{
        const { data, error } = await supabase
            .rpc('get_monthly_expenses', { user_id_param: req.user.id })
            
        if (error) { throw error; }
        res.json(data)    
    }catch(err){
        console.log("Error getting expenses by month: ", err)
        res.status(500).json({ error: 'Database error' });
    }
})

export default router;