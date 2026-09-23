const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");
const inputPath = path.join(__dirname, "reference.json");

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const raw = fs.readFileSync(inputPath, "utf-8");

const { include = [], exclude = [] } = config;

function findArrays(obj) {
  if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "object" && !Array.isArray(obj[0])) {
    return obj;
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const val of Object.values(obj)) {
      const found = findArrays(val);
      if (found) return found;
    }
  }
  return null;
}

function resolvePath(obj, pathStr) {
  return pathStr.split(".").reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function getOutputKey(key) {
  const parts = key.split(".");
  return parts[parts.length - 1];
}

function filterItem(item, include, exclude) {
  if (include.length > 0) {
    const result = {};
    for (const key of include) {
      if (key.includes(".")) {
        const val = resolvePath(item, key);
        if (val !== undefined) result[getOutputKey(key)] = val;
      } else {
        if (key in item) result[key] = item[key];
      }
    }
    return result;
  }
  if (exclude.length > 0) {
    const result = { ...item };
    for (const key of exclude) delete result[key];
    return result;
  }
  return item;
}

const objects = raw.split(/\}\s*\n\s*\{/).map((chunk, i, arr) => {
  let s = chunk.trim();
  if (i > 0) s = "{" + s;
  if (i < arr.length - 1) s = s + "}";
  return JSON.parse(s);
});

let allItems = [];
for (const obj of objects) {
  const arr = findArrays(obj);
  if (arr) allItems = allItems.concat(arr);
}

const filtered = allItems.map((item) => filterItem(item, include, exclude));
const output = JSON.stringify(filtered, null, 2);

console.log(output);
fs.writeFileSync(path.join(__dirname, "output.txt"), output);
console.log("\nSaved to output.txt");

const keys = include.length > 0 ? include.map(getOutputKey) : Object.keys(filtered[0] || {});
const tsvHeader = keys.join("\t");
const tsvRows = filtered.map((item) => keys.map((k) => item[k] ?? "").join("\t"));
const tsv = [tsvHeader, ...tsvRows].join("\n");

fs.writeFileSync(path.join(__dirname, "output.tsv"), tsv);
console.log("Saved to output.tsv");
