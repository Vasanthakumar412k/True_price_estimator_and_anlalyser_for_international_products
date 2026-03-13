/**
 * Link Analyzer — Parse product URLs and match to database
 * Supports: Amazon (US/UK/DE/AE/JP/AU/CA/SG/IN), eBay, Walmart, 
 * Best Buy, Target, Flipkart, Noon, Currys, MediaMarkt, Rakuten, etc.
 */

const { products, marketplaces } = require('./productDatabase');

// URL pattern matchers for supported stores
const storePatterns = [
  { pattern: /amazon\.com(?:\/|$)/i,      store: 'Amazon US',     country: 'United States',        currency: 'USD', marketplace: 'amazon-us' },
  { pattern: /amazon\.co\.uk/i,            store: 'Amazon UK',     country: 'United Kingdom',       currency: 'GBP', marketplace: 'amazon-uk' },
  { pattern: /amazon\.de/i,                store: 'Amazon DE',     country: 'Germany',              currency: 'EUR', marketplace: 'amazon-de' },
  { pattern: /amazon\.ae/i,                store: 'Amazon AE',     country: 'United Arab Emirates', currency: 'AED', marketplace: 'amazon-ae' },
  { pattern: /amazon\.co\.jp/i,            store: 'Amazon JP',     country: 'Japan',                currency: 'JPY', marketplace: 'amazon-jp' },
  { pattern: /amazon\.com\.au/i,           store: 'Amazon AU',     country: 'Australia',            currency: 'AUD', marketplace: 'amazon-au' },
  { pattern: /amazon\.ca/i,                store: 'Amazon CA',     country: 'Canada',               currency: 'CAD', marketplace: 'amazon-ca' },
  { pattern: /amazon\.sg/i,                store: 'Amazon SG',     country: 'Singapore',            currency: 'SGD', marketplace: 'amazon-sg' },
  { pattern: /amazon\.in/i,                store: 'Amazon IN',     country: 'India',                currency: 'INR', marketplace: 'amazon-in' },
  { pattern: /ebay\.com(?:\/|$)/i,         store: 'eBay US',       country: 'United States',        currency: 'USD', marketplace: 'ebay-us' },
  { pattern: /ebay\.co\.uk/i,              store: 'eBay UK',       country: 'United Kingdom',       currency: 'GBP', marketplace: 'ebay-uk' },
  { pattern: /ebay\.de/i,                  store: 'eBay DE',       country: 'Germany',              currency: 'EUR', marketplace: 'ebay-de' },
  { pattern: /ebay\.com\.au/i,             store: 'eBay AU',       country: 'Australia',            currency: 'AUD', marketplace: 'ebay-au' },
  { pattern: /walmart\.com/i,              store: 'Walmart US',    country: 'United States',        currency: 'USD', marketplace: 'walmart-us' },
  { pattern: /bestbuy\.com/i,              store: 'Best Buy US',   country: 'United States',        currency: 'USD', marketplace: 'bestbuy-us' },
  { pattern: /target\.com/i,               store: 'Target US',     country: 'United States',        currency: 'USD', marketplace: 'target-us' },
  { pattern: /noon\.com/i,                 store: 'Noon AE',       country: 'United Arab Emirates', currency: 'AED', marketplace: 'noon-ae' },
  { pattern: /flipkart\.com/i,             store: 'Flipkart',      country: 'India',                currency: 'INR', marketplace: 'flipkart-in' },
  { pattern: /croma\.com/i,                store: 'Croma',         country: 'India',                currency: 'INR', marketplace: 'croma-in' },
  { pattern: /currys\.co\.uk/i,            store: 'Currys UK',     country: 'United Kingdom',       currency: 'GBP', marketplace: 'currys-uk' },
  { pattern: /mediamarkt\.de/i,            store: 'MediaMarkt',    country: 'Germany',              currency: 'EUR', marketplace: 'mediamarkt-de' },
  { pattern: /rakuten\.co\.jp/i,           store: 'Rakuten',       country: 'Japan',                currency: 'JPY', marketplace: 'rakuten-jp' },
  { pattern: /yodobashi\.com/i,            store: 'Yodobashi',     country: 'Japan',                currency: 'JPY', marketplace: 'yodobashi-jp' },
  { pattern: /jbhifi\.com\.au/i,           store: 'JB Hi-Fi',      country: 'Australia',            currency: 'AUD', marketplace: 'jb-hifi-au' },
];

