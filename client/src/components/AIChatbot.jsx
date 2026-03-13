import { useState, useRef, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi! I\'m your AI shopping assistant.\n\nI can help with:\n• 🔗 **Paste a product link** — I\'ll analyze the import cost\n• 📦 Search product details & prices\n• 🏛️ Import duties & customs info\n• ✈️ Traveller allowance rules\n• 📈 Price predictions\n\nTry pasting an Amazon/eBay/Walmart link!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/ai/status`).then(r => r.json()).then(setAiStatus).catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Check for URL paste — analyze product link
    if (msg.match(/^https?:\/\//i)) {
      await handleLinkAnalysis(msg);
      setLoading(false);
      return;
    }

    // Check for price prediction trigger
    if (msg.toLowerCase().includes('predict') || msg.toLowerCase().includes('when to buy') || msg.toLowerCase().includes('price trend')) {
      await handlePrediction(msg);
      setLoading(false);
      return;
    }

    // Check for product search — show full details if a product is found
    if (msg.toLowerCase().match(/search|details|tell me about|info|show me|find|price of|how much/)) {
      const found = await handleProductDetails(msg);
      if (found) { setLoading(false); return; }
    }

    try {
      const history = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history })
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || 'Sorry, I couldn\'t process that.',
        aiPowered: data.aiPowered
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Could not reach the server. Please make sure the backend is running.'
      }]);
    }
    setLoading(false);
  };

  const handlePrediction = async (msg) => {
    // Try to find a product in the message
    try {
      const searchRes = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(msg)}`);
      const searchData = await searchRes.json();

      if (searchData.products && searchData.products.length > 0) {
        const product = searchData.products[0];
        const predRes = await fetch(`${API_BASE}/ai/predict/${product.id}`);
        const predData = await predRes.json();

        if (predData.success) {
          let predMsg = `📈 **Price Prediction: ${predData.product.name}**\n\n`;
          predMsg += `Current Price: ₹${predData.product.currentPrice?.toLocaleString()} (${predData.currentMonth})\n\n`;
          predMsg += `**Next 6 Months:**\n`;
          predData.predictions.forEach(p => {
            const icon = p.trend === 'down' ? '📉' : p.trend === 'up' ? '📈' : '➡️';
            const sale = p.isSaleSeason ? ' 🏷️ SALE' : '';
            predMsg += `${icon} **${p.month}**: ₹${p.indiaPrice.toLocaleString()} (${p.changePercent > 0 ? '+' : ''}${p.changePercent}%)${sale}\n`;
          });
          predMsg += `\n💡 ${predData.analysis}`;
          predMsg += `\n\n⚠️ *${predData.note}*`;

          setMessages(prev => [...prev, { role: 'assistant', content: predMsg, aiPowered: false }]);
          return;
        }
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🔍 Could not find that product for prediction. Try specifying a product name like "predict iPhone price" or "when to buy MacBook"'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Prediction failed. Please try again.'
      }]);
    }
  };

  const handleLinkAnalysis = async (url) => {
    try {
      const res = await fetch(`${API_BASE}/ai/analyze-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      const data = await res.json();

      if (!data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${data.error}`, aiPowered: false }]);
        return;
      }

      let linkMsg = `🔗 **Link Analysis**\n\n`;
      linkMsg += `🏪 Store: **${data.store?.store}**\n`;
      linkMsg += `🌍 Country: **${data.store?.country}**\n`;
      linkMsg += `💱 Currency: **${data.store?.currency}**\n\n`;

      if (data.matchedProduct) {
        const p = data.matchedProduct;
        linkMsg += `📦 **Product Matched: ${p.name}**\n`;
        linkMsg += `📁 Category: ${p.category}\n`;
        linkMsg += `🇮🇳 India Price: **₹${p.indiaPrice?.toLocaleString()}**\n`;

        if (data.listingPrice) {
          linkMsg += `🏷️ Store Price: **${data.listingPrice?.toLocaleString()} ${data.store?.currency}**\n\n`;
        }

        if (data.importCost) {
          const ic = data.importCost;
          linkMsg += `**📋 Import Cost Breakdown:**\n`;
          linkMsg += `💱 Converted: ₹${Math.round(ic.convertedPriceINR)?.toLocaleString()}\n`;
          linkMsg += `🚚 Shipping: ₹${Math.round(ic.shippingINR)?.toLocaleString()}\n`;
          linkMsg += `🛡️ Insurance: ₹${Math.round(ic.insuranceINR)?.toLocaleString()}\n`;
          linkMsg += `🏛️ Customs Duty (${ic.bcdPercent}%): ₹${Math.round(ic.customsDuty)?.toLocaleString()}\n`;
          linkMsg += `📋 IGST (${ic.igstPercent}%): ₹${Math.round(ic.igst)?.toLocaleString()}\n`;
          linkMsg += `📬 Courier: ₹${Math.round(ic.courierFeesINR)?.toLocaleString()}\n\n`;
          linkMsg += `🎯 **Total Landed Cost: ₹${Math.round(ic.totalLandedCost)?.toLocaleString()}**\n`;
          linkMsg += `🇮🇳 India Price: ₹${ic.indiaPrice?.toLocaleString()}\n`;
          linkMsg += `📦 Delivery: ${ic.delivery?.label || '7–14 days'}\n\n`;

          if (ic.savings > 0) {
            linkMsg += `✅ **Import & Save ₹${Math.round(ic.savings)?.toLocaleString()}!**`;
          } else {
            linkMsg += `🏷️ **Buy in India — save ₹${Math.round(Math.abs(ic.savings))?.toLocaleString()}**`;
          }
        }
      } else {
        linkMsg += `⚠️ Could not identify the exact product from the URL.\n`;
        linkMsg += `💡 *Try searching by product name in the Auto Analyzer tab!*`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: linkMsg, aiPowered: false }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Failed to analyze the link. Please try again.' }]);
    }
  };

  const quickQuestions = [
    'Search iPhone 16 Pro details',
    'Predict MacBook price',
    'Find AirPods Pro details',
    'Traveller duty-free limit?',
    'Paste a product link to analyze!'
  ];

  const handleProductDetails = async (msg) => {
    try {
      const searchRes = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(msg)}`);
      const searchData = await searchRes.json();
      if (!searchData.products || searchData.products.length === 0) return false;

      const p = searchData.products[0];
      let detailMsg = `📦 **${p.name}**\n\n`;
      detailMsg += `📁 Category: **${p.category}**\n`;
      detailMsg += `⚖️ Weight: ${p.weight} kg\n`;
      detailMsg += `🇮🇳 India Price: **₹${p.indiaPrice?.toLocaleString()}**\n\n`;
      detailMsg += `🏪 **Available in ${p.stores?.length || 0} Stores across ${p.countries?.length || 0} Countries:**\n\n`;

      if (p.countries && p.countries.length > 0) {
        const FLAGS = { 'United States':'🇺🇸','United Kingdom':'🇬🇧','Germany':'🇩🇪','United Arab Emirates':'🇦🇪','Japan':'🇯🇵','Australia':'🇦🇺','Canada':'🇨🇦','Singapore':'🇸🇬','India':'🇮🇳' };
        const DELIVERY = { 'United States':'7–14 days','United Kingdom':'6–12 days','Germany':'7–14 days','United Arab Emirates':'4–8 days','Japan':'5–10 days','Australia':'8–16 days','Canada':'8–15 days','Singapore':'3–7 days','India':'1–5 days' };
        p.countries.forEach(c => {
          const storesInCountry = p.stores?.filter(s => {
            const countryMap = { 'US': 'United States', 'UK': 'United Kingdom', 'DE': 'Germany', 'AE': 'United Arab Emirates', 'JP': 'Japan', 'AU': 'Australia', 'CA': 'Canada', 'SG': 'Singapore', 'IN': 'India' };
            return Object.entries(countryMap).some(([code, name]) => name === c && s.includes(code)) || (c === 'India' && (s.includes('Flipkart') || s.includes('Croma'))) || (c === 'United States' && (s.includes('Walmart') || s.includes('Best Buy') || s.includes('Target') || s.includes('eBay US')));
          }) || [];
          detailMsg += `${FLAGS[c]||'🌍'} **${c}** — 📦 ${DELIVERY[c] || '7–14 days'}\n`;
        });
      }

      detailMsg += `\n💡 *Use the Auto Analyzer tab to see the full import cost comparison with customs duty, GST, and shipping included!*`;

      setMessages(prev => [...prev, { role: 'assistant', content: detailMsg, aiPowered: false }]);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)} id="chat-toggle">
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" id="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <span className="chat-avatar">🤖</span>
              <div>
                <div className="chat-title">AI Shopping Assistant</div>
                <div className="chat-status">
                  {aiStatus?.geminiEnabled
                    ? <span className="status-dot active"></span>
                    : <span className="status-dot"></span>
                  }
                  {aiStatus?.geminiEnabled ? 'Gemini AI Active' : 'Smart Mode'}
                </div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.role === 'assistant' && <span className="msg-avatar">🤖</span>}
                <div className="msg-bubble">
                  <div className="msg-content" dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                  {m.aiPowered !== undefined && (
                    <div className="msg-badge">{m.aiPowered ? '✨ Gemini AI' : '💡 Smart Mode'}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <span className="msg-avatar">🤖</span>
                <div className="msg-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="quick-questions">
              {quickQuestions.map((q, i) => (
                <button key={i} className="quick-q" onClick={() => { setInput(q); }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any product..."
              id="chat-input"
            />
            <button className="chat-send" onClick={handleSend} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Simple markdown-like formatting
function formatMessage(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '&bull;');
}
