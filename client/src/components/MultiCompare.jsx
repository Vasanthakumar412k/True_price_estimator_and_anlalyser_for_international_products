import { useState } from 'react';

const countries = [
  { name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  { name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { name: 'China', currency: 'CNY', flag: '🇨🇳' },
  { name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
  { name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  { name: 'Hong Kong', currency: 'HKD', flag: '🇭🇰' },
  { name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
  { name: 'Malaysia', currency: 'MYR', flag: '🇲🇾' },
  { name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
  { name: 'Switzerland', currency: 'CHF', flag: '🇨🇭' },
  { name: 'Taiwan', currency: 'TWD', flag: '🇹🇼' }
];

const categories = [
  'Electronics', 'Mobile Phones', 'Laptops & Computers', 'Fashion & Clothing',
  'Footwear', 'Watches', 'Jewelry & Accessories', 'Cosmetics & Beauty',
  'Home Appliances', 'Kitchen Appliances', 'Tools & Hardware',
  'Sports & Fitness', 'Audio Equipment', 'Other'
];

const defaultEntry = () => ({
  id: Date.now() + Math.random(),
  country: 'United States',
  currency: 'USD',
  price: '',
  shipping: '',
  insurance: '',
  courierFees: ''
});

export default function MultiCompare({ apiBase, showNotification }) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [importMethod, setImportMethod] = useState('online');
  const [indiaPrice, setIndiaPrice] = useState('');
  const [entries, setEntries] = useState([defaultEntry(), { ...defaultEntry(), country: 'United Kingdom', currency: 'GBP' }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addEntry = () => {
    setEntries([...entries, defaultEntry()]);
  };

  const removeEntry = (id) => {
    if (entries.length > 2) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id, field, value) => {
    setEntries(entries.map(e => {
      if (e.id !== id) return e;
      if (field === 'country') {
        const c = countries.find(x => x.name === value);
        return { ...e, country: value, currency: c ? c.currency : e.currency };
      }
      return { ...e, [field]: value };
    }));
  };

  const handleCompare = async () => {
    const validEntries = entries.filter(e => e.price && parseFloat(e.price) > 0);
    if (validEntries.length < 2) {
      showNotification('Please fill in prices for at least 2 countries');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const promises = validEntries.map(entry =>
        fetch(`${apiBase}/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: productName || 'Product',
            category,
            country: entry.country,
            productPrice: entry.price,
            currency: entry.currency,
            shippingCost: entry.shipping || '0',
            insuranceCost: entry.insurance || '0',
            courierFees: entry.courierFees || '0',
            importMethod,
            indiaPrice: indiaPrice || null
          })
        }).then(r => r.json())
      );

      const responses = await Promise.all(promises);
      const res = responses
        .filter(r => r.success)
        .map(r => r.result);

      setResults(res);
    } catch (err) {
      showNotification('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (num) => '₹' + Math.round(num || 0).toLocaleString('en-IN');

  // Find lowest total cost
  const lowestCost = results.length > 0 ? Math.min(...results.map(r => r.totalLandedCost)) : 0;

  return (
    <div className="glass-card" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2><span className="icon">📊</span> Multi-Country Comparison</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Compare the import cost of the same product from multiple countries side by side.
      </p>

      {/* Common product info */}
      <div className="form-row">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder="e.g., Sony WH-1000XM5"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Import Method</label>
          <div className="import-method-toggle">
            <button type="button" className={`toggle-option ${importMethod === 'online' ? 'active' : ''}`} onClick={() => setImportMethod('online')}>📦 Online</button>
            <button type="button" className={`toggle-option ${importMethod === 'traveller' ? 'active' : ''}`} onClick={() => setImportMethod('traveller')}>✈️ Traveller</button>
          </div>
        </div>
        <div className="form-group">
          <label>India Market Price (₹ optional)</label>
          <input type="number" value={indiaPrice} onChange={e => setIndiaPrice(e.target.value)} placeholder="Enter for comparison" min="0" />
        </div>
      </div>

      {/* Country entries */}
      <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '16px', marginBottom: '12px', fontWeight: 600 }}>
        🌍 Country-wise Prices
      </h3>

      <div className="compare-entries">
        {entries.map((entry, idx) => (
          <div className="compare-entry" key={entry.id}>
            <div className="entry-header">
              <span className="entry-number">Country #{idx + 1}</span>
              {entries.length > 2 && (
                <button className="remove-entry-btn" onClick={() => removeEntry(entry.id)}>×</button>
              )}
            </div>
            <div className="form-row" style={{ marginBottom: '8px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Country</label>
                <select value={entry.country} onChange={e => updateEntry(entry.id, 'country', e.target.value)}>
                  {countries.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Price ({entry.currency})</label>
                <input type="number" value={entry.price} onChange={e => updateEntry(entry.id, 'price', e.target.value)} placeholder="0" min="0" step="0.01" />
              </div>
            </div>
            {importMethod === 'online' && (
              <div className="form-row-3">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Shipping</label>
                  <input type="number" value={entry.shipping} onChange={e => updateEntry(entry.id, 'shipping', e.target.value)} placeholder="0" min="0" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Insurance</label>
                  <input type="number" value={entry.insurance} onChange={e => updateEntry(entry.id, 'insurance', e.target.value)} placeholder="0" min="0" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Courier Fee</label>
                  <input type="number" value={entry.courierFees} onChange={e => updateEntry(entry.id, 'courierFees', e.target.value)} placeholder="0" min="0" />
                </div>
              </div>
            )}
          </div>
        ))}
        <button className="add-entry-btn" onClick={addEntry}>+ Add Another Country</button>
      </div>

      <button className="btn-primary" onClick={handleCompare} disabled={loading}>
        {loading ? <span className="loading-spinner">Comparing...</span> : '📊 Compare All Countries'}
      </button>

      {/* Results Table */}
      {results.length > 0 && (
        <div style={{ marginTop: '28px', animation: 'fadeInUp 0.5s ease-out' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '14px', fontWeight: 600 }}>
            📋 Comparison Results
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="compare-results-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Original Price</th>
                  <th>Converted (INR)</th>
                  <th>Customs Duty</th>
                  <th>IGST</th>
                  <th>Total Cost</th>
                  {results[0]?.indiaPrice && <th>vs India</th>}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td>{r.country}</td>
                    <td>{r.originalPrice?.toLocaleString()} {r.currency}</td>
                    <td>{fmt(r.convertedPriceINR)}</td>
                    <td>{fmt(r.customsDuty)}</td>
                    <td>{fmt(r.igst)}</td>
                    <td className={r.totalLandedCost === lowestCost ? 'best-value' : ''}>
                      {fmt(r.totalLandedCost)}
                      {r.totalLandedCost === lowestCost && ' ✅'}
                    </td>
                    {r.indiaPrice && (
                      <td style={{ color: r.priceDifference > 0 ? '#10b981' : '#ef4444' }}>
                        {r.recommendation}
                      </td>
                    )}
                  </tr>
                ))}
                {results[0]?.indiaPrice && (
                  <tr>
                    <td>🇮🇳 <strong>India</strong></td>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Local purchase</td>
                    <td className={results[0].indiaPrice <= lowestCost ? 'best-value' : ''}>
                      {fmt(results[0].indiaPrice)}
                      {results[0].indiaPrice <= lowestCost && ' ✅'}
                    </td>
                    <td>—</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
