require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { calculateLandedCost } = require('./calculator');
const { dutyRates, countries, currencies } = require('./dutyRates');
const { searchProducts, products, marketplaces, getShippingEstimate, getInsuranceEstimate, getCourierFee, getDeliveryEstimate } = require('./productDatabase');
const { initGemini, chat, smartSearch, predictPrice } = require('./aiService');
const { analyzeLink } = require('./linkAnalyzer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File-based storage for saved comparisons
const DATA_DIR = path.join(__dirname, 'data');
const COMPARISONS_FILE = path.join(DATA_DIR, 'comparisons.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(COMPARISONS_FILE)) {
  fs.writeFileSync(COMPARISONS_FILE, JSON.stringify([]));
}

function readComparisons() {
  try {
    return JSON.parse(fs.readFileSync(COMPARISONS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeComparisons(data) {
  fs.writeFileSync(COMPARISONS_FILE, JSON.stringify(data, null, 2));
}

// Cache exchange rates for 30 minutes
let rateCache = {};
let rateCacheTimestamp = 0;
const CACHE_TTL = 30 * 60 * 1000;

// ---- API ROUTES ----

// GET /api/rates/:base — Fetch live exchange rates
app.get('/api/rates/:base', async (req, res) => {
  const base = req.params.base.toUpperCase();
  const now = Date.now();

  if (rateCache[base] && (now - rateCacheTimestamp) < CACHE_TTL) {
    return res.json({ success: true, base, rates: rateCache[base] });
  }

  try {
    const response = await axios.get(`https://open.er-api.com/v6/latest/${base}`);
    if (response.data && response.data.rates) {
      rateCache[base] = response.data.rates;
      rateCacheTimestamp = now;
      return res.json({ success: true, base, rates: response.data.rates });
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.error('Exchange rate API error:', error.message);
    // Fallback rates (approximate)
    const fallbackRates = {
      USD: { INR: 83.5 },
      EUR: { INR: 91.2 },
      GBP: { INR: 106.5 },
      AED: { INR: 22.7 },
      JPY: { INR: 0.56 },
      CNY: { INR: 11.6 },
      KRW: { INR: 0.063 },
      AUD: { INR: 54.5 },
      CAD: { INR: 62.1 },
      SGD: { INR: 62.8 },
      HKD: { INR: 10.7 },
      THB: { INR: 2.38 },
      MYR: { INR: 17.9 },
      TRY: { INR: 2.67 },
      SAR: { INR: 22.3 },
      CHF: { INR: 95.6 },
      SEK: { INR: 8.2 },
      NZD: { INR: 51.2 },
      BRL: { INR: 17.1 },
      MXN: { INR: 4.85 },
      RUB: { INR: 0.91 },
      TWD: { INR: 2.66 },
      IDR: { INR: 0.0054 },
      VND: { INR: 0.0034 },
      PHP: { INR: 1.49 },
      BDT: { INR: 0.76 }
    };
    const rates = fallbackRates[base] || { INR: 83.5 };
    return res.json({ success: true, base, rates, fallback: true });
  }
});

// POST /api/calculate — Calculate landed cost
app.post('/api/calculate', async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      currency,
      shippingCost,
      insuranceCost,
      courierFees,
      category,
      importMethod,
      indiaPrice,
      country
    } = req.body;

    if (!productPrice || !currency) {
      return res.status(400).json({ error: 'Product price and currency are required' });
    }

    // Get exchange rate
    let exchangeRate = 1;
    try {
      const rateRes = await axios.get(`https://open.er-api.com/v6/latest/${currency}`);
      if (rateRes.data && rateRes.data.rates && rateRes.data.rates.INR) {
        exchangeRate = rateRes.data.rates.INR;
      }
    } catch {
      // Use cached or fallback
      if (rateCache[currency] && rateCache[currency].INR) {
        exchangeRate = rateCache[currency].INR;
      } else {
        exchangeRate = 83.5; // Approximate USD/INR fallback
      }
    }

    const result = calculateLandedCost({
      productPrice: parseFloat(productPrice),
      currency,
      exchangeRate,
      shippingCost: parseFloat(shippingCost) || 0,
      insuranceCost: parseFloat(insuranceCost) || 0,
      courierFees: parseFloat(courierFees) || 0,
      category: category || 'Other',
      importMethod: importMethod || 'online',
      indiaPrice: indiaPrice ? parseFloat(indiaPrice) : null
    });

    result.productName = productName || 'Unknown Product';
    result.currency = currency;
    result.country = country || 'Unknown';
    result.originalPrice = parseFloat(productPrice);
    result.exchangeRate = exchangeRate;

    return res.json({ success: true, result });
  } catch (error) {
    console.error('Calculation error:', error.message);
    return res.status(500).json({ error: 'Calculation failed' });
  }
});

// POST /api/comparisons — Save a comparison
app.post('/api/comparisons', (req, res) => {
  try {
    const comparison = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const comparisons = readComparisons();
    comparisons.unshift(comparison);
    writeComparisons(comparisons);
    return res.json({ success: true, comparison });
  } catch (error) {
    console.error('Save error:', error.message);
    return res.status(500).json({ error: 'Failed to save comparison' });
  }
});

// GET /api/comparisons — List saved comparisons
app.get('/api/comparisons', (req, res) => {
  try {
    const comparisons = readComparisons();
    return res.json({ success: true, comparisons });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load comparisons' });
  }
});

// DELETE /api/comparisons/:id — Delete a comparison
app.delete('/api/comparisons/:id', (req, res) => {
  try {
    let comparisons = readComparisons();
    comparisons = comparisons.filter(c => c.id !== req.params.id);
    writeComparisons(comparisons);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete comparison' });
  }
});

// GET /api/duty-rates — Return all duty rates
app.get('/api/duty-rates', (req, res) => {
  return res.json({ success: true, dutyRates });
});

// GET /api/countries — Return supported countries
app.get('/api/countries', (req, res) => {
  return res.json({ success: true, countries });
});

// GET /api/currencies — Return supported currencies
app.get('/api/currencies', (req, res) => {
  return res.json({ success: true, currencies });
});

// ---- MARKETPLACE-AWARE ENDPOINTS ----

// GET /api/products/search?q=iphone
app.get('/api/products/search', (req, res) => {
  const query = req.query.q || '';
  const results = searchProducts(query);
  return res.json({ success: true, products: results.map(p => ({
    id: p.id, name: p.name, category: p.category, image: p.image,
    indiaPrice: p.indiaPrice, weight: p.weight,
    listingCount: p.listings.length,
    countries: [...new Set(p.listings.map(l => marketplaces[l.marketplace]?.country).filter(Boolean))],
    stores: [...new Set(p.listings.map(l => marketplaces[l.marketplace]?.name).filter(Boolean))]
  }))});
});

// GET /api/products
app.get('/api/products', (req, res) => {
  return res.json({ success: true, products: products.map(p => ({
    id: p.id, name: p.name, category: p.category, image: p.image,
    indiaPrice: p.indiaPrice, weight: p.weight,
    listingCount: p.listings.length
  }))});
});

// GET /api/marketplaces
app.get('/api/marketplaces', (req, res) => {
  return res.json({ success: true, marketplaces });
});

// POST /api/auto-analyze — Full marketplace analysis
app.post('/api/auto-analyze', async (req, res) => {
  try {
    const { productId, importMethod = 'online' } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Get exchange rates for all needed currencies
    const neededCurrencies = [...new Set(product.listings.map(l => marketplaces[l.marketplace]?.currency).filter(c => c && c !== 'INR'))];
    const exchangeRates = { INR: 1 };
    for (const currency of neededCurrencies) {
      try {
        if (rateCache[currency] && (Date.now() - rateCacheTimestamp) < CACHE_TTL) {
          exchangeRates[currency] = rateCache[currency].INR || 83.5;
        } else {
          const rateRes = await axios.get(`https://open.er-api.com/v6/latest/${currency}`);
          if (rateRes.data && rateRes.data.rates) {
            rateCache[currency] = rateRes.data.rates;
            rateCacheTimestamp = Date.now();
            exchangeRates[currency] = rateRes.data.rates.INR || 83.5;
          }
        }
      } catch {
        const fb = { USD:83.5,EUR:91.2,GBP:106.5,AED:22.7,JPY:0.56,AUD:54.5,CAD:62.1,SGD:62.8,CNY:11.6,KRW:0.063,HKD:10.7,CHF:95.6,SAR:22.3,SEK:8.2 };
        exchangeRates[currency] = fb[currency] || 83.5;
      }
    }

    const allListings = [];
    const indiaListings = [];

    for (const listing of product.listings) {
      const mp = marketplaces[listing.marketplace];
      if (!mp) continue;
      const currency = mp.currency;
      if (mp.country === 'India') {
        indiaListings.push({ marketplace: mp.id, marketplaceName: mp.name, icon: mp.icon, url: mp.url, country: 'India', currency: 'INR', price: listing.price, priceINR: listing.price, isIndian: true, delivery: getDeliveryEstimate('India') });
        continue;
      }
      const exchangeRate = exchangeRates[currency] || 83.5;
      const shippingCost = importMethod === 'online' ? getShippingEstimate(product.weight) : 0;
      const insuranceCost = importMethod === 'online' ? getInsuranceEstimate(listing.price) : 0;
      const courierFees = importMethod === 'online' ? getCourierFee(product.weight) : 0;

      const calcResult = calculateLandedCost({
        productPrice: listing.price, currency, exchangeRate, shippingCost, insuranceCost, courierFees,
        category: product.category, importMethod, indiaPrice: product.indiaPrice
      });
      allListings.push({
        marketplace: mp.id, marketplaceName: mp.name, icon: mp.icon, url: mp.url,
        country: mp.country, currency, price: listing.price, exchangeRate,
        delivery: getDeliveryEstimate(mp.country),
        ...calcResult, productName: product.name, isIndian: false
      });
    }

    allListings.sort((a, b) => a.totalLandedCost - b.totalLandedCost);
    const countryBest = {};
    for (const l of allListings) { if (!countryBest[l.country]) countryBest[l.country] = l; }
    const countryResults = Object.values(countryBest).sort((a, b) => a.totalLandedCost - b.totalLandedCost);

    const cheapestImport = allListings.length > 0 ? allListings[0] : null;
    const cheapestIndia = indiaListings.length > 0 ? indiaListings.reduce((min, l) => l.price < min.price ? l : min, indiaListings[0]) : null;

    return res.json({
      success: true,
      product: { id: product.id, name: product.name, category: product.category, image: product.image, weight: product.weight, indiaPrice: product.indiaPrice },
      allListings, indiaListings, countryResults,
      cheapestImport, cheapestIndia,
      totalStoresSearched: product.listings.length,
      countriesFound: [...new Set([...allListings.map(l => l.country), 'India'])]
    });
  } catch (error) {
    console.error('Auto-analyze error:', error.message);
    return res.status(500).json({ error: 'Auto analysis failed' });
  }
});

// ---- AI ENDPOINTS ----

// POST /api/ai/chat — AI Chatbot
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    const result = await chat(message, history);
    return res.json(result);
  } catch (error) {
    console.error('AI chat error:', error.message);
    return res.status(500).json({ error: 'Chat failed' });
  }
});

