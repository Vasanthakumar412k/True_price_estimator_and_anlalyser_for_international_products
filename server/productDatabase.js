/**
 * Global Marketplace Product Database
 * Each product has prices from multiple marketplaces across countries.
 * This simulates aggregated marketplace data.
 * In production, these would connect to real marketplace APIs.
 */

// Marketplace definitions
const marketplaces = {
  'amazon-us':   { id: 'amazon-us',   name: 'Amazon US',  country: 'United States',        currency: 'USD', icon: '🛒', url: 'amazon.com' },
  'amazon-uk':   { id: 'amazon-uk',   name: 'Amazon UK',  country: 'United Kingdom',       currency: 'GBP', icon: '🛒', url: 'amazon.co.uk' },
  'amazon-de':   { id: 'amazon-de',   name: 'Amazon DE',  country: 'Germany',              currency: 'EUR', icon: '🛒', url: 'amazon.de' },
  'amazon-ae':   { id: 'amazon-ae',   name: 'Amazon AE',  country: 'United Arab Emirates', currency: 'AED', icon: '🛒', url: 'amazon.ae' },
  'amazon-jp':   { id: 'amazon-jp',   name: 'Amazon JP',  country: 'Japan',                currency: 'JPY', icon: '🛒', url: 'amazon.co.jp' },
  'amazon-au':   { id: 'amazon-au',   name: 'Amazon AU',  country: 'Australia',            currency: 'AUD', icon: '🛒', url: 'amazon.com.au' },
  'amazon-ca':   { id: 'amazon-ca',   name: 'Amazon CA',  country: 'Canada',               currency: 'CAD', icon: '🛒', url: 'amazon.ca' },
  'amazon-sg':   { id: 'amazon-sg',   name: 'Amazon SG',  country: 'Singapore',            currency: 'SGD', icon: '🛒', url: 'amazon.sg' },
  'amazon-in':   { id: 'amazon-in',   name: 'Amazon IN',  country: 'India',                currency: 'INR', icon: '🛒', url: 'amazon.in' },
  'ebay-us':     { id: 'ebay-us',     name: 'eBay US',    country: 'United States',        currency: 'USD', icon: '🏷️', url: 'ebay.com' },
  'ebay-uk':     { id: 'ebay-uk',     name: 'eBay UK',    country: 'United Kingdom',       currency: 'GBP', icon: '🏷️', url: 'ebay.co.uk' },
  'ebay-de':     { id: 'ebay-de',     name: 'eBay DE',    country: 'Germany',              currency: 'EUR', icon: '🏷️', url: 'ebay.de' },
  'ebay-au':     { id: 'ebay-au',     name: 'eBay AU',    country: 'Australia',            currency: 'AUD', icon: '🏷️', url: 'ebay.com.au' },
  'walmart-us':  { id: 'walmart-us',  name: 'Walmart US', country: 'United States',        currency: 'USD', icon: '🏪', url: 'walmart.com' },
  'bestbuy-us':  { id: 'bestbuy-us',  name: 'Best Buy US',country: 'United States',        currency: 'USD', icon: '💻', url: 'bestbuy.com' },
  'target-us':   { id: 'target-us',   name: 'Target US',  country: 'United States',        currency: 'USD', icon: '🎯', url: 'target.com' },
  'noon-ae':     { id: 'noon-ae',     name: 'Noon AE',    country: 'United Arab Emirates', currency: 'AED', icon: '☀️', url: 'noon.com' },
  'flipkart-in': { id: 'flipkart-in', name: 'Flipkart',   country: 'India',                currency: 'INR', icon: '🛍️', url: 'flipkart.com' },
  'croma-in':    { id: 'croma-in',    name: 'Croma',      country: 'India',                currency: 'INR', icon: '📺', url: 'croma.com' },
  'jb-hifi-au':  { id: 'jb-hifi-au',  name: 'JB Hi-Fi',   country: 'Australia',            currency: 'AUD', icon: '🎵', url: 'jbhifi.com.au' },
  'currys-uk':   { id: 'currys-uk',   name: 'Currys UK',  country: 'United Kingdom',       currency: 'GBP', icon: '⚡', url: 'currys.co.uk' },
  'mediamarkt-de':{ id: 'mediamarkt-de', name: 'MediaMarkt', country: 'Germany',           currency: 'EUR', icon: '🔴', url: 'mediamarkt.de' },
  'rakuten-jp':  { id: 'rakuten-jp',  name: 'Rakuten',    country: 'Japan',                currency: 'JPY', icon: '🇯🇵', url: 'rakuten.co.jp' },
  'yodobashi-jp':{ id: 'yodobashi-jp',name: 'Yodobashi',  country: 'Japan',                currency: 'JPY', icon: '📷', url: 'yodobashi.com' },
};

