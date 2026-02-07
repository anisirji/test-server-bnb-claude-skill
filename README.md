# BNB Wallet Server

Local Node.js server for checking BNB Smart Chain wallet balances and BEP20 tokens.

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server will run on **http://localhost:3000**

## API Endpoints

### Health Check
```
GET http://localhost:3000/api/health
```

### Get BNB Balance
```
GET http://localhost:3000/api/balance/:address
```

**Example:**
```bash
curl http://localhost:3000/api/balance/0x3a474032fe8660c274a48e7c6fe5a0ffa218fca8
```

### Get Token Balance
```
GET http://localhost:3000/api/token/:tokenAddress/:walletAddress
```

**Example:**
```bash
curl http://localhost:3000/api/token/0x55d398326f99059fF775485246999027B3197955/0x3a474032fe8660c274a48e7c6fe5a0ffa218fca8
```

## Why This Server?

Claude Desktop has network restrictions that block direct BSC RPC calls. This local server:
- ✅ Runs on your machine (localhost)
- ✅ Makes RPC calls to BSC blockchain
- ✅ Claude Desktop can access localhost without restrictions

## Usage with Claude Desktop

1. Start this server (`npm start`)
2. Upload the `bnb-local-server` skill to Claude Desktop
3. Ask Claude to check wallet balances
4. Claude will use this local server to fetch blockchain data

## Dependencies

- **express**: Web server framework
- **cors**: Enable cross-origin requests
- **axios**: HTTP client for making RPC calls
