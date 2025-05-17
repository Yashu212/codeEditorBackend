const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

const serviceMap = {
  python: "https://python-service-k920.onrender.com/run",
  cpp: "https://cppservice.onrender.com/run",
  java: "https://java-service-rtcm.onrender.com/run",
  js: "https://js-service.onrender.com/run",
};

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  const serviceURL = serviceMap[language.toLowerCase()];
  if (!serviceURL) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const response = await axios.post(serviceURL, { code, input });
    res.json({ output: response.data.output });
  } catch (err) {
    res.status(500).json({ error: err?.response?.data?.error || err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Gateway is up and running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Gateway running on http://localhost:${PORT}`));