// POST /api/ai/smart-search — NLP Smart Search
app.post('/api/ai/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });
    const result = await smartSearch(query);
    return res.json(result);
  } catch (error) {
    console.error('Smart search error:', error.message);
    return res.status(500).json({ error: 'Smart search failed' });
  }
});

// GET /api/ai/predict/:productId — Price Prediction
app.get('/api/ai/predict/:productId', (req, res) => {
  const result = predictPrice(req.params.productId);
  return res.json(result);
});

// POST /api/ai/analyze-link — Analyze a pasted product URL
app.post('/api/ai/analyze-link', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    const linkResult = analyzeLink(url);
    if (!linkResult.success) return res.json(linkResult);

    // If product matched, calculate import cost
    if (linkResult.matchedProduct && linkResult.listingPrice && linkResult.store.country !== 'India') {
      const currency = linkResult.store.currency;
      const importMethod = 'online';

      try {
        const rateRes = await axios.get(`https://open.er-api.com/v6/latest/${currency}`);
        const exchangeRate = rateRes.data?.rates?.INR || 83.5;

        const product = products.find(p => p.id === linkResult.matchedProduct.id);
        const shippingCost = getShippingEstimate(product.weight);
        const insuranceCost = getInsuranceEstimate(linkResult.listingPrice);
        const courierFees = getCourierFee(product.weight);
        const delivery = getDeliveryEstimate(linkResult.store.country);

        const calcResult = calculateLandedCost({
          productPrice: linkResult.listingPrice, currency, exchangeRate,
          shippingCost, insuranceCost, courierFees,
          category: product.category, importMethod,
          indiaPrice: product.indiaPrice
        });

        linkResult.importCost = {
          ...calcResult,
          exchangeRate, delivery,
          shippingCost, insuranceCost, courierFees,
          indiaPrice: product.indiaPrice,
          savings: product.indiaPrice - calcResult.totalLandedCost,
          recommendation: calcResult.totalLandedCost < product.indiaPrice ? 'import' : 'india'
        };
      } catch (e) {
        linkResult.rateError = 'Could not fetch exchange rate';
      }
    }

    return res.json(linkResult);
  } catch (error) {
    console.error('Link analysis error:', error.message);
    return res.status(500).json({ error: 'Link analysis failed' });
  }
});

// GET /api/ai/status — Check AI status
app.get('/api/ai/status', (req, res) => {
  return res.json({
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    features: {
      chatbot: true,
      smartSearch: true,
      pricePrediction: true,
      linkAnalyzer: true,
      aiPowered: !!process.env.GEMINI_API_KEY
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  // Initialize Gemini AI if key is available
  if (process.env.GEMINI_API_KEY) {
    initGemini(process.env.GEMINI_API_KEY);
  } else {
    console.log('ℹ️  No GEMINI_API_KEY set — AI chatbot will use smart fallback mode');
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints ready at http://localhost:${PORT}/api`);
  console.log(`🤖 AI features: chatbot, smart search, price prediction`);
});
