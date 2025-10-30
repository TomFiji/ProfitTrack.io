import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
import 'dotenv/config';
import expensesData from './routes/expenses.js'
import router from './routes/ebay.js'

const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
}

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})