const products = [
  // ===== MOBILE PHONES =====
  {
    id: 'iphone-16-pro-max', name: 'Apple iPhone 16 Pro Max 256GB',
    category: 'Mobile Phones', weight: 0.3, image: '📱',
    keywords: ['iphone', 'apple', 'iphone 16', 'iphone pro', 'iphone pro max', '16 pro max'],
    listings: [
      { marketplace: 'amazon-us', price: 1199 }, { marketplace: 'bestbuy-us', price: 1199 },
      { marketplace: 'walmart-us', price: 1199 }, { marketplace: 'amazon-uk', price: 1199 },
      { marketplace: 'currys-uk', price: 1199 }, { marketplace: 'amazon-de', price: 1449 },
      { marketplace: 'amazon-ae', price: 5099 }, { marketplace: 'noon-ae', price: 4999 },
      { marketplace: 'amazon-jp', price: 189800 }, { marketplace: 'rakuten-jp', price: 186000 },
      { marketplace: 'amazon-au', price: 2149 }, { marketplace: 'jb-hifi-au', price: 2099 },
      { marketplace: 'amazon-ca', price: 1649 }, { marketplace: 'amazon-sg', price: 1899 },
      { marketplace: 'ebay-us', price: 1149 }, { marketplace: 'ebay-uk', price: 1099 },
      { marketplace: 'amazon-in', price: 144900 }, { marketplace: 'flipkart-in', price: 143999 },
      { marketplace: 'croma-in', price: 144900 },
    ],
    indiaPrice: 143999
  },
  {
    id: 'iphone-16-pro', name: 'Apple iPhone 16 Pro 128GB',
    category: 'Mobile Phones', weight: 0.2, image: '📱',
    keywords: ['iphone', 'apple', 'iphone 16 pro', 'iphone pro'],
    listings: [
      { marketplace: 'amazon-us', price: 999 }, { marketplace: 'bestbuy-us', price: 999 },
      { marketplace: 'walmart-us', price: 999 }, { marketplace: 'amazon-uk', price: 999 },
      { marketplace: 'amazon-de', price: 1199 }, { marketplace: 'amazon-ae', price: 4299 },
      { marketplace: 'noon-ae', price: 4199 }, { marketplace: 'amazon-jp', price: 159800 },
      { marketplace: 'amazon-au', price: 1799 }, { marketplace: 'amazon-ca', price: 1399 },
      { marketplace: 'ebay-us', price: 949 }, { marketplace: 'ebay-uk', price: 949 },
      { marketplace: 'amazon-in', price: 119900 }, { marketplace: 'flipkart-in', price: 119499 },
    ],
    indiaPrice: 119499
  },
  {
    id: 'iphone-16', name: 'Apple iPhone 16 128GB',
    category: 'Mobile Phones', weight: 0.17, image: '📱',
    keywords: ['iphone', 'apple', 'iphone 16'],
    listings: [
      { marketplace: 'amazon-us', price: 799 }, { marketplace: 'bestbuy-us', price: 799 },
      { marketplace: 'amazon-uk', price: 799 }, { marketplace: 'amazon-de', price: 949 },
      { marketplace: 'amazon-ae', price: 3399 }, { marketplace: 'amazon-jp', price: 124800 },
      { marketplace: 'amazon-au', price: 1399 }, { marketplace: 'amazon-ca', price: 1129 },
      { marketplace: 'ebay-us', price: 759 },
      { marketplace: 'amazon-in', price: 79900 }, { marketplace: 'flipkart-in', price: 79499 },
    ],
    indiaPrice: 79499
  },
  {
    id: 'samsung-s24-ultra', name: 'Samsung Galaxy S24 Ultra 256GB',
    category: 'Mobile Phones', weight: 0.23, image: '📱',
    keywords: ['samsung', 'galaxy', 's24', 'ultra', 'samsung s24', 'galaxy s24 ultra'],
    listings: [
      { marketplace: 'amazon-us', price: 1299 }, { marketplace: 'bestbuy-us', price: 1299 },
      { marketplace: 'amazon-uk', price: 1299 }, { marketplace: 'amazon-de', price: 1449 },
      { marketplace: 'amazon-ae', price: 4799 }, { marketplace: 'noon-ae', price: 4699 },
      { marketplace: 'amazon-jp', price: 189800 }, { marketplace: 'amazon-au', price: 2199 },
      { marketplace: 'ebay-us', price: 1199 }, { marketplace: 'ebay-uk', price: 1199 },
      { marketplace: 'amazon-in', price: 129999 }, { marketplace: 'flipkart-in', price: 127999 },
    ],
    indiaPrice: 127999
  },
  {
    id: 'samsung-s24', name: 'Samsung Galaxy S24 128GB',
    category: 'Mobile Phones', weight: 0.17, image: '📱',
    keywords: ['samsung', 'galaxy', 's24', 'samsung s24'],
    listings: [
      { marketplace: 'amazon-us', price: 799 }, { marketplace: 'amazon-uk', price: 799 },
      { marketplace: 'amazon-de', price: 899 }, { marketplace: 'amazon-ae', price: 3199 },
      { marketplace: 'ebay-us', price: 729 },
      { marketplace: 'amazon-in', price: 74999 }, { marketplace: 'flipkart-in', price: 73999 },
    ],
    indiaPrice: 73999
  },
  {
    id: 'pixel-9-pro', name: 'Google Pixel 9 Pro 128GB',
    category: 'Mobile Phones', weight: 0.2, image: '📱',
    keywords: ['google', 'pixel', 'pixel 9', 'pixel pro'],
    listings: [
      { marketplace: 'amazon-us', price: 999 }, { marketplace: 'bestbuy-us', price: 999 },
      { marketplace: 'amazon-uk', price: 849 }, { marketplace: 'amazon-de', price: 1099 },
      { marketplace: 'amazon-jp', price: 159900 }, { marketplace: 'amazon-au', price: 1699 },
      { marketplace: 'ebay-us', price: 929 },
      { marketplace: 'amazon-in', price: 109999 }, { marketplace: 'flipkart-in', price: 108999 },
    ],
    indiaPrice: 108999
  },
  // ===== LAPTOPS =====
  {
    id: 'macbook-air-m3', name: 'Apple MacBook Air M3 13-inch 256GB',
    category: 'Laptops & Computers', weight: 1.24, image: '💻',
    keywords: ['macbook', 'macbook air', 'apple laptop', 'm3', 'macbook air m3'],
    listings: [
      { marketplace: 'amazon-us', price: 1099 }, { marketplace: 'bestbuy-us', price: 1049 },
      { marketplace: 'amazon-uk', price: 999 }, { marketplace: 'currys-uk', price: 979 },
      { marketplace: 'amazon-de', price: 1299 }, { marketplace: 'mediamarkt-de', price: 1279 },
      { marketplace: 'amazon-ae', price: 4499 }, { marketplace: 'amazon-jp', price: 164800 },
      { marketplace: 'amazon-au', price: 1799 }, { marketplace: 'jb-hifi-au', price: 1699 },
      { marketplace: 'amazon-ca', price: 1499 }, { marketplace: 'ebay-us', price: 989 },
      { marketplace: 'amazon-in', price: 114900 }, { marketplace: 'flipkart-in', price: 113990 }, { marketplace: 'croma-in', price: 114900 },
    ],
    indiaPrice: 113990
  },
  {
    id: 'macbook-pro-m3-pro', name: 'Apple MacBook Pro M3 Pro 14-inch 512GB',
    category: 'Laptops & Computers', weight: 1.61, image: '💻',
    keywords: ['macbook', 'macbook pro', 'm3 pro', 'macbook pro m3'],
    listings: [
      { marketplace: 'amazon-us', price: 1999 }, { marketplace: 'bestbuy-us', price: 1949 },
      { marketplace: 'amazon-uk', price: 1999 }, { marketplace: 'amazon-de', price: 2399 },
      { marketplace: 'amazon-au', price: 3499 }, { marketplace: 'amazon-ca', price: 2799 },
      { marketplace: 'ebay-us', price: 1849 },
      { marketplace: 'amazon-in', price: 199900 }, { marketplace: 'flipkart-in', price: 197990 },
    ],
    indiaPrice: 197990
  },
  {
    id: 'dell-xps-15', name: 'Dell XPS 15 i7 16GB 512GB',
    category: 'Laptops & Computers', weight: 1.86, image: '💻',
    keywords: ['dell', 'xps', 'dell xps', 'xps 15', 'dell laptop'],
    listings: [
      { marketplace: 'amazon-us', price: 1499 }, { marketplace: 'bestbuy-us', price: 1449 },
      { marketplace: 'amazon-uk', price: 1399 }, { marketplace: 'amazon-de', price: 1599 },
      { marketplace: 'amazon-au', price: 2499 }, { marketplace: 'ebay-us', price: 1349 },
      { marketplace: 'amazon-in', price: 159990 }, { marketplace: 'flipkart-in', price: 157990 },
    ],
    indiaPrice: 157990
  },
  // ===== TABLETS =====
  {
    id: 'ipad-pro-m4', name: 'Apple iPad Pro M4 11-inch 256GB',
    category: 'Electronics', weight: 0.44, image: '📱',
    keywords: ['ipad', 'ipad pro', 'apple ipad', 'ipad m4', 'tablet'],
    listings: [
      { marketplace: 'amazon-us', price: 999 }, { marketplace: 'bestbuy-us', price: 999 },
      { marketplace: 'amazon-uk', price: 999 }, { marketplace: 'amazon-de', price: 1199 },
      { marketplace: 'amazon-ae', price: 4099 }, { marketplace: 'amazon-au', price: 1799 },
      { marketplace: 'ebay-us', price: 939 },
      { marketplace: 'amazon-in', price: 99900 }, { marketplace: 'flipkart-in', price: 98999 },
    ],
    indiaPrice: 98999
  },
  // ===== GAMING CONSOLES =====
  {
    id: 'ps5-slim', name: 'Sony PlayStation 5 Slim Digital Edition',
    category: 'Electronics', weight: 3.2, image: '🎮',
    keywords: ['ps5', 'playstation', 'playstation 5', 'sony ps5', 'ps5 slim', 'gaming console'],
    listings: [
      { marketplace: 'amazon-us', price: 449 }, { marketplace: 'bestbuy-us', price: 449 },
      { marketplace: 'walmart-us', price: 449 }, { marketplace: 'target-us', price: 449 },
      { marketplace: 'amazon-uk', price: 389 }, { marketplace: 'currys-uk', price: 389 },
      { marketplace: 'amazon-de', price: 449 }, { marketplace: 'amazon-ae', price: 1749 },
      { marketplace: 'amazon-jp', price: 59980 }, { marketplace: 'ebay-us', price: 415 },
      { marketplace: 'amazon-in', price: 39990 }, { marketplace: 'flipkart-in', price: 39490 }, { marketplace: 'croma-in', price: 39990 },
    ],
    indiaPrice: 39490
  },
  {
    id: 'xbox-series-x', name: 'Microsoft Xbox Series X 1TB',
    category: 'Electronics', weight: 4.45, image: '🎮',
    keywords: ['xbox', 'xbox series x', 'microsoft xbox', 'gaming console'],
    listings: [
      { marketplace: 'amazon-us', price: 499 }, { marketplace: 'bestbuy-us', price: 499 },
      { marketplace: 'walmart-us', price: 499 }, { marketplace: 'amazon-uk', price: 449 },
      { marketplace: 'amazon-de', price: 499 }, { marketplace: 'amazon-ae', price: 1999 },
      { marketplace: 'ebay-us', price: 459 },
      { marketplace: 'amazon-in', price: 52990 }, { marketplace: 'flipkart-in', price: 52490 },
    ],
    indiaPrice: 52490
  },
  {
    id: 'nintendo-switch-2', name: 'Nintendo Switch 2',
    category: 'Electronics', weight: 0.68, image: '🎮',
    keywords: ['nintendo', 'switch', 'switch 2', 'nintendo switch', 'gaming'],
    listings: [
      { marketplace: 'amazon-us', price: 449 }, { marketplace: 'bestbuy-us', price: 449 },
      { marketplace: 'walmart-us', price: 449 }, { marketplace: 'target-us', price: 449 },
      { marketplace: 'amazon-uk', price: 399 }, { marketplace: 'amazon-de', price: 449 },
      { marketplace: 'amazon-jp', price: 49980 }, { marketplace: 'rakuten-jp', price: 48900 },
      { marketplace: 'ebay-us', price: 425 },
      { marketplace: 'amazon-in', price: 45999 }, { marketplace: 'flipkart-in', price: 45499 },
    ],
    indiaPrice: 45499
  },
  // ===== AUDIO EQUIPMENT =====
  {
    id: 'airpods-pro-2', name: 'Apple AirPods Pro 2 USB-C',
    category: 'Audio Equipment', weight: 0.06, image: '🎧',
    keywords: ['airpods', 'airpods pro', 'apple airpods', 'earbuds', 'wireless earbuds'],
    listings: [
      { marketplace: 'amazon-us', price: 249 }, { marketplace: 'bestbuy-us', price: 249 },
      { marketplace: 'walmart-us', price: 249 }, { marketplace: 'target-us', price: 249 },
      { marketplace: 'amazon-uk', price: 229 }, { marketplace: 'currys-uk', price: 229 },
      { marketplace: 'amazon-de', price: 279 }, { marketplace: 'amazon-ae', price: 949 },
      { marketplace: 'amazon-jp', price: 39800 }, { marketplace: 'ebay-us', price: 199 },
      { marketplace: 'amazon-in', price: 24900 }, { marketplace: 'flipkart-in', price: 24499 }, { marketplace: 'croma-in', price: 24900 },
    ],
    indiaPrice: 24499
  },
  {
    id: 'airpods-max', name: 'Apple AirPods Max USB-C',
    category: 'Audio Equipment', weight: 0.38, image: '🎧',
    keywords: ['airpods max', 'apple headphones', 'over ear headphones'],
    listings: [
      { marketplace: 'amazon-us', price: 549 }, { marketplace: 'bestbuy-us', price: 549 },
      { marketplace: 'amazon-uk', price: 499 }, { marketplace: 'amazon-de', price: 579 },
      { marketplace: 'amazon-ae', price: 2249 }, { marketplace: 'ebay-us', price: 479 },
      { marketplace: 'amazon-in', price: 59900 }, { marketplace: 'flipkart-in', price: 59499 },
    ],
    indiaPrice: 59499
  },
  {
    id: 'sony-wh1000xm5', name: 'Sony WH-1000XM5 Headphones',
    category: 'Audio Equipment', weight: 0.25, image: '🎧',
    keywords: ['sony', 'wh1000xm5', 'xm5', 'sony headphones', 'noise cancelling'],
    listings: [
      { marketplace: 'amazon-us', price: 348 }, { marketplace: 'bestbuy-us', price: 348 },
      { marketplace: 'amazon-uk', price: 299 }, { marketplace: 'currys-uk', price: 289 },
      { marketplace: 'amazon-de', price: 349 }, { marketplace: 'amazon-ae', price: 1499 },
      { marketplace: 'amazon-jp', price: 49500 }, { marketplace: 'yodobashi-jp', price: 44000 },
      { marketplace: 'ebay-us', price: 278 }, { marketplace: 'ebay-uk', price: 269 },
      { marketplace: 'amazon-in', price: 29990 }, { marketplace: 'flipkart-in', price: 28999 }, { marketplace: 'croma-in', price: 29990 },
    ],
    indiaPrice: 28999
  },
  {
    id: 'bose-qc-ultra', name: 'Bose QuietComfort Ultra Headphones',
    category: 'Audio Equipment', weight: 0.25, image: '🎧',
    keywords: ['bose', 'quietcomfort', 'bose qc', 'bose headphones'],
    listings: [
      { marketplace: 'amazon-us', price: 429 }, { marketplace: 'bestbuy-us', price: 429 },
      { marketplace: 'amazon-uk', price: 399 }, { marketplace: 'amazon-de', price: 449 },
      { marketplace: 'amazon-ae', price: 1699 }, { marketplace: 'ebay-us', price: 379 },
      { marketplace: 'amazon-in', price: 35900 }, { marketplace: 'flipkart-in', price: 34999 },
    ],
    indiaPrice: 34999
  },
  // ===== WATCHES =====
  {
    id: 'apple-watch-ultra-2', name: 'Apple Watch Ultra 2 49mm',
    category: 'Watches', weight: 0.06, image: '⌚',
    keywords: ['apple watch', 'watch ultra', 'apple watch ultra', 'smartwatch'],
    listings: [
      { marketplace: 'amazon-us', price: 799 }, { marketplace: 'bestbuy-us', price: 799 },
      { marketplace: 'amazon-uk', price: 799 }, { marketplace: 'amazon-de', price: 899 },
      { marketplace: 'amazon-ae', price: 3299 }, { marketplace: 'amazon-jp', price: 128800 },
      { marketplace: 'ebay-us', price: 699 },
      { marketplace: 'amazon-in', price: 89900 }, { marketplace: 'flipkart-in', price: 89499 }, { marketplace: 'croma-in', price: 89900 },
    ],
    indiaPrice: 89499
  },
  {
    id: 'apple-watch-series-10', name: 'Apple Watch Series 10 46mm GPS',
    category: 'Watches', weight: 0.04, image: '⌚',
    keywords: ['apple watch', 'watch series 10', 'apple watch 10', 'smartwatch'],
    listings: [
      { marketplace: 'amazon-us', price: 429 }, { marketplace: 'bestbuy-us', price: 429 },
      { marketplace: 'amazon-uk', price: 429 }, { marketplace: 'amazon-ae', price: 1599 },
      { marketplace: 'ebay-us', price: 379 },
      { marketplace: 'amazon-in', price: 46900 }, { marketplace: 'flipkart-in', price: 46499 },
    ],
    indiaPrice: 46499
  },
  // ===== CAMERAS =====
  {
    id: 'sony-a7-iv', name: 'Sony Alpha A7 IV Mirrorless Camera Body',
    category: 'Photography Equipment', weight: 0.66, image: '📷',
    keywords: ['sony', 'alpha', 'a7iv', 'a7 iv', 'mirrorless', 'sony camera', 'camera'],
    listings: [
      { marketplace: 'amazon-us', price: 2498 }, { marketplace: 'bestbuy-us', price: 2498 },
      { marketplace: 'amazon-uk', price: 2399 }, { marketplace: 'amazon-de', price: 2799 },
      { marketplace: 'amazon-jp', price: 328900 }, { marketplace: 'yodobashi-jp', price: 319000 },
      { marketplace: 'ebay-us', price: 2199 },
      { marketplace: 'amazon-in', price: 244990 }, { marketplace: 'flipkart-in', price: 241990 },
    ],
    indiaPrice: 241990
  },
  {
    id: 'gopro-hero-13', name: 'GoPro HERO 13 Black',
    category: 'Photography Equipment', weight: 0.15, image: '📷',
    keywords: ['gopro', 'hero 13', 'action camera', 'gopro hero'],
    listings: [
      { marketplace: 'amazon-us', price: 399 }, { marketplace: 'bestbuy-us', price: 399 },
      { marketplace: 'amazon-uk', price: 349 }, { marketplace: 'amazon-de', price: 399 },
      { marketplace: 'amazon-ae', price: 1649 }, { marketplace: 'ebay-us', price: 359 },
      { marketplace: 'amazon-in', price: 41500 }, { marketplace: 'flipkart-in', price: 40999 },
    ],
    indiaPrice: 40999
  },
  // ===== HOME APPLIANCES =====
  {
    id: 'dyson-v15', name: 'Dyson V15 Detect Absolute Vacuum',
    category: 'Home Appliances', weight: 2.74, image: '🏠',
    keywords: ['dyson', 'v15', 'vacuum', 'dyson vacuum', 'dyson v15', 'vacuum cleaner'],
    listings: [
      { marketplace: 'amazon-us', price: 749 }, { marketplace: 'bestbuy-us', price: 749 },
      { marketplace: 'amazon-uk', price: 599 }, { marketplace: 'currys-uk', price: 579 },
      { marketplace: 'amazon-de', price: 699 }, { marketplace: 'amazon-ae', price: 2799 },
      { marketplace: 'ebay-us', price: 659 },
      { marketplace: 'amazon-in', price: 62900 }, { marketplace: 'flipkart-in', price: 61990 }, { marketplace: 'croma-in', price: 62900 },
    ],
    indiaPrice: 61990
  },
  {
    id: 'dyson-airwrap', name: 'Dyson Airwrap Multi-Styler Complete Long',
    category: 'Home Appliances', weight: 0.7, image: '💇',
    keywords: ['dyson', 'airwrap', 'hair styler', 'dyson airwrap', 'hair tool'],
    listings: [
      { marketplace: 'amazon-us', price: 599 }, { marketplace: 'bestbuy-us', price: 599 },
      { marketplace: 'amazon-uk', price: 479 }, { marketplace: 'currys-uk', price: 479 },
      { marketplace: 'amazon-de', price: 549 }, { marketplace: 'amazon-ae', price: 2399 },
      { marketplace: 'ebay-us', price: 519 },
      { marketplace: 'amazon-in', price: 45900 }, { marketplace: 'flipkart-in', price: 44990 },
    ],
    indiaPrice: 44990
  },
  // ===== COSMETICS & BEAUTY =====
  {
    id: 'dyson-supersonic', name: 'Dyson Supersonic Hair Dryer',
    category: 'Cosmetics & Beauty', weight: 0.66, image: '💇',
    keywords: ['dyson', 'supersonic', 'hair dryer', 'dyson dryer', 'beauty'],
    listings: [
      { marketplace: 'amazon-us', price: 429 }, { marketplace: 'bestbuy-us', price: 429 },
      { marketplace: 'amazon-uk', price: 329 }, { marketplace: 'currys-uk', price: 329 },
      { marketplace: 'amazon-de', price: 399 }, { marketplace: 'amazon-ae', price: 1799 },
      { marketplace: 'ebay-us', price: 369 },
      { marketplace: 'amazon-in', price: 34900 }, { marketplace: 'flipkart-in', price: 33990 },
    ],
    indiaPrice: 33990
  },
  {
    id: 'la-mer-moisturizer', name: 'La Mer Crème de la Mer Moisturizer 60ml',
    category: 'Cosmetics & Beauty', weight: 0.15, image: '✨',
    keywords: ['la mer', 'moisturizer', 'cream', 'skincare', 'luxury skincare', 'cosmetics'],
    listings: [
      { marketplace: 'amazon-us', price: 365 }, { marketplace: 'amazon-uk', price: 310 },
      { marketplace: 'amazon-de', price: 350 }, { marketplace: 'amazon-ae', price: 1450 },
      { marketplace: 'ebay-us', price: 335 }, { marketplace: 'ebay-uk', price: 289 },
      { marketplace: 'amazon-in', price: 34500 }, { marketplace: 'flipkart-in', price: 33999 },
    ],
    indiaPrice: 33999
  },
  {
    id: 'sk-ii-essence', name: 'SK-II Facial Treatment Essence 230ml',
    category: 'Cosmetics & Beauty', weight: 0.35, image: '✨',
    keywords: ['sk-ii', 'sk2', 'pitera', 'facial essence', 'skincare', 'cosmetics'],
    listings: [
      { marketplace: 'amazon-us', price: 235 }, { marketplace: 'amazon-uk', price: 200 },
      { marketplace: 'amazon-de', price: 225 }, { marketplace: 'amazon-jp', price: 23100 },
      { marketplace: 'rakuten-jp', price: 19800 }, { marketplace: 'amazon-ae', price: 900 },
      { marketplace: 'ebay-us', price: 199 },
      { marketplace: 'amazon-in', price: 22950 }, { marketplace: 'flipkart-in', price: 21999 },
    ],
    indiaPrice: 21999
  },
  // ===== FOOTWEAR =====
  {
    id: 'nike-air-jordan-1', name: 'Nike Air Jordan 1 Retro High OG',
    category: 'Footwear', weight: 0.5, image: '👟',
    keywords: ['nike', 'jordan', 'air jordan', 'jordan 1', 'sneakers', 'shoes'],
    listings: [
      { marketplace: 'amazon-us', price: 180 }, { marketplace: 'ebay-us', price: 165 },
      { marketplace: 'amazon-uk', price: 164 }, { marketplace: 'ebay-uk', price: 155 },
      { marketplace: 'amazon-de', price: 179 }, { marketplace: 'amazon-ae', price: 699 },
      { marketplace: 'amazon-in', price: 16995 }, { marketplace: 'flipkart-in', price: 16495 },
    ],
    indiaPrice: 16495
  },
  {
    id: 'adidas-ultraboost', name: 'Adidas Ultraboost Light Running Shoes',
    category: 'Footwear', weight: 0.3, image: '👟',
    keywords: ['adidas', 'ultraboost', 'running shoes', 'adidas shoes', 'sneakers'],
    listings: [
      { marketplace: 'amazon-us', price: 190 }, { marketplace: 'ebay-us', price: 159 },
      { marketplace: 'amazon-uk', price: 170 }, { marketplace: 'amazon-de', price: 180 },
      { marketplace: 'amazon-ae', price: 749 },
      { marketplace: 'amazon-in', price: 16999 }, { marketplace: 'flipkart-in', price: 16499 },
    ],
    indiaPrice: 16499
  },
  // ===== FASHION =====
  {
    id: 'levis-501', name: "Levi's 501 Original Fit Jeans",
    category: 'Fashion & Clothing', weight: 0.8, image: '👖',
    keywords: ['levis', '501', 'jeans', 'denim', "levi's", 'fashion'],
    listings: [
      { marketplace: 'amazon-us', price: 69 }, { marketplace: 'walmart-us', price: 59 },
      { marketplace: 'target-us', price: 69 }, { marketplace: 'amazon-uk', price: 85 },
      { marketplace: 'amazon-de', price: 99 }, { marketplace: 'amazon-ae', price: 299 },
      { marketplace: 'ebay-us', price: 49 },
      { marketplace: 'amazon-in', price: 5999 }, { marketplace: 'flipkart-in', price: 5499 },
    ],
    indiaPrice: 5499
  },
  {
    id: 'north-face-jacket', name: 'The North Face 1996 Retro Nuptse Jacket',
    category: 'Fashion & Clothing', weight: 0.75, image: '🧥',
    keywords: ['north face', 'nuptse', 'puffer jacket', 'winter jacket', 'fashion'],
    listings: [
      { marketplace: 'amazon-us', price: 330 }, { marketplace: 'amazon-uk', price: 280 },
      { marketplace: 'amazon-de', price: 320 }, { marketplace: 'ebay-us', price: 289 },
      { marketplace: 'ebay-uk', price: 259 },
      { marketplace: 'amazon-in', price: 34999 }, { marketplace: 'flipkart-in', price: 33999 },
    ],
    indiaPrice: 33999
  },
  // ===== JEWELRY/GOLD =====
  {
    id: 'gold-chain-22k', name: '22K Gold Chain Necklace 10g',
    category: 'Jewelry & Accessories', weight: 0.01, image: '💎',
    keywords: ['gold', 'gold chain', 'necklace', '22k', 'jewelry', 'jewellery', 'gold necklace'],
    listings: [
      { marketplace: 'amazon-us', price: 680 }, { marketplace: 'ebay-us', price: 650 },
      { marketplace: 'amazon-uk', price: 580 }, { marketplace: 'amazon-ae', price: 2450 },
      { marketplace: 'noon-ae', price: 2399 },
      { marketplace: 'amazon-in', price: 62000 }, { marketplace: 'flipkart-in', price: 61500 },
    ],
    indiaPrice: 61500
  },
  {
    id: 'diamond-stud-earrings', name: 'Diamond Stud Earrings 0.5ct 14K Gold',
    category: 'Jewelry & Accessories', weight: 0.01, image: '💎',
    keywords: ['diamond', 'earrings', 'stud', 'gold earrings', 'jewelry', 'jewellery'],
    listings: [
      { marketplace: 'amazon-us', price: 499 }, { marketplace: 'ebay-us', price: 449 },
      { marketplace: 'amazon-uk', price: 450 }, { marketplace: 'amazon-ae', price: 1899 },
      { marketplace: 'amazon-in', price: 45000 }, { marketplace: 'flipkart-in', price: 43999 },
    ],
    indiaPrice: 43999
  },
  // ===== KITCHEN APPLIANCES =====
  {
    id: 'nespresso-vertuo', name: 'Nespresso Vertuo Next Coffee Machine',
    category: 'Kitchen Appliances', weight: 4.0, image: '☕',
    keywords: ['nespresso', 'coffee', 'coffee machine', 'vertuo', 'kitchen'],
    listings: [
      { marketplace: 'amazon-us', price: 179 }, { marketplace: 'bestbuy-us', price: 179 },
      { marketplace: 'target-us', price: 179 }, { marketplace: 'amazon-uk', price: 149 },
      { marketplace: 'currys-uk', price: 149 }, { marketplace: 'amazon-de', price: 159 },
      { marketplace: 'amazon-ae', price: 699 }, { marketplace: 'ebay-us', price: 145 },
      { marketplace: 'amazon-in', price: 16990 }, { marketplace: 'flipkart-in', price: 16490 },
    ],
    indiaPrice: 16490
  },
  {
    id: 'kitchenaid-mixer', name: 'KitchenAid Artisan Stand Mixer 5-Qt',
    category: 'Kitchen Appliances', weight: 10.0, image: '🍳',
    keywords: ['kitchenaid', 'stand mixer', 'artisan mixer', 'kitchen mixer', 'kitchen'],
    listings: [
      { marketplace: 'amazon-us', price: 449 }, { marketplace: 'bestbuy-us', price: 449 },
      { marketplace: 'target-us', price: 449 }, { marketplace: 'amazon-uk', price: 399 },
      { marketplace: 'amazon-de', price: 499 }, { marketplace: 'ebay-us', price: 379 },
      { marketplace: 'amazon-in', price: 49999 }, { marketplace: 'flipkart-in', price: 48999 },
    ],
    indiaPrice: 48999
  },
  // ===== SPORTS & FITNESS =====
  {
    id: 'garmin-fenix-8', name: 'Garmin Fenix 8 Solar 47mm',
    category: 'Sports & Fitness', weight: 0.08, image: '⌚',
    keywords: ['garmin', 'fenix', 'garmin fenix', 'gps watch', 'sports watch', 'fitness'],
    listings: [
      { marketplace: 'amazon-us', price: 999 }, { marketplace: 'bestbuy-us', price: 999 },
      { marketplace: 'amazon-uk', price: 899 }, { marketplace: 'amazon-de', price: 999 },
      { marketplace: 'ebay-us', price: 889 },
      { marketplace: 'amazon-in', price: 97990 }, { marketplace: 'flipkart-in', price: 96990 },
    ],
    indiaPrice: 96990
  },
  // ===== TOOLS =====
  {
    id: 'dewalt-drill', name: 'DeWalt 20V MAX Brushless Drill/Driver Kit',
    category: 'Tools & Hardware', weight: 1.8, image: '🔧',
    keywords: ['dewalt', 'drill', 'power drill', 'cordless drill', 'tools', 'power tools'],
    listings: [
      { marketplace: 'amazon-us', price: 179 }, { marketplace: 'walmart-us', price: 169 },
      { marketplace: 'amazon-uk', price: 149 }, { marketplace: 'amazon-de', price: 169 },
      { marketplace: 'ebay-us', price: 149 },
      { marketplace: 'amazon-in', price: 18999 }, { marketplace: 'flipkart-in', price: 18499 },
    ],
    indiaPrice: 18499
  },
  // ===== DRONES =====
  {
    id: 'dji-mini-4-pro', name: 'DJI Mini 4 Pro Fly More Combo',
    category: 'Drones & Robotics', weight: 0.25, image: '🚁',
    keywords: ['dji', 'mini 4', 'drone', 'dji mini', 'dji drone', 'quadcopter'],
    listings: [
      { marketplace: 'amazon-us', price: 959 }, { marketplace: 'bestbuy-us', price: 959 },
      { marketplace: 'amazon-uk', price: 869 }, { marketplace: 'amazon-de', price: 959 },
      { marketplace: 'amazon-ae', price: 3599 }, { marketplace: 'amazon-jp', price: 132000 },
      { marketplace: 'ebay-us', price: 879 },
      { marketplace: 'amazon-in', price: 92500 }, { marketplace: 'flipkart-in', price: 91990 },
    ],
    indiaPrice: 91990
  },
  // ===== BAGS & LUGGAGE =====
  {
    id: 'samsonite-spinner', name: 'Samsonite Cosmolite 75cm Spinner Suitcase',
    category: 'Bags & Luggage', weight: 2.6, image: '🧳',
    keywords: ['samsonite', 'suitcase', 'luggage', 'spinner', 'cosmolite', 'travel bag'],
    listings: [
      { marketplace: 'amazon-us', price: 499 }, { marketplace: 'amazon-uk', price: 399 },
      { marketplace: 'amazon-de', price: 459 }, { marketplace: 'amazon-ae', price: 1899 },
      { marketplace: 'ebay-us', price: 429 }, { marketplace: 'ebay-uk', price: 369 },
      { marketplace: 'amazon-in', price: 39999 }, { marketplace: 'flipkart-in', price: 38999 },
    ],
    indiaPrice: 38999
  },
  // ===== EYEWEAR =====
  {
    id: 'ray-ban-aviator', name: 'Ray-Ban Aviator Classic RB3025',
    category: 'Eyewear', weight: 0.03, image: '🕶️',
    keywords: ['ray ban', 'rayban', 'aviator', 'sunglasses', 'eyewear'],
    listings: [
      { marketplace: 'amazon-us', price: 169 }, { marketplace: 'ebay-us', price: 129 },
      { marketplace: 'amazon-uk', price: 143 }, { marketplace: 'ebay-uk', price: 119 },
      { marketplace: 'amazon-de', price: 159 }, { marketplace: 'amazon-ae', price: 620 },
      { marketplace: 'amazon-in', price: 12990 }, { marketplace: 'flipkart-in', price: 12490 },
    ],
    indiaPrice: 12490
  },
  // ===== HEALTH / MEDICINE =====
  {
    id: 'omron-bp-monitor', name: 'Omron Platinum Blood Pressure Monitor',
    category: 'Health & Personal Care', weight: 0.5, image: '🏥',
    keywords: ['omron', 'blood pressure', 'bp monitor', 'health', 'medical', 'medicine'],
    listings: [
      { marketplace: 'amazon-us', price: 74 }, { marketplace: 'walmart-us', price: 74 },
      { marketplace: 'amazon-uk', price: 62 }, { marketplace: 'amazon-de', price: 69 },
      { marketplace: 'ebay-us', price: 59 },
      { marketplace: 'amazon-in', price: 6499 }, { marketplace: 'flipkart-in', price: 6299 },
    ],
    indiaPrice: 6299
  },
  {
    id: 'philips-sonicare', name: 'Philips Sonicare DiamondClean 9000',
    category: 'Health & Personal Care', weight: 0.4, image: '🪥',
    keywords: ['philips', 'sonicare', 'electric toothbrush', 'toothbrush', 'health', 'oral care'],
    listings: [
      { marketplace: 'amazon-us', price: 219 }, { marketplace: 'bestbuy-us', price: 219 },
      { marketplace: 'amazon-uk', price: 189 }, { marketplace: 'amazon-de', price: 209 },
      { marketplace: 'amazon-ae', price: 849 }, { marketplace: 'ebay-us', price: 179 },
      { marketplace: 'amazon-in', price: 21999 }, { marketplace: 'flipkart-in', price: 20999 },
    ],
    indiaPrice: 20999
  },
  // ===== TOYS =====
  {
    id: 'lego-millennium-falcon', name: 'LEGO Star Wars Millennium Falcon 75375',
    category: 'Toys & Games', weight: 5.3, image: '🧱',
    keywords: ['lego', 'star wars', 'millennium falcon', 'lego set', 'toys'],
    listings: [
      { marketplace: 'amazon-us', price: 849 }, { marketplace: 'walmart-us', price: 849 },
      { marketplace: 'target-us', price: 849 }, { marketplace: 'amazon-uk', price: 734 },
      { marketplace: 'amazon-de', price: 849 }, { marketplace: 'ebay-us', price: 779 },
      { marketplace: 'amazon-in', price: 84999 }, { marketplace: 'flipkart-in', price: 83999 },
    ],
    indiaPrice: 83999
  },
  // ===== MUSICAL INSTRUMENTS =====
  {
    id: 'yamaha-p125', name: 'Yamaha P-125a Digital Piano 88-Key',
    category: 'Musical Instruments', weight: 11.8, image: '🎹',
    keywords: ['yamaha', 'piano', 'digital piano', 'keyboard', 'p125', 'music', 'instrument'],
    listings: [
      { marketplace: 'amazon-us', price: 699 }, { marketplace: 'bestbuy-us', price: 699 },
      { marketplace: 'amazon-uk', price: 599 }, { marketplace: 'amazon-de', price: 649 },
      { marketplace: 'amazon-jp', price: 73700 }, { marketplace: 'rakuten-jp', price: 69800 },
      { marketplace: 'ebay-us', price: 619 },
      { marketplace: 'amazon-in', price: 59900 }, { marketplace: 'flipkart-in', price: 58999 },
    ],
    indiaPrice: 58999
  },
  // ===== GENERAL / FURNITURE =====
  {
    id: 'herman-miller-aeron', name: 'Herman Miller Aeron Chair Size B',
    category: 'Furniture', weight: 14.0, image: '🪑',
    keywords: ['herman miller', 'aeron', 'office chair', 'ergonomic chair', 'furniture'],
    listings: [
      { marketplace: 'amazon-us', price: 1395 }, { marketplace: 'amazon-uk', price: 1299 },
      { marketplace: 'amazon-de', price: 1449 }, { marketplace: 'ebay-us', price: 1149 },
      { marketplace: 'amazon-in', price: 145000 }, { marketplace: 'flipkart-in', price: 142999 },
    ],
    indiaPrice: 142999
  },
];

