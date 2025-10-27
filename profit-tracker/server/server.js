import express from "express";
import cors from "cors";
const app = express();
import 'dotenv/config';
import expensesData from './routes/expenses.js'
import router from './routes/ebay.js'



const PORT = process.env.PORT || 5000


app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://cristen-cognitional-logarithmically.ngrok-free.dev",
      "http://localhost:5000",
      "https://auth.ebay.com"
    ],
    credentials: true
}))

app.use(express.json());

app.use('/expenses', expensesData)

app.use('/api/ebay', router)

//EBAY API CALLS



//Gets ebay payout for current month and is used in fetchMonthlyPayout()


app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})