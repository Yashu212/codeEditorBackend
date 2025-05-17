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

const TEMP_DIR = path.resolve(__dirname, "temp");
fs.mkdir(TEMP_DIR, { recursive: true });

async function runCppCode(code, input) {
  const fileId = crypto.randomBytes(8).toString("hex");
  const codeFile = `code_${fileId}.cpp`;
  const inputFile = `input_${fileId}.txt`;
  const codePath = path.join(TEMP_DIR, codeFile);
  const inputPath = path.join(TEMP_DIR, inputFile);

  await fs.writeFile(codePath, code);
  await fs.writeFile(inputPath, input || "");

  return new Promise((resolve, reject) => {
    const cmd = `g++ ${codePath} -o ${TEMP_DIR}/code_${fileId} && ${TEMP_DIR}/code_${fileId} < ${inputPath}`;

    exec(cmd, { timeout: 7000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      fs.unlink(codePath).catch(() => {});
      fs.unlink(inputPath).catch(() => {});

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
    const output = await runCppCode(code, input);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`C++ service running at http://localhost:${PORT}`));
