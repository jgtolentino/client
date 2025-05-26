import express from 'express';
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
});