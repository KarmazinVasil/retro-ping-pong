const fs = require("fs");
const fse = require("fs-extra");

fs.mkdirSync("dist", { recursive: true });

["index.html", "style.css", "script.js"].forEach(file => {
  if (fs.existsSync(file)) {
    fse.copySync(file, `dist/${file}`);
  }
});

if (fs.existsSync("assets") && fs.lstatSync("assets").isDirectory()) {
  fse.copySync("assets", "dist/assets", { overwrite: true });
}

fs.writeFileSync("dist/.nojekyll", "");
