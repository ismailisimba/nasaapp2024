const fs = require('fs');
const path = require('path');
const express = require('express');

// Load .env if present without external dependency
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || '').trim();
    }
  });
}

const port = parseInt(process.env.PORT, 10) || 7860;
const app = express();

const Utilities = require('./utilities');
const utilities = new Utilities();

app.use(express.static(path.join(__dirname, 'my-exoplanet-start-chart')));
app.use(express.static(path.join(__dirname, 'utilities/assets')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', port });
});

app.get('/initialize', async (req, res) => {
  const responseData = {};
  try {
    const x = await utilities.fetchAndConvertCSV();
    responseData.count = x.length;
    responseData.x = x;
  } catch (e) {
    console.error(e);
    responseData.error = e.message || String(e);
  }
  res.send(responseData);
});

app.get('/initialize2', async (req, res) => {
  const responseData = {};
  try {
    const x = await utilities.fetchAndConvertTSV();
    responseData.count = x.length;
    responseData.x = x;
  } catch (e) {
    console.error(e);
    responseData.error = e.message || String(e);
  }
  res.send(responseData);
});

const server = app.listen(port, () => {
  console.log(`ExoSky server listening on http://localhost:${port}`);
});

module.exports = server;