/**
 * Detect which store a URL belongs to
 */
function detectStore(url) {
  for (const sp of storePatterns) {
    if (sp.pattern.test(url)) {
      return { store: sp.store, country: sp.country, currency: sp.currency, marketplace: sp.marketplace };
    }
  }
  return null;
}

/**
 * Extract product name hints from the URL path
 * e.g., /dp/B0BDHWDR12/Apple-iPhone-14-Pro -> ["apple", "iphone", "14", "pro"]
 */
function extractKeywordsFromURL(url) {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname
      .replace(/\/dp\/[A-Z0-9]+\/?/i, ' ')   // Remove Amazon ASIN
      .replace(/\/ip\/[0-9]+/i, ' ')          // Remove Walmart item ID
      .replace(/\/p\/[a-z0-9-]+/i, ' ')       // Remove generic product IDs
      .replace(/[\/\-\_\+]/g, ' ')            // Convert separators to spaces
      .replace(/\.(html|htm|php|asp)/g, '')   // Remove extensions
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 2 && !/^(www|com|ref|dp|gp|product|item|buy|shop|index|detail|page)$/.test(w));
    
    // Also check query params for title
    const titleParam = parsed.searchParams.get('title') || parsed.searchParams.get('q') || '';
    const titleWords = titleParam.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    return [...new Set([...pathParts, ...titleWords])];
  } catch {
    return [];
  }
}

/**
 * Match URL keywords to products in the database
 */
function findMatchingProduct(keywords, storeInfo) {
  if (keywords.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const product of products) {
    let score = 0;
    const nameLower = product.name.toLowerCase();
    const kws = product.keywords || [];

    for (const word of keywords) {
      if (nameLower.includes(word)) score += 10;
      if (kws.some(k => k.includes(word))) score += 8;
    }

    // Bonus if the product has a listing in the detected store
    if (storeInfo && product.listings) {
      const hasListing = product.listings.some(l => l.marketplace === storeInfo.marketplace);
      if (hasListing) score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  }

  return bestScore >= 10 ? bestMatch : null;
}

/**
 * Analyze a pasted product link
 * Returns: store info, matched product, estimated details
 */
function analyzeLink(url) {
  // Validate URL
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return { success: false, error: 'Please paste a valid product URL starting with http:// or https://' };
  }

  // Detect store
  const storeInfo = detectStore(url);
  if (!storeInfo) {
    return {
      success: false,
      error: 'Store not recognized. We support: Amazon (all regions), eBay, Walmart, Best Buy, Target, Flipkart, Noon, Currys, MediaMarkt, Rakuten, Yodobashi, JB Hi-Fi, and Croma.'
    };
  }

  // Extract keywords from URL
  const keywords = extractKeywordsFromURL(url);

  // Find matching product
  const matchedProduct = findMatchingProduct(keywords, storeInfo);

  // Get the listing price if product matched
  let listingPrice = null;
  let listingInfo = null;
  if (matchedProduct && matchedProduct.listings) {
    const listing = matchedProduct.listings.find(l => l.marketplace === storeInfo.marketplace);
    if (listing) {
      listingPrice = listing.price;
      listingInfo = listing;
    }
  }

  return {
    success: true,
    url,
    store: storeInfo,
    keywords,
    matchedProduct: matchedProduct ? {
      id: matchedProduct.id,
      name: matchedProduct.name,
      category: matchedProduct.category,
      image: matchedProduct.image,
      weight: matchedProduct.weight,
      indiaPrice: matchedProduct.indiaPrice,
    } : null,
    listingPrice,
    message: matchedProduct
      ? `Found **${matchedProduct.name}** on **${storeInfo.store}** (${storeInfo.country})`
      : `Detected store: **${storeInfo.store}** (${storeInfo.country}). Could not identify the exact product — try using the Auto Analyzer to search by product name.`
  };
}

module.exports = { analyzeLink, detectStore, extractKeywordsFromURL };
