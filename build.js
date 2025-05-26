const fs = require("fs");
const fse = require("fs-extra");

const SOURCE_DIR = ".";
const DEST_DIR = "dist";

// Удалить dist сначала
fse.removeSync(DEST_DIR);

// Скопировать всё, кроме dist, node_modules, .git и сам build.js
fse.copySync(SOURCE_DIR, DEST_DIR, {
  filter: (src) => {
    // Нормализуем путь
    const normalized = src.replace(/\\/g, "/");

    return !normalized.startsWith(`${SOURCE_DIR}/dist`) &&
           !normalized.includes("node_modules") &&
           !normalized.includes(".git") &&
           !normalized.endsWith("build.js");
  }
});

// Создать .nojekyll
fs.writeFileSync(`${DEST_DIR}/.nojekyll`, "");

console.log("✅ Build complete!");
