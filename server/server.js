// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/search', async (req, res) => {
  const { query } = req.body;

  console.log("Query:", query);
  console.log("API Key:", process.env.REACT_APP_NUCLIA_API_KEY);
  console.log("KB ID:", process.env.REACT_APP_NUCLIA_KB_ID);

  const response = await fetch('https://your_region.nuclia.cloud/api/v1/kb/your_kb_id/find', {
    method: 'POST',
    headers: {
      'X-Auth-Token': process.env.REACT_APP_NUCLIA_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
  query: query,
  knowledgeBox: process.env.REACT_APP_NUCLIA_KB_ID,
  limit: 100,
})
  });

  const text = await response.text();
  console.log("Raw response:", text);

  let data;
  try {
  data = JSON.parse(text);
  } catch (err) {
  console.error("Failed to parse JSON:", err.message);
  data = { error: "Empty or invalid response from API" };
  }
  res.json(data);
});

app.listen(5000, () => console.log('Proxy server running on port 5000'));
