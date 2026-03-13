import CostChart from './CostChart';

const fmt = (n) => n == null ? '₹0' : '₹' + Math.round(n).toLocaleString('en-IN');

const FLAGS = {
  'United States':'🇺🇸','United Kingdom':'🇬🇧','Germany':'🇩🇪','France':'🇫🇷',
  'Italy':'🇮🇹','Netherlands':'🇳🇱','Spain':'🇪🇸','United Arab Emirates':'🇦🇪',
  'Japan':'🇯🇵','Australia':'🇦🇺','Canada':'🇨🇦','Singapore':'🇸🇬',
  'Hong Kong':'🇭🇰','South Korea':'🇰🇷','China':'🇨🇳','Switzerland':'🇨🇭',
  'Saudi Arabia':'🇸🇦','Sweden':'🇸🇪','India':'🇮🇳'
};

export default function AutoResults({ data, onSave, showNotification }) {
  if (!data) {
    return (
      <div className="glass-card">
        <h2><span className="icon">📊</span> Analysis Results</h2>
        <div className="empty-state">
          <div className="icon">🌍</div>
          <p>Search for a product and click <strong>"Search All Marketplaces"</strong> to see prices from Amazon, eBay, Walmart, and 20+ stores worldwide.</p>
          <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            We auto-calculate shipping, insurance, customs duty, GST & handling fees for each store.
          </p>
        </div>
      </div>
    );
  }

  const { product, allListings, indiaListings, countryResults, cheapestImport, cheapestIndia, totalStoresSearched, countriesFound } = data;
  const indiaPrice = cheapestIndia ? cheapestIndia.price : product.indiaPrice;
  const isBuyIndiaBetter = !cheapestImport || indiaPrice <= cheapestImport.totalLandedCost;
  const bestOption = isBuyIndiaBetter ? 'India' : cheapestImport.country;
  const savings = isBuyIndiaBetter
    ? (cheapestImport ? cheapestImport.totalLandedCost - indiaPrice : 0)
    : (indiaPrice - cheapestImport.totalLandedCost);

  const detailResult = cheapestImport;

  return (
    <div className="results-section">
      {/* Search Summary */}
      <div className="glass-card search-summary-card" style={{ marginBottom: '20px' }}>
        <div className="search-summary-grid">
          <div className="search-stat">
            <div className="search-stat-number">{totalStoresSearched}</div>
            <div className="search-stat-label">Stores Searched</div>
          </div>
          <div className="search-stat">
            <div className="search-stat-number">{countriesFound?.length || 0}</div>
            <div className="search-stat-label">Countries Found</div>
          </div>
          <div className="search-stat">
            <div className="search-stat-number">{allListings.length}</div>
            <div className="search-stat-label">Import Options</div>
          </div>
          <div className="search-stat">
            <div className="search-stat-number">{indiaListings.length}</div>
            <div className="search-stat-label">India Stores</div>
          </div>
        </div>
      </div>

      {/* BIG Recommendation Card */}
      <div className={`recommendation-card ${isBuyIndiaBetter ? 'buy-india' : 'buy-abroad'}`}>
        <div className="rec-icon">{isBuyIndiaBetter ? '🇮🇳' : '✈️'}</div>
        <div className="rec-main">
          <div className="rec-verdict">
            {isBuyIndiaBetter ? 'BUY IN INDIA' : `BUY FROM ${cheapestImport?.country?.toUpperCase()}`}
          </div>
          <div className="rec-savings">
            {savings > 0
              ? `You save ${fmt(savings)} compared to ${isBuyIndiaBetter ? 'importing' : 'buying in India'}`
              : 'Best available price'}
          </div>
          {!isBuyIndiaBetter && cheapestImport && (
            <div className="rec-detail">
              🏪 {cheapestImport.marketplaceName} · 📦 {cheapestImport.delivery?.label || '7–14 days'}
            </div>
          )}
          {isBuyIndiaBetter && cheapestIndia && (
            <div className="rec-detail">
              🏪 {cheapestIndia.marketplaceName} · 📦 {cheapestIndia.delivery?.label || '1–5 days'}
            </div>
          )}
        </div>
      </div>

      {/* Price Comparison Summary */}
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <div className="quick-summary">
          <div className={`summary-item india ${isBuyIndiaBetter ? 'winner' : ''}`}>
            <div className="summary-label">🇮🇳 Best India Price</div>
            <div className="summary-value">{fmt(indiaPrice)}</div>
            {cheapestIndia && <div className="summary-store">{cheapestIndia.marketplaceName}</div>}
            {isBuyIndiaBetter && <div className="winner-tag">✅ BEST OPTION</div>}
          </div>
          {cheapestImport && (
            <div className={`summary-item import ${!isBuyIndiaBetter ? 'winner' : ''}`}>
              <div className="summary-label">{FLAGS[cheapestImport.country]||'🌍'} Best Import ({cheapestImport.country})</div>
              <div className="summary-value">{fmt(cheapestImport.totalLandedCost)}</div>
              <div className="summary-store">{cheapestImport.marketplaceName}</div>
              {!isBuyIndiaBetter && <div className="winner-tag">✅ BEST OPTION</div>}
            </div>
          )}
        </div>
      </div>

      {/* India Marketplace Prices */}
      {indiaListings.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <h2><span className="icon">🇮🇳</span> India Market Prices</h2>
          <div className="marketplace-grid">
            {indiaListings.sort((a, b) => a.price - b.price).map((l, i) => (
              <div key={i} className={`marketplace-card ${i === 0 ? 'cheapest' : ''}`}>
                <div className="mp-icon">{l.icon}</div>
                <div className="mp-info">
                  <div className="mp-name">{l.marketplaceName}</div>
                  <div className="mp-url">{l.url}</div>
                  <div className="mp-delivery">📦 {l.delivery?.label || '1–5 days'}</div>
                </div>
                <div className="mp-price">{fmt(l.price)}</div>
                {i === 0 && <span className="cheapest-badge">Cheapest</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Marketplace Listings — Grouped by Country */}
      {countryResults.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <h2><span className="icon">🌍</span> Global Import Comparison (Best per Country)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="compare-results-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Best Store</th>
                  <th>Local Price</th>
                  <th>Converted ₹</th>
                  <th>Shipping</th>
                  <th>Duty + GST</th>
                  <th>Total Import Cost</th>
                  <th>📦 Delivery</th>
                  <th>vs India</th>
                </tr>
              </thead>
              <tbody>
                {countryResults.map((r, i) => {
                  const diff = indiaPrice - r.totalLandedCost;
                  const isBest = i === 0 && diff > 0;
                  return (
                    <tr key={i} className={isBest ? 'best-row' : ''}>
                      <td>{FLAGS[r.country]||'🌍'} {r.country}</td>
                      <td><span className="store-in-table">{r.icon} {r.marketplaceName}</span></td>
                      <td>{r.price?.toLocaleString()} {r.currency}</td>
                      <td>{fmt(r.convertedPriceINR)}</td>
                      <td>{fmt(r.shippingINR)}</td>
                      <td>{fmt((r.customsDuty || 0) + (r.igst || 0))}</td>
                      <td className={isBest ? 'best-value' : ''}>{fmt(r.totalLandedCost)} {isBest && '✅'}</td>
                      <td className="delivery-cell">{r.delivery?.label || '—'}</td>
                      <td style={{ color: diff > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                        {diff > 0 ? `Save ${fmt(diff)}` : `+${fmt(Math.abs(diff))}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Store Listings Expanded */}
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h2><span className="icon">🏪</span> All Marketplace Listings ({allListings.length} results)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="compare-results-table all-listings-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Country</th>
                <th>Price</th>
                <th>In ₹</th>
                <th>Shipping</th>
                <th>Customs</th>
                <th>IGST</th>
                <th>Total Cost</th>
                <th>📦 Delivery</th>
                <th>vs India</th>
              </tr>
            </thead>
            <tbody>
              {allListings.map((r, i) => {
                const diff = indiaPrice - r.totalLandedCost;
                return (
                  <tr key={i} className={i === 0 ? 'best-row' : ''}>
                    <td><span className="store-in-table">{r.icon} {r.marketplaceName}</span></td>
                    <td>{FLAGS[r.country]||'🌍'} {r.country}</td>
                    <td>{r.price?.toLocaleString()} {r.currency}</td>
                    <td>{fmt(r.convertedPriceINR)}</td>
                    <td>{fmt(r.shippingINR)}</td>
                    <td>{fmt(r.customsDuty)}</td>
                    <td>{fmt(r.igst)}</td>
                    <td className={i === 0 && diff > 0 ? 'best-value' : ''}>{fmt(r.totalLandedCost)}</td>
                    <td className="delivery-cell">{r.delivery?.label || '—'}</td>
                    <td style={{ color: diff > 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>
                      {diff > 0 ? `Save ${fmt(diff)}` : `+${fmt(Math.abs(diff))}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          🤖 Shipping, insurance & courier fees auto-estimated by product weight. Exchange rates from live API.
        </p>
      </div>

      {/* Detailed Breakdown of Best Import */}
      {detailResult && (
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <h2><span className="icon">📋</span> Cost Breakdown — {detailResult.icon} {detailResult.marketplaceName} ({detailResult.country})</h2>
          <div className="exchange-rate-badge">
            💱 1 {detailResult.currency} = ₹{detailResult.exchangeRate?.toFixed(2)} INR (Live Rate)
          </div>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span className="label">🏷️ Product Price</span>
              <span className="value">{detailResult.price?.toLocaleString()} {detailResult.currency}</span>
            </div>
            <div className="cost-item">
              <span className="label">💱 Converted to INR</span>
              <span className="value">{fmt(detailResult.convertedPriceINR)}</span>
            </div>
            {detailResult.importMethod !== 'traveller' && (
              <>
                <div className="cost-item">
                  <span className="label">🚚 Shipping</span>
                  <span className="value">{fmt(detailResult.shippingINR)}</span>
                </div>
                <div className="cost-item">
                  <span className="label">🛡️ Insurance (1.5%)</span>
                  <span className="value">{fmt(detailResult.insuranceINR)}</span>
                </div>
              </>
            )}
            <div className="cost-item">
              <span className="label">🏛️ Customs Duty ({detailResult.bcdPercent}%)</span>
              <span className="value">{fmt(detailResult.customsDuty)}</span>
            </div>
            <div className="cost-item">
              <span className="label">📋 IGST ({detailResult.igstPercent}%)</span>
              <span className="value">{fmt(detailResult.igst)}</span>
            </div>
            {detailResult.importMethod !== 'traveller' && (
              <div className="cost-item">
                <span className="label">📬 Courier Fee</span>
                <span className="value">{fmt(detailResult.courierFeesINR)}</span>
              </div>
            )}
            <div className="cost-item total">
              <span className="label">🎯 Total Landed Cost</span>
              <span className="value">{fmt(detailResult.totalLandedCost)}</span>
            </div>
            <div className="cost-item">
              <span className="label">🇮🇳 India Best Price</span>
              <span className="value">{fmt(indiaPrice)}</span>
            </div>
            <div className="cost-item">
              <span className="label">📦 Estimated Delivery</span>
              <span className="value">{detailResult.delivery?.label || '7–14 days'} (Express: {detailResult.delivery?.expressLabel || '~4 days'})</span>
            </div>
          </div>

          <CostChart result={detailResult} />

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn-secondary" onClick={() => onSave(detailResult)}>💾 Save</button>
            <button className="btn-secondary" onClick={() => {
              const text = `${product.name}\n\nSearched ${totalStoresSearched} stores across ${countriesFound?.length} countries\nBest India: ${fmt(indiaPrice)} (${cheapestIndia?.marketplaceName})\n${cheapestImport ? `Best Import: ${fmt(cheapestImport.totalLandedCost)} (${cheapestImport.marketplaceName}, ${cheapestImport.country})` : ''}\nRecommendation: ${isBuyIndiaBetter ? 'Buy in India' : `Import from ${bestOption}`}`;
              navigator.clipboard.writeText(text);
              showNotification('📋 Copied!');
            }}>📋 Share</button>
          </div>
        </div>
      )}
    </div>
  );
}
