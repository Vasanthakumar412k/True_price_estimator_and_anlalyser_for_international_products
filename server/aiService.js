/**
 * AI Service — Google Gemini API Integration
 * Provides: Chatbot, NLP smart search, and smart recommendations
 * Falls back gracefully if no API key is set.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { products, searchProducts, marketplaces } = require('./productDatabase');
const { dutyRates } = require('./dutyRates');

let genAI = null;
let model = null;

function initGemini(apiKey) {
  if (!apiKey) return false;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('✅ Gemini AI initialized');
    return true;
  } catch (err) {
    console.error('❌ Gemini init failed:', err.message);
    return false;
  }
}

// Build context about the product database for the AI
function getSystemContext() {
  const productList = products.map(p => `- ${p.name} (${p.category}, India: ₹${p.indiaPrice})`).join('\n');
  const categories = [...new Set(products.map(p => p.category))].join(', ');
  const storeNames = [...new Set(Object.values(marketplaces).map(m => m.name))].join(', ');
  
  return `You are an AI shopping assistant for "Global Buy vs India Price Analyzer".
You help Indian consumers decide whether to buy products in India or import from abroad.

AVAILABLE PRODUCTS IN DATABASE:
${productList}

CATEGORIES: ${categories}

STORES COVERED: ${storeNames}

COUNTRIES: USA, UK, Germany, UAE, Japan, Australia, Canada, Singapore, India

KEY RULES:
- Indian customs: BCD (Basic Customs Duty) 10-28% + IGST (GST) 3-28% depending on category
- Traveller duty-free allowance: ₹50,000 (duty only on excess)
- Always consider shipping (~$15-80), insurance (1.5%), and courier fees ($8-25)
- Answer in a friendly, helpful way
- If asked about a product in the database, provide specific prices
- If asked about a product NOT in the database, give general guidance
- Keep responses concise and useful
- Use ₹ for Indian prices, $ for USD prices`;
}

/**
 * AI Chatbot — Answer user questions about products, pricing, import rules
 */
async function chat(userMessage, conversationHistory = []) {
  // If Gemini is not available, use smart fallback
  if (!model) {
    return generateSmartFallback(userMessage);
  }

  try {
    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: getSystemContext() }] },
        { role: 'model', parts: [{ text: 'I understand! I\'m your AI shopping assistant. I\'ll help you compare prices and decide whether to buy in India or import. Ask me anything!' }] },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ]
    });

    const result = await chatSession.sendMessage(userMessage);
    return {
      success: true,
      message: result.response.text(),
      aiPowered: true
    };
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    return generateSmartFallback(userMessage);
  }
}

/**
 * NLP Smart Search — Understand natural language queries
 * e.g., "cheapest laptop under $1000" or "best headphones to import from USA"
 */
