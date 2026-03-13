const fmt = (num) => {
  if (num === undefined || num === null) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

export default function SavedComparisons({ comparisons, onDelete, showNotification }) {
  if (!comparisons || comparisons.length === 0) {
    return (
      <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2><span className="icon">💾</span> Saved Comparisons</h2>
        <div className="empty-state">
          <div className="icon">📁</div>
          <p>No saved comparisons yet.</p>
          <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
            Use the Calculator tab to analyze a product and click "Save Comparison" to store it here.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = (item) => {
    const text = `Product: ${item.productName || 'N/A'}\nFrom: ${item.country || 'N/A'}\nImport Cost: ${fmt(item.totalLandedCost)}\n${item.indiaPrice ? `India Price: ${fmt(item.indiaPrice)}\nRecommendation: ${item.recommendation}` : ''}`;
    navigator.clipboard.writeText(text);
    showNotification('📋 Copied to clipboard!');
  };

  return (
    <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2><span className="icon">💾</span> Saved Comparisons ({comparisons.length})</h2>

      <div className="saved-list">
        {comparisons.map(item => (
          <div className="saved-item" key={item.id}>
            <div className="saved-item-header">
              <h3>{item.productName || 'Unknown Product'}</h3>
              <span className="date">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : ''}
              </span>
            </div>

            <div className="saved-item-details">
              <div className="saved-detail">
                <span className="detail-label">From</span>
                <span className="detail-value">{item.country || 'N/A'}</span>
              </div>
              <div className="saved-detail">
                <span className="detail-label">Original Price</span>
                <span className="detail-value">{item.originalPrice} {item.currency}</span>
              </div>
              <div className="saved-detail">
                <span className="detail-label">Import Cost</span>
                <span className="detail-value">{fmt(item.totalLandedCost)}</span>
              </div>
              {item.indiaPrice && (
                <div className="saved-detail">
                  <span className="detail-label">India Price</span>
                  <span className="detail-value">{fmt(item.indiaPrice)}</span>
                </div>
              )}
              {item.recommendation && (
                <div className="saved-detail">
                  <span className="detail-label">Verdict</span>
                  <span className="detail-value" style={{
                    color: item.recommendation === 'Import from Abroad' ? '#10b981' : '#f59e0b'
                  }}>
                    {item.recommendation === 'Import from Abroad' ? '✅' : '🏷️'} {item.recommendation}
                  </span>
                </div>
              )}
            </div>

            <div className="saved-actions">
              <button className="btn-secondary" onClick={() => handleCopy(item)}>
                📋 Copy
              </button>
              <button className="btn-danger" onClick={() => onDelete(item.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
