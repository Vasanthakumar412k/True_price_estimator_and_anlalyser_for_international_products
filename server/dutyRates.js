// Indian Import Duty Rates Database by Product Category
// BCD = Basic Customs Duty (%), IGST = Integrated GST (%)

const dutyRates = {
  "Electronics": {
    bcd: 20,
    igst: 18,
    description: "Smartphones, laptops, tablets, cameras, gaming consoles, etc."
  },
  "Mobile Phones": {
    bcd: 20,
    igst: 12,
    description: "Smartphones and feature phones"
  },
  "Laptops & Computers": {
    bcd: 15,
    igst: 18,
    description: "Laptops, desktops, monitors, peripherals"
  },
  "Fashion & Clothing": {
    bcd: 25,
    igst: 12,
    description: "Apparel, garments, textiles"
  },
  "Footwear": {
    bcd: 35,
    igst: 18,
    description: "Shoes, sandals, boots, sports footwear"
  },
  "Watches": {
    bcd: 20,
    igst: 18,
    description: "Wristwatches, smartwatches"
  },
  "Jewelry & Accessories": {
    bcd: 15,
    igst: 3,
    description: "Gold, silver, costume jewelry, fashion accessories"
  },
  "Cosmetics & Beauty": {
    bcd: 20,
    igst: 28,
    description: "Skincare, makeup, perfumes, fragrances"
  },
  "Health & Personal Care": {
    bcd: 10,
    igst: 18,
    description: "Health devices, personal care appliances"
  },
  "Home Appliances": {
    bcd: 20,
    igst: 28,
    description: "Kitchen appliances, vacuum cleaners, air purifiers"
  },
  "Kitchen Appliances": {
    bcd: 20,
    igst: 18,
    description: "Mixers, blenders, coffee machines, toasters"
  },
  "Tools & Hardware": {
    bcd: 10,
    igst: 18,
    description: "Power tools, hand tools, hardware equipment"
  },
  "Sports & Fitness": {
    bcd: 10,
    igst: 18,
    description: "Sports equipment, fitness gear, bicycles"
  },
  "Books & Stationery": {
    bcd: 0,
    igst: 0,
    description: "Printed books, educational material (exempt)"
  },
  "Toys & Games": {
    bcd: 60,
    igst: 18,
    description: "Toys, board games, puzzles"
  },
  "Musical Instruments": {
    bcd: 20,
    igst: 18,
    description: "Guitars, keyboards, drums, accessories"
  },
  "Automobile Parts": {
    bcd: 15,
    igst: 28,
    description: "Car parts, bike parts, accessories"
  },
  "Furniture": {
    bcd: 25,
    igst: 18,
    description: "Home and office furniture"
  },
  "Baby Products": {
    bcd: 10,
    igst: 18,
    description: "Baby gear, strollers, toys, clothing"
  },
  "Pet Supplies": {
    bcd: 30,
    igst: 18,
    description: "Pet food, accessories, grooming"
  },
  "Bags & Luggage": {
    bcd: 20,
    igst: 18,
    description: "Backpacks, suitcases, handbags"
  },
  "Eyewear": {
    bcd: 20,
    igst: 18,
    description: "Sunglasses, prescription glasses, lenses"
  },
  "Photography Equipment": {
    bcd: 15,
    igst: 18,
    description: "Cameras, lenses, tripods, lighting"
  },
  "Audio Equipment": {
    bcd: 15,
    igst: 18,
    description: "Headphones, speakers, microphones, earbuds"
  },
  "Drones & Robotics": {
    bcd: 18,
    igst: 18,
    description: "Consumer drones, robotic kits"
  },
  "Other": {
    bcd: 10,
    igst: 18,
    description: "All other product categories"
  }
};

// Supported countries with default currencies
const countries = [
  { name: "United States", code: "US", currency: "USD", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", currency: "GBP", flag: "🇬🇧" },
  { name: "United Arab Emirates", code: "AE", currency: "AED", flag: "🇦🇪" },
  { name: "Japan", code: "JP", currency: "JPY", flag: "🇯🇵" },
  { name: "Germany", code: "DE", currency: "EUR", flag: "🇩🇪" },
  { name: "France", code: "FR", currency: "EUR", flag: "🇫🇷" },
  { name: "Italy", code: "IT", currency: "EUR", flag: "🇮🇹" },
  { name: "China", code: "CN", currency: "CNY", flag: "🇨🇳" },
  { name: "South Korea", code: "KR", currency: "KRW", flag: "🇰🇷" },
  { name: "Australia", code: "AU", currency: "AUD", flag: "🇦🇺" },
  { name: "Canada", code: "CA", currency: "CAD", flag: "🇨🇦" },
  { name: "Singapore", code: "SG", currency: "SGD", flag: "🇸🇬" },
  { name: "Hong Kong", code: "HK", currency: "HKD", flag: "🇭🇰" },
  { name: "Thailand", code: "TH", currency: "THB", flag: "🇹🇭" },
  { name: "Malaysia", code: "MY", currency: "MYR", flag: "🇲🇾" },
  { name: "Turkey", code: "TR", currency: "TRY", flag: "🇹🇷" },
  { name: "Saudi Arabia", code: "SA", currency: "SAR", flag: "🇸🇦" },
  { name: "Switzerland", code: "CH", currency: "CHF", flag: "🇨🇭" },
  { name: "Sweden", code: "SE", currency: "SEK", flag: "🇸🇪" },
  { name: "Netherlands", code: "NL", currency: "EUR", flag: "🇳🇱" },
  { name: "Spain", code: "ES", currency: "EUR", flag: "🇪🇸" },
  { name: "New Zealand", code: "NZ", currency: "NZD", flag: "🇳🇿" },
  { name: "Brazil", code: "BR", currency: "BRL", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", currency: "MXN", flag: "🇲🇽" },
  { name: "Russia", code: "RU", currency: "RUB", flag: "🇷🇺" },
  { name: "Taiwan", code: "TW", currency: "TWD", flag: "🇹🇼" },
  { name: "Indonesia", code: "ID", currency: "IDR", flag: "🇮🇩" },
  { name: "Vietnam", code: "VN", currency: "VND", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", currency: "PHP", flag: "🇵🇭" },
  { name: "Bangladesh", code: "BD", currency: "BDT", flag: "🇧🇩" }
];

// Supported currencies
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" }
];

module.exports = { dutyRates, countries, currencies };
