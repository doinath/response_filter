const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");
const inputPath = path.join(__dirname, "reference.json");

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const input = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

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

function filterItem(item, include, exclude) {
  if (include.length > 0) {
    const result = {};
    for (const key of include) {
      if (key in item) result[key] = item[key];
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

const arrays = findArrays(input);

if (arrays) {
  const filtered = arrays.map((item) => filterItem(item, include, exclude));
  console.log(JSON.stringify(filtered, null, 2));
} else {
  const result = filterItem(input, include, exclude);
  console.log(JSON.stringify(result, null, 2));
}