async function smartSearch(query) {
  // Always try local NLP first (fast)
  const localResults = localNLPSearch(query);
  
  // If Gemini is available, enhance with AI understanding
  if (model) {
    try {
      const prompt = `Given this search query: "${query}"
Available products: ${products.map(p => p.name).join(', ')}

Return a JSON object with:
- "matchedProducts": array of product names that match the query (max 5)
- "intent": one of "compare", "recommend", "search", "cheapest"
- "filters": { "maxPrice": number or null, "category": string or null, "country": string or null }
- "summary": brief one-line explanation of what the user wants

Return ONLY the JSON, no markdown.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(text);
      
      // Match AI suggestions to actual products
      const aiMatched = [];
      if (parsed.matchedProducts) {
        for (const name of parsed.matchedProducts) {
          const found = products.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
          if (found) aiMatched.push(found);
        }
      }
      
      return {
        success: true,
        products: aiMatched.length > 0 ? aiMatched : localResults,
        intent: parsed.intent || 'search',
        filters: parsed.filters || {},
        summary: parsed.summary || '',
        aiPowered: true
      };
    } catch (err) {
      // Fall back to local search
    }
  }
  
  return {
    success: true,
    products: localResults,
    intent: 'search',
    filters: {},
    summary: '',
    aiPowered: false
  };
}

/**
 * Local NLP Search — Works without API key
 * Understands basic patterns like "cheapest", "under $X", category names
 */
function localNLPSearch(query) {
  const q = query.toLowerCase();
  let results = [...products];
  
  // Category filtering
  const categoryMap = {
    'phone': 'Mobile Phones', 'mobile': 'Mobile Phones', 'smartphone': 'Mobile Phones',
    'laptop': 'Laptops & Computers', 'computer': 'Laptops & Computers', 'macbook': 'Laptops & Computers',
    'headphone': 'Audio Equipment', 'earphone': 'Audio Equipment', 'earbuds': 'Audio Equipment', 'audio': 'Audio Equipment',
    'watch': 'Watches', 'smartwatch': 'Watches',
    'camera': 'Photography Equipment', 'photo': 'Photography Equipment',
    'shoe': 'Footwear', 'sneaker': 'Footwear', 'footwear': 'Footwear',
    'clothes': 'Fashion & Clothing', 'fashion': 'Fashion & Clothing', 'jacket': 'Fashion & Clothing', 'jeans': 'Fashion & Clothing',
    'cosmetic': 'Cosmetics & Beauty', 'beauty': 'Cosmetics & Beauty', 'skincare': 'Cosmetics & Beauty',
    'gold': 'Jewelry & Accessories', 'jewelry': 'Jewelry & Accessories', 'diamond': 'Jewelry & Accessories',
    'kitchen': 'Kitchen Appliances', 'coffee': 'Kitchen Appliances', 'mixer': 'Kitchen Appliances',
    'vacuum': 'Home Appliances', 'appliance': 'Home Appliances',
    'drone': 'Drones & Robotics', 'dji': 'Drones & Robotics',
    'gaming': 'Electronics', 'ps5': 'Electronics', 'xbox': 'Electronics', 'nintendo': 'Electronics',
    'health': 'Health & Personal Care', 'medical': 'Health & Personal Care', 'medicine': 'Health & Personal Care',
    'tool': 'Tools & Hardware', 'drill': 'Tools & Hardware',
  };
  
  for (const [keyword, cat] of Object.entries(categoryMap)) {
    if (q.includes(keyword)) {
      results = results.filter(p => p.category === cat);
      break;
    }
  }
  
  // Price filtering: "under $500", "below ₹50000"
  const priceMatch = q.match(/(?:under|below|less than|max|budget)\s*[\$₹]?\s*(\d+[,.]?\d*)/i);
  if (priceMatch) {
    const maxPrice = parseFloat(priceMatch[1].replace(',', ''));
    if (q.includes('$') || q.includes('usd') || q.includes('dollar')) {
      results = results.filter(p => {
        const usdListing = p.listings.find(l => marketplaces[l.marketplace]?.currency === 'USD');
        return usdListing && usdListing.price <= maxPrice;
      });
    } else {
      results = results.filter(p => p.indiaPrice <= maxPrice);
    }
  }
  
  // Cheapest / best value sorting
  if (q.includes('cheapest') || q.includes('cheap') || q.includes('budget') || q.includes('affordable')) {
    results.sort((a, b) => a.indiaPrice - b.indiaPrice);
  }
  
  // Keyword matching as final filter
  if (results.length === products.length) {
    results = searchProducts(query);
  }
  
  return results.slice(0, 8).map(p => ({
    id: p.id, name: p.name, category: p.category, image: p.image,
    indiaPrice: p.indiaPrice, weight: p.weight,
    listingCount: p.listings?.length || 0,
    countries: p.listings ? [...new Set(p.listings.map(l => marketplaces[l.marketplace]?.country).filter(Boolean))] : [],
    stores: p.listings ? [...new Set(p.listings.map(l => marketplaces[l.marketplace]?.name).filter(Boolean))] : []
  }));
}

/**
 * Smart Fallback — Rule-based responses when Gemini is unavailable
 */
function generateSmartFallback(userMessage) {
  const q = userMessage.toLowerCase();
  let response = '';
  
  // Product-specific questions
  const matchedProducts = searchProducts(q);
  if (matchedProducts.length > 0) {
    const p = matchedProducts[0];
    response = `📱 **${p.name}**\n\n🇮🇳 India Price: ₹${p.indiaPrice?.toLocaleString()}\n📦 Available in ${p.listings?.length || 0} stores\n\nUse the Auto Analyzer to see the full import cost comparison!`;
  }
  // General questions
  else if (q.includes('duty') || q.includes('customs') || q.includes('tax')) {
    response = `🏛️ **Indian Import Duties:**\n\n• Mobile Phones: 20% BCD + 18% IGST\n• Laptops: 15% BCD + 18% IGST\n• Electronics: 20% BCD + 18% IGST\n• Cosmetics: 28% BCD + 28% IGST\n• Gold/Jewelry: 15% BCD + 3% IGST\n• Clothing: 25% BCD + 12% IGST\n\nThe duty is calculated on the assessable value (product + shipping + insurance).`;
  }
  else if (q.includes('traveller') || q.includes('travel') || q.includes('carry') || q.includes('bring')) {
    response = `✈️ **Traveller's Duty-Free Allowance:**\n\n• You can bring goods worth up to **₹50,000** without paying any duty\n• Above ₹50,000, duty is charged on the excess amount only\n• No shipping or courier costs\n• Select "Traveller Mode" when analyzing`;
  }
  else if (q.includes('cheapest') || q.includes('recommend')) {
    response = `💡 **Tips for finding the cheapest option:**\n\n1. Search the product using the Auto Analyzer\n2. Compare prices across all 24 stores\n3. Check eBay — often has lower prices than Amazon\n4. UAE (Dubai) is often cheaper for electronics\n5. UK/Germany can be cheaper for fashion\n6. Traveller mode saves shipping costs`;
  }
  else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    response = `👋 Hello! I'm your AI shopping assistant.\n\nI can help you with:\n• Product prices across countries\n• Import duty calculations\n• Traveller duty-free rules\n• Shopping recommendations\n\nJust ask me anything!`;
  }
  else {
    response = `I can help you with:\n\n🛒 **Product prices** — "How much is iPhone 16 Pro?"\n🏛️ **Import duties** — "What is the customs duty on laptops?"\n✈️ **Traveller rules** — "What is the duty-free allowance?"\n💡 **Recommendations** — "What's the cheapest headphone?"\n\nTry asking one of these!`;
  }
  
  return { success: true, message: response, aiPowered: false };
}

