import { initDb } from '../database.js';

export async function createConversion(req, res) {
  try {
    const { from_currency, to_currency, amount, result, rate } = req.body;
    const db = await initDb();
    const stmt = await db.run(
      `INSERT INTO conversions (from_currency,to_currency,amount,result,rate) VALUES (?,?,?,?,?)`,
      [from_currency, to_currency, amount, result, rate]
    );
    res.json({ id: stmt.lastID, message: 'Conversão salva' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getConversions(req, res) {
  try {
    const db = await initDb();
    const rows = await db.all(`SELECT * FROM conversions ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateConversion(req, res) {
  try {
    const { id } = req.params;
    const { from_currency, to_currency, amount, result, rate } = req.body;
    const db = await initDb();
    await db.run(
      `UPDATE conversions SET from_currency=?, to_currency=?, amount=?, result=?, rate=? WHERE id=?`,
      [from_currency, to_currency, amount, result, rate, id]
    );
    res.json({ message: 'Conversão atualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteConversion(req, res) {
  try {
    const { id } = req.params;
    const db = await initDb();
    await db.run(`DELETE FROM conversions WHERE id=?`, [id]);
    res.json({ message: 'Conversão deletada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
    