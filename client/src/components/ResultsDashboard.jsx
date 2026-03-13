import CostChart from './CostChart';

const fmt = (num) => {
  if (num === undefined || num === null) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

export default function ResultsDashboard({ result, onSave }) {
  if (!result) {
    return (
      <div className="glass-card">
        <h2><span className="icon">📊</span> Results Dashboard</h2>
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>Fill in the product details and click <strong>"Analyze Import Cost"</strong> to see the complete cost breakdown here.</p>
          <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>
            You'll get: converted price, customs duty, GST, total landed cost, and a buy recommendation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card results-section">
      <h2><span className="icon">📊</span> Cost Breakdown</h2>

      {result.exchangeRate && (
        <div className="exchange-rate-badge">
          💱 1 {result.currency} = ₹{result.exchangeRate.toFixed(2)} INR (Live Rate)
        </div>
      )}

      {/* Recommendation Badge */}
      {result.recommendation && (
        <div className={`recommendation-badge ${result.recommendation === 'Import from Abroad' ? 'import' : 'india'}`}>
          {result.recommendation === 'Import from Abroad' ? '✅' : '🏷️'} {result.recommendation}
          {result.priceDifference !== undefined && (
            <span className="savings">
              {result.priceDifference > 0
                ? `Save ${fmt(Math.abs(result.priceDifference))} (${Math.abs(result.savingsPercent).toFixed(1)}%) by importing`
                : `Save ${fmt(Math.abs(result.priceDifference))} (${Math.abs(result.savingsPercent).toFixed(1)}%) by buying in India`
              }
            </span>
          )}
        </div>
      )}

      {/* Traveller mode info */}
      {result.importMethod === 'traveller' && (
        <div className="traveller-info" style={{ marginBottom: '16px' }}>
          ✈️ <strong>Traveller Mode Active</strong> — ₹50,000 duty-free allowance applied.
          {result.excessValue > 0
            ? ` Duty charged on excess value of ${fmt(result.excessValue)}.`
            : ` Your product value is within the duty-free limit! 🎉`
          }
        </div>
      )}

      {/* Cost Breakdown Grid */}
      <div className="cost-breakdown">
        <div className="cost-item">
          <span className="label">🏷️ Product Price ({result.currency})</span>
          <span className="value">{result.originalPrice?.toLocaleString()} {result.currency}</span>
        </div>
        <div className="cost-item">
          <span className="label">💱 Converted Price (INR)</span>
          <span className="value">{fmt(result.convertedPriceINR)}</span>
        </div>
        {result.importMethod === 'online' && (
          <>
            <div className="cost-item">
              <span className="label">🚚 Shipping</span>
              <span className="value">{fmt(result.shippingINR)}</span>
            </div>
            <div className="cost-item">
              <span className="label">🛡️ Insurance</span>
              <span className="value">{fmt(result.insuranceINR)}</span>
            </div>
          </>
        )}
        <div className="cost-item">
          <span className="label">🏛️ Customs Duty (BCD {result.bcdPercent}%)</span>
          <span className="value">{fmt(result.customsDuty)}</span>
        </div>
        <div className="cost-item">
          <span className="label">📋 IGST ({result.igstPercent}%)</span>
          <span className="value">{fmt(result.igst)}</span>
        </div>
        {result.importMethod === 'online' && (
          <div className="cost-item">
            <span className="label">📬 Courier/Handling Fees</span>
            <span className="value">{fmt(result.courierFeesINR)}</span>
          </div>
        )}
        <div className="cost-item total">
          <span className="label">🎯 Total Landed Cost</span>
          <span className="value">{fmt(result.totalLandedCost)}</span>
        </div>
        {result.indiaPrice && (
          <div className="cost-item">
            <span className="label">🇮🇳 India Market Price</span>
            <span className="value">{fmt(result.indiaPrice)}</span>
          </div>
        )}
        {result.priceDifference !== undefined && (
          <div className="cost-item">
            <span className="label">💰 Price Difference</span>
            <span className="value" style={{
              color: result.priceDifference > 0 ? '#10b981' : '#ef4444'
            }}>
              {result.priceDifference > 0 ? '+' : ''}{fmt(result.priceDifference)}
            </span>
          </div>
        )}
      </div>

      {/* Charts */}
      <CostChart result={result} />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button className="btn-secondary" onClick={onSave} id="btn-save">
          💾 Save Comparison
        </button>
        <button className="btn-secondary" onClick={() => {
          const text = `Global Buy vs India Price Analyzer\n\nProduct: ${result.productName}\nFrom: ${result.country}\nPrice: ${result.originalPrice} ${result.currency}\nTotal Import Cost: ${fmt(result.totalLandedCost)}${result.indiaPrice ? `\nIndia Price: ${fmt(result.indiaPrice)}\nRecommendation: ${result.recommendation}` : ''}`;
          navigator.clipboard.writeText(text);
        }} id="btn-share">
          📋 Copy to Share
        </button>
      </div>
    </div>
  );
}