/**
 * Price Prediction — Algorithmic trend prediction
 * Uses seasonal patterns and market trends to estimate future prices
 */
function predictPrice(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return { success: false, error: 'Product not found' };
  
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  // Seasonal factors (electronics typically cheaper during sales)
  const seasonalFactors = {
    0: 0.95,   // January — New Year sales
    1: 0.98,   // February
    2: 0.99,   // March
    3: 1.0,    // April
    4: 1.0,    // May
    5: 0.97,   // June — Summer sales
    6: 0.93,   // July — Amazon Prime Day
    7: 0.98,   // August
    8: 1.02,   // September — New launches
    9: 0.95,   // October — Diwali/Festival sales
    10: 0.88,  // November — Black Friday
    11: 0.92,  // December — Year-end sales
  };
  
  const currentFactor = seasonalFactors[month];
  const predictions = [];
  
  for (let i = 1; i <= 6; i++) {
    const futureMonth = (month + i) % 12;
    const futureFactor = seasonalFactors[futureMonth];
    const monthName = new Date(2026, futureMonth).toLocaleString('en', { month: 'long' });
    
    predictions.push({
      month: monthName,
      monthIndex: futureMonth,
      indiaPrice: Math.round(product.indiaPrice * futureFactor),
      changePercent: Math.round((futureFactor - currentFactor) * 100 * 10) / 10,
      trend: futureFactor < currentFactor ? 'down' : futureFactor > currentFactor ? 'up' : 'stable',
      isSaleSeason: futureFactor < 0.95,
      bestTimeToBuy: futureFactor <= 0.93
    });
  }
  
  const bestMonth = predictions.reduce((best, p) => p.indiaPrice < best.indiaPrice ? p : best, predictions[0]);
  
  return {
    success: true,
    product: { id: product.id, name: product.name, currentPrice: product.indiaPrice },
    currentMonth: new Date(2026, month).toLocaleString('en', { month: 'long' }),
    currentFactor,
    predictions,
    bestMonth: bestMonth.month,
    bestPrice: bestMonth.indiaPrice,
    analysis: bestMonth.bestTimeToBuy
      ? `🔥 Best time to buy: ${bestMonth.month} (estimated ₹${bestMonth.indiaPrice.toLocaleString()} — save ₹${(product.indiaPrice - bestMonth.indiaPrice).toLocaleString()})`
      : `Current price is reasonable. Next sale expected in ${bestMonth.month}.`,
    aiPowered: false,
    note: 'Predictions based on seasonal trends and historical sale patterns. Actual prices may vary.'
  };
}

module.exports = { initGemini, chat, smartSearch, predictPrice };
