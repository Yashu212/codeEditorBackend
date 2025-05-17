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

async function runJavaCode(code, input) {
  const folderId = crypto.randomBytes(8).toString("hex");
  const requestDir = path.join(TEMP_DIR, folderId);
  await fs.mkdir(requestDir);

  const modifiedCode = code.replace(/public\s+class\s+\w+/, 'public class Main');

  const codeFile = `Main.java`;
  const inputFile = `input.txt`;

  await fs.writeFile(path.join(requestDir, codeFile), modifiedCode);
  await fs.writeFile(path.join(requestDir, inputFile), input || "");

  return new Promise((resolve, reject) => {
    const cmd = `javac ${path.join(requestDir, codeFile)} && java -cp ${requestDir} Main < ${path.join(requestDir, inputFile)}`;

    exec(cmd, { timeout: 10000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      fs.rm(requestDir, { recursive: true, force: true }).catch(() => {});

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
    const output = await runJavaCode(code, input);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => console.log(`Java service running at http://localhost:${PORT}`));
