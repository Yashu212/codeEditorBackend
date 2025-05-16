const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

const serviceMap = {
  python: "http://localhost:8001/run",
  cpp: "http://localhost:8002/run",
  java: "http://localhost:8003/run",
  js: "http://localhost:8004/run",
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

const PORT = 5001;
app.listen(PORT, () => console.log(`Gateway running on http://localhost:${PORT}`));