// Shipping, insurance, courier estimation
const shippingRates = {
  light: { base: 15, perKg: 5 }, medium: { base: 25, perKg: 8 },
  heavy: { base: 40, perKg: 12 }, veryHeavy: { base: 80, perKg: 15 }
};

function getShippingEstimate(weight) {
  let tier;
  if (weight < 0.5) tier = shippingRates.light;
  else if (weight <= 3) tier = shippingRates.medium;
  else if (weight <= 10) tier = shippingRates.heavy;
  else tier = shippingRates.veryHeavy;
  return Math.round(tier.base + (weight * tier.perKg));
}

function getInsuranceEstimate(price) {
  return Math.round(price * 0.015 * 100) / 100;
}

function getCourierFee(weight) {
  if (weight < 1) return 8;
  if (weight < 5) return 15;
  return 25;
}

function searchProducts(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  return products
    .map(p => {
      let score = 0;
      const nameLower = p.name.toLowerCase();
      const keywordsStr = p.keywords.join(' ');
      if (nameLower.includes(q)) score += 100;
      words.forEach(word => {
        if (nameLower.includes(word)) score += 20;
        if (keywordsStr.includes(word)) score += 15;
        p.keywords.forEach(kw => { if (kw.startsWith(word)) score += 10; });
      });
      return { ...p, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

// Estimated delivery times to India (in business days)
const deliveryTimes = {
  'United States':        { min: 7,  max: 14, express: 4 },
  'United Kingdom':       { min: 6,  max: 12, express: 3 },
  'Germany':              { min: 7,  max: 14, express: 4 },
  'United Arab Emirates': { min: 4,  max: 8,  express: 2 },
  'Japan':                { min: 5,  max: 10, express: 3 },
  'Australia':            { min: 8,  max: 16, express: 5 },
  'Canada':               { min: 8,  max: 15, express: 5 },
  'Singapore':            { min: 3,  max: 7,  express: 2 },
  'India':                { min: 1,  max: 5,  express: 1 },
};

function getDeliveryEstimate(country) {
  const d = deliveryTimes[country];
  if (!d) return { min: 10, max: 21, express: 7, label: '10–21 days', expressLabel: '~7 days' };
  return { ...d, label: `${d.min}–${d.max} days`, expressLabel: `~${d.express} days` };
}

module.exports = { products, marketplaces, searchProducts, getShippingEstimate, getInsuranceEstimate, getCourierFee, getDeliveryEstimate, deliveryTimes };
