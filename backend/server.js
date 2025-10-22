import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import conversionsRouter from './routes/conversions.js';
import { initDb } from './database.js';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve front-end
app.use(express.static(path.join(__dirname, '../frontend')));

// API CRUD
app.use('/api/conversions', conversionsRouter);

// API externa de conversão
app.get('/api/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    if (!from || !to || !amount) return res.status(400).json({ error: 'from, to e amount obrigatórios' });

    const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await response.json();

    res.json({
      from: data.query.from,
      to: data.query.to,
      amount: data.query.amount,
      converted: data.result,
      rate: data.info?.rate || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicia banco e servidor
const PORT = 3000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
});
