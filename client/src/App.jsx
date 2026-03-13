import { useState, useEffect, useCallback } from 'react';
import AutoAnalyzer from './components/AutoAnalyzer';
import AutoResults from './components/AutoResults';
import ProductForm from './components/ProductForm';
import ResultsDashboard from './components/ResultsDashboard';
import SavedComparisons from './components/SavedComparisons';
import AIChatbot from './components/AIChatbot';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('auto');
  const [autoData, setAutoData] = useState(null);
  const [manualResult, setManualResult] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [savedComparisons, setSavedComparisons] = useState([]);

  useEffect(() => {
    fetchSavedComparisons();
  }, []);

  const fetchSavedComparisons = async () => {
    try {
      const res = await fetch(`${API_BASE}/comparisons`);
      const data = await res.json();
      if (data.success) setSavedComparisons(data.comparisons);
    } catch { /* ignore */ }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAutoResults = useCallback((data) => {
    setAutoData(data);
  }, []);

  const handleManualCalculate = useCallback(async (formData) => {
    setManualLoading(true);
    setManualResult(null);
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) setManualResult(data.result);
      else showNotification('Calculation failed.');
    } catch {
      showNotification('Could not connect to server.');
    } finally {
      setManualLoading(false);
    }
  }, []);

  const handleSave = useCallback(async (result) => {
    if (!result) return;
    try {
      const res = await fetch(`${API_BASE}/comparisons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('✅ Comparison saved!');
        fetchSavedComparisons();
      }
    } catch {
      showNotification('Failed to save');
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await fetch(`${API_BASE}/comparisons/${id}`, { method: 'DELETE' });
      fetchSavedComparisons();
      showNotification('Deleted');
    } catch {
      showNotification('Failed to delete');
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Global Buy vs India Price Analyzer</h1>
        <p className="subtitle">
          AI-powered tool — search any product, we automatically compare prices from 24+ global stores
        </p>
        <div className="ai-badge-header">🤖 Powered by AI — Chatbot, Smart Search & Price Predictions</div>
        <div className="flag-bar">🇮🇳 🇺🇸 🇬🇧 🇦🇪 🇯🇵 🇩🇪 🇫🇷 🇨🇳 🇰🇷 🇦🇺 🇨🇦 🇸🇬</div>
      </header>

      <nav className="tab-nav" id="main-nav">
        <button className={`tab-btn ${activeTab === 'auto' ? 'active' : ''}`} onClick={() => setActiveTab('auto')} id="tab-auto">
          ⚡ Auto Analyzer
        </button>
        <button className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')} id="tab-manual">
          🧮 Manual Entry
        </button>
        <button className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')} id="tab-saved">
          💾 Saved ({savedComparisons.length})
        </button>
      </nav>

      {activeTab === 'auto' && (
        <div className="auto-layout">
          <AutoAnalyzer onResultsReady={handleAutoResults} showNotification={showNotification} />
          <AutoResults data={autoData} onSave={handleSave} showNotification={showNotification} />
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="main-grid">
          <ProductForm onCalculate={handleManualCalculate} loading={manualLoading} />
          <ResultsDashboard result={manualResult} onSave={() => handleSave(manualResult)} />
        </div>
      )}

      {activeTab === 'saved' && (
        <SavedComparisons comparisons={savedComparisons} onDelete={handleDelete} showNotification={showNotification} />
      )}

      {notification && <div className="notification">{notification}</div>}

      <AIChatbot />

      <footer className="footer">
        <p>Global Buy vs India Price Analyzer © 2026 — AI-Powered | Exchange rates by <a href="https://open.er-api.com" target="_blank" rel="noreferrer">ExchangeRate API</a> | AI by Google Gemini</p>
        <p style={{ marginTop: '4px', opacity: 0.6 }}>Customs duty rates are approximate. Consult CBIC for exact rates.</p>
      </footer>
    </div>
  );
}

export default App;
