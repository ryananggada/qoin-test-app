const express = require('express');
const app = express();
const PORT = 8000;
const { startWorker } = require('./worker');

app.use(express.json());
startWorker();

const db = require('./models');
db.sequelize.sync();

const testRouter = require('./routes/test');

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

app.use('/api/test', testRouter);

// 404 Not Found route
app.use((req, res) => {
  console.error(`Not found: ${req.path}`);
  res.status(404).json({
    ok: false,
    message: 'Route not found',
  });
});

// Middleware error
app.use((err, req, res, next) => {
  console.error(`FATAL ERROR: ${req.path}`);
  console.error(err);

  res.status(500).json({
    ok: false,
    message: 'FATAL ERROR',
    error: String(err),
  });
});
