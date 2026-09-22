# Response Getter

A simple JSON response filter. Paste a JSON response, configure which fields you want, and get the filtered output.

## Files

| File | Purpose |
|------|---------|
| `reference.json` | Paste your JSON response here |
| `config.json` | Set which fields to include or exclude |
| `filter.js` | The filtering script |

## Usage

### 1. Paste your JSON response into `reference.json`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "cost": 29.99
}
```

### 2. Edit `config.json` to choose which fields you want

**Include only specific fields:**

```json
{
  "include": ["cost"],
  "exclude": []
}
```

Output:
```json
{
  "cost": 29.99
}
```

**Exclude specific fields:**

```json
{
  "include": [],
  "exclude": ["name", "email"]
}
```

Output:
```json
{
  "cost": 29.99
}
```

### 3. Run the script

```bash
node filter.js
```

## Rules

- If `include` has values, only those fields are returned
- If `exclude` has values, those fields are removed
- If both are empty, the original JSON is returned
- `include` takes priority if both are set
