const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const crypto = require("crypto");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TEMP_DIR = path.join(__dirname, "temp");

fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

async function runPythonCode(code, input) {
  const fileName = `code_${crypto.randomBytes(8).toString("hex")}.py`;
  const filePath = path.join(TEMP_DIR, fileName);
  const inputFileName = `input_${crypto.randomBytes(8).toString("hex")}.txt`;
  const inputFilePath = path.join(TEMP_DIR, inputFileName);

  await fs.writeFile(filePath, code);
  await fs.writeFile(inputFilePath, input); 

  return new Promise((resolve, reject) => {
    const cmd = `python3 "${path.join(TEMP_DIR, fileName)}" < "${path.join(TEMP_DIR, inputFileName)}"`;
    console.log("Docker command:", cmd);

    exec(cmd, { timeout: 5000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      fs.unlink(filePath).catch(() => {});
      fs.unlink(inputFilePath).catch(() => {});

      if (error) {
        return reject(new Error(stderr || error.message));
      }
      resolve(stdout);
    });
  });
}

app.post("/run", async (req, res) => {
  const { code, input = "" } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    const output = await runPythonCode(code, input);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Python service running on http://localhost:${PORT}`));
