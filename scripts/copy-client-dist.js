const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "client", "bot", "dist");
const targetDir = path.join(rootDir, "dist");

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Client build output not found: ${sourceDir}`);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });
