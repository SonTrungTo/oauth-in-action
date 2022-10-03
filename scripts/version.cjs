const fs = require("fs");
const path = require("path");

const packageVersion = require("../package.json").version;

const content = `export const VERSION = "${packageVersion}";\n`;

fs.writeFileSync(path.join(__dirname, '../source/shared/build.ts'), content);
