const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (needed for remote access)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// BSC RPC endpoints with fallback
const RPC_ENDPOINTS = [
  'https://rpc.ankr.com/bsc',
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org/',
  'https://bsc-dataseed1.binance.org/',
  'https://1rpc.io/bnb',
];

// Helper: Convert Wei to BNB
function weiToBnb(wei) {
  return parseFloat(wei) / 1e18;
}

// Helper: Make RPC call with fallback
async function makeRpcCall(method, params) {
  const payload = {
    jsonrpc: '2.0',
    method,
    params,
    id: 1,
  };

  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      const response = await axios.post(rpcUrl, payload, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.result !== undefined) {
        return response.data;
      }
    } catch (error) {
      console.log(`Failed with ${rpcUrl}, trying next...`);
      if (rpcUrl === RPC_ENDPOINTS[RPC_ENDPOINTS.length - 1]) {
        throw new Error('All RPC endpoints failed');
      }
    }
  }
}

// API: Get BNB balance
app.get('/api/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Validate address
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid BSC address' });
    }

    console.log(`Fetching balance for ${address}...`);

    // Get balance from BSC
    const result = await makeRpcCall('eth_getBalance', [address, 'latest']);
    const weiBalance = parseInt(result.result, 16);
    const bnbBalance = weiToBnb(weiBalance);

    // Try to get BNB price
    let bnbPrice = null;
    let usdValue = null;
    try {
      const priceResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
        { timeout: 5000 }
      );
      bnbPrice = priceResponse.data.binancecoin.usd;
      usdValue = bnbBalance * bnbPrice;
    } catch (e) {
      console.log('Could not fetch BNB price');
    }

    res.json({
      address,
      balance: {
        wei: weiBalance.toString(),
        bnb: bnbBalance.toFixed(6),
      },
      price: bnbPrice ? {
        bnb_usd: bnbPrice,
        usd_value: usdValue?.toFixed(2),
      } : null,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// API: Get BEP20 token balance
app.get('/api/token/:tokenAddress/:walletAddress', async (req, res) => {
  try {
    const { tokenAddress, walletAddress } = req.params;

    // Validate addresses
    if (!tokenAddress.match(/^0x[a-fA-F0-9]{40}$/) || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    console.log(`Fetching token ${tokenAddress} balance for ${walletAddress}...`);

    // balanceOf function signature + padded wallet address
    const paddedAddress = walletAddress.slice(2).padStart(64, '0');
    const data = '0x70a08231' + paddedAddress;

    // Get token balance
    const balanceResult = await makeRpcCall('eth_call', [
      { to: tokenAddress, data },
      'latest',
    ]);
    const rawBalance = parseInt(balanceResult.result, 16);

    // Get token decimals
    const decimalsResult = await makeRpcCall('eth_call', [
      { to: tokenAddress, data: '0x313ce567' },
      'latest',
    ]);
    const decimals = parseInt(decimalsResult.result, 16) || 18;

    // Get token symbol
    let symbol = 'UNKNOWN';
    try {
      const symbolResult = await makeRpcCall('eth_call', [
        { to: tokenAddress, data: '0x95d89b41' },
        'latest',
      ]);
      if (symbolResult.result && symbolResult.result !== '0x') {
        // Decode hex string to ASCII
        const hex = symbolResult.result.slice(2);
        const bytes = Buffer.from(hex, 'hex');
        symbol = bytes.toString('utf8').replace(/\0/g, '').trim() || 'UNKNOWN';
      }
    } catch (e) {
      console.log('Could not fetch token symbol');
    }

    const balance = rawBalance / Math.pow(10, decimals);

    res.json({
      token: {
        address: tokenAddress,
        symbol,
        decimals,
      },
      wallet: walletAddress,
      balance: {
        raw: rawBalance.toString(),
        formatted: balance.toFixed(6),
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BNB Wallet Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  🚀 BNB Wallet Server Running             ║
║                                           ║
║  Port: ${PORT}                              ║
║  Status: Ready                            ║
║                                           ║
║  Endpoints:                               ║
║  • GET /api/health                        ║
║  • GET /api/balance/:address              ║
║  • GET /api/token/:token/:wallet          ║
║                                           ║
║  Example:                                 ║
║  http://localhost:${PORT}/api/balance/0x... ║
╚═══════════════════════════════════════════╝
  `);
});
