import { useState, useEffect } from 'react';

const categories = [
  'Electronics', 'Mobile Phones', 'Laptops & Computers', 'Fashion & Clothing',
  'Footwear', 'Watches', 'Jewelry & Accessories', 'Cosmetics & Beauty',
  'Health & Personal Care', 'Home Appliances', 'Kitchen Appliances',
  'Tools & Hardware', 'Sports & Fitness', 'Books & Stationery', 'Toys & Games',
  'Musical Instruments', 'Automobile Parts', 'Furniture', 'Baby Products',
  'Pet Supplies', 'Bags & Luggage', 'Eyewear', 'Photography Equipment',
  'Audio Equipment', 'Drones & Robotics', 'Other'
];

const countries = [
  { name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  { name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { name: 'Italy', currency: 'EUR', flag: '🇮🇹' },
  { name: 'China', currency: 'CNY', flag: '🇨🇳' },
  { name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
  { name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  { name: 'Hong Kong', currency: 'HKD', flag: '🇭🇰' },
  { name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
  { name: 'Malaysia', currency: 'MYR', flag: '🇲🇾' },
  { name: 'Turkey', currency: 'TRY', flag: '🇹🇷' },
  { name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
  { name: 'Switzerland', currency: 'CHF', flag: '🇨🇭' },
  { name: 'Sweden', currency: 'SEK', flag: '🇸🇪' },
  { name: 'Netherlands', currency: 'EUR', flag: '🇳🇱' },
  { name: 'Spain', currency: 'EUR', flag: '🇪🇸' },
  { name: 'New Zealand', currency: 'NZD', flag: '🇳🇿' },
  { name: 'Brazil', currency: 'BRL', flag: '🇧🇷' },
  { name: 'Mexico', currency: 'MXN', flag: '🇲🇽' },
  { name: 'Taiwan', currency: 'TWD', flag: '🇹🇼' },
  { name: 'Indonesia', currency: 'IDR', flag: '🇮🇩' },
  { name: 'Vietnam', currency: 'VND', flag: '🇻🇳' },
  { name: 'Philippines', currency: 'PHP', flag: '🇵🇭' },
  { name: 'Bangladesh', currency: 'BDT', flag: '🇧🇩' }
];

const currencyList = [
  'USD', 'EUR', 'GBP', 'AED', 'JPY', 'CNY', 'KRW', 'AUD', 'CAD',
  'SGD', 'HKD', 'THB', 'MYR', 'TRY', 'SAR', 'CHF', 'SEK', 'NZD',
  'BRL', 'MXN', 'TWD', 'IDR', 'VND', 'PHP', 'BDT'
];

export default function ProductForm({ onCalculate, loading }) {
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Electronics',
    country: 'United States',
    productPrice: '',
    currency: 'USD',
    shippingCost: '',
    insuranceCost: '',
    courierFees: '',
    importMethod: 'online',
    indiaPrice: ''
  });

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(c => c.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      country: e.target.value,
      currency: selectedCountry ? selectedCountry.currency : prev.currency
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMethodToggle = (method) => {
    setFormData(prev => ({ ...prev, importMethod: method }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productPrice || parseFloat(formData.productPrice) <= 0) return;
    onCalculate(formData);
  };

  return (
    <div className="glass-card">
      <h2><span className="icon">📦</span> Product Details</h2>

      <form onSubmit={handleSubmit} id="product-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g., iPhone 16 Pro Max"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Product Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="country">Country of Purchase</label>
            <select id="country" name="country" value={formData.country} onChange={handleCountryChange}>
              {countries.map(c => (
                <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productPrice">Product Price</label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              placeholder="e.g., 999"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select id="currency" name="currency" value={formData.currency} onChange={handleChange}>
              {currencyList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Import Method</label>
          <div className="import-method-toggle">
            <button
              type="button"
              className={`toggle-option ${formData.importMethod === 'online' ? 'active' : ''}`}
              onClick={() => handleMethodToggle('online')}
              id="toggle-online"
            >
              📦 Online Shipping
            </button>
            <button
              type="button"
              className={`toggle-option ${formData.importMethod === 'traveller' ? 'active' : ''}`}
              onClick={() => handleMethodToggle('traveller')}
              id="toggle-traveller"
            >
              ✈️ Traveller
            </button>
          </div>
        </div>

        {formData.importMethod === 'traveller' && (
          <div className="traveller-info">
            <strong>✈️ Traveller Mode:</strong> Products carried personally into India get a <strong>₹50,000 duty-free allowance</strong>. Customs duty applies only on the value exceeding this limit. Shipping/courier fees do not apply.
          </div>
        )}

        {formData.importMethod === 'online' && (
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="shippingCost">Shipping Cost</label>
              <input
                type="number"
                id="shippingCost"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="insuranceCost">Insurance (Optional)</label>
              <input
                type="number"
                id="insuranceCost"
                name="insuranceCost"
                value={formData.insuranceCost}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="courierFees">Courier/Handling Fee</label>
              <input
                type="number"
                id="courierFees"
                name="courierFees"
                value={formData.courierFees}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="indiaPrice">Indian Market Price (₹ INR — optional)</label>
          <input
            type="number"
            id="indiaPrice"
            name="indiaPrice"
            value={formData.indiaPrice}
            onChange={handleChange}
            placeholder="Enter Indian price for comparison"
            min="0"
            step="1"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} id="btn-calculate">
          {loading ? (
            <span className="loading-spinner">Calculating...</span>
          ) : (
            '🔍 Analyze Import Cost'
          )}
        </button>
      </form>
    </div>
  );
}
