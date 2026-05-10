import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Calculator, Plus, Check, X, Star, Copy, ClipboardCheck, Sun, Moon, BarChart3, Globe } from 'lucide-react';

// ─── i18n ───
const translations = {
  es: {
    title: 'Conversor',
    baseCurrency: 'Moneda base',
    selectCurrencies: 'Seleccionar divisas',
    done: 'Listo',
    selected: 'seleccionadas',
    calculator: 'Calculadora',
    apply: 'Aplicar',
    lastUpdate: 'Última actualización',
    history: 'Historial 7 días',
    loading: 'Cargando...',
    noData: 'Sin datos disponibles',
    copy: 'Copiar',
  },
  en: {
    title: 'Converter',
    baseCurrency: 'Base currency',
    selectCurrencies: 'Select currencies',
    done: 'Done',
    selected: 'selected',
    calculator: 'Calculator',
    apply: 'Apply',
    lastUpdate: 'Last update',
    history: '7-day history',
    loading: 'Loading...',
    noData: 'No data available',
    copy: 'Copy',
  }
};

// ─── Sparkline SVG ───
const Sparkline = ({ data, width = 260, height = 80, color = '#14b8a6' }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * w;
    const y = padding + h - ((val - min) / range) * h;
    return `${x},${y}`;
  });

  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? '#34d399' : '#f87171';
  const fillId = `sparkFill-${Math.random().toString(36).slice(2)}`;

  const areaPoints = `${padding},${padding + h} ${points.join(' ')} ${padding + w},${padding + h}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${fillId})`} />
      <polyline points={points.join(' ')} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Start and end dots */}
      {points.length > 0 && (
        <>
          <circle cx={points[0].split(',')[0]} cy={points[0].split(',')[1]} r="3" fill={lineColor} />
          <circle cx={points[points.length-1].split(',')[0]} cy={points[points.length-1].split(',')[1]} r="3" fill={lineColor} />
        </>
      )}
    </svg>
  );
};

const CurrencyConverter = () => {
  const allCurrencies = [
    { code: 'USD', name: 'Dólar estadounidense', flag: '🇺🇸', symbol: '$' },
    { code: 'COP', name: 'Peso colombiano', flag: '🇨🇴', symbol: '$' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
    { code: 'HNL', name: 'Lempira hondureña', flag: '🇭🇳', symbol: 'L' },
    { code: 'MXN', name: 'Peso mexicano', flag: '🇲🇽', symbol: '$' },
    { code: 'GBP', name: 'Libra esterlina', flag: '🇬🇧', symbol: '£' },
    { code: 'JPY', name: 'Yen japonés', flag: '🇯🇵', symbol: '¥' },
    { code: 'CNY', name: 'Yuan chino', flag: '🇨🇳', symbol: '¥' },
    { code: 'CAD', name: 'Dólar canadiense', flag: '🇨🇦', symbol: '$' },
    { code: 'AUD', name: 'Dólar australiano', flag: '🇦🇺', symbol: '$' },
    { code: 'CHF', name: 'Franco suizo', flag: '🇨🇭', symbol: 'Fr' },
    { code: 'BRL', name: 'Real brasileño', flag: '🇧🇷', symbol: 'R$' },
    { code: 'ARS', name: 'Peso argentino', flag: '🇦🇷', symbol: '$' },
    { code: 'CLP', name: 'Peso chileno', flag: '🇨🇱', symbol: '$' },
    { code: 'PEN', name: 'Sol peruano', flag: '🇵🇪', symbol: 'S/' },
    { code: 'INR', name: 'Rupia india', flag: '🇮🇳', symbol: '₹' },
    { code: 'KRW', name: 'Won surcoreano', flag: '🇰🇷', symbol: '₩' },
    { code: 'TRY', name: 'Lira turca', flag: '🇹🇷', symbol: '₺' },
    { code: 'RUB', name: 'Rublo ruso', flag: '🇷🇺', symbol: '₽' },
    { code: 'SEK', name: 'Corona sueca', flag: '🇸🇪', symbol: 'kr' },
    { code: 'BTC', name: 'Bitcoin', flag: '₿', symbol: '₿', isCrypto: true },
    { code: 'ETH', name: 'Ethereum', flag: 'Ξ', symbol: 'Ξ', isCrypto: true },
    { code: 'SOL', name: 'Solana', flag: '◎', symbol: '◎', isCrypto: true }
  ];

  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('currency_rates');
    return saved ? JSON.parse(saved) : {};
  });
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(!localStorage.getItem('currency_rates'));
  const [lastUpdate, setLastUpdate] = useState(() => {
    const saved = localStorage.getItem('last_update');
    return saved ? new Date(saved) : null;
  });
  const [showCalculator, setShowCalculator] = useState(null);
  const [calculatorValue, setCalculatorValue] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState(() => {
    const saved = localStorage.getItem('selected_currencies');
    return saved ? JSON.parse(saved) : ['USD', 'COP', 'EUR', 'MXN', 'HNL', 'BTC', 'ETH'];
  });
  const [pinnedCurrencies, setPinnedCurrencies] = useState(() => {
    const saved = localStorage.getItem('pinned_currencies');
    return saved ? JSON.parse(saved) : [];
  });
  const [cryptoChange24h, setCryptoChange24h] = useState({});
  const [copiedCurrency, setCopiedCurrency] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const isDark = theme === 'dark';
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'es';
  });
  const t = translations[lang];
  const [showChart, setShowChart] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const fetchHistory = async (code) => {
    setShowChart(code);
    setChartData(null);
    setChartLoading(true);

    const cryptoMap = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana' };
    const isCrypto = ['BTC', 'ETH', 'SOL'].includes(code);

    try {
      if (isCrypto) {
        const res = await fetch(`https://api.coincap.io/v2/assets/${cryptoMap[code]}/history?interval=d1`);
        const json = await res.json();
        if (json.data) {
          const last7 = json.data.slice(-7);
          setChartData({
            values: last7.map(d => parseFloat(d.priceUsd)),
            labels: last7.map(d => new Date(d.time).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', day: 'numeric' })),
            currency: 'USD'
          });
        }
      } else {
        // Fetch last 7 days from Fawaz API using date endpoints
        const dates = [];
        for (let i = 7; i >= 1; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dates.push(d.toISOString().split('T')[0]);
        }
        const results = await Promise.allSettled(
          dates.map(date =>
            fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`)
              .then(r => r.json())
          )
        );
        const values = [];
        const labels = [];
        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value && r.value.usd) {
            const rate = r.value.usd[code.toLowerCase()];
            if (rate) {
              values.push(rate);
              labels.push(new Date(dates[i]).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', day: 'numeric' }));
            }
          }
        });
        if (values.length >= 2) {
          setChartData({ values, labels, currency: code });
        }
      }
    } catch (e) {
      console.warn('Failed to fetch history:', e);
    }
    setChartLoading(false);
  };

  const fetchRates = async () => {
    setLoading(true);

    // Fallback constants - Fiat rates (Currency per USD)
    const fallbackRates = {
      USD: 1,
      COP: 3935.50,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 148.12,
      HNL: 24.67,
      MXN: 17.15,
      CNY: 7.19,
      CAD: 1.35,
      AUD: 1.52,
      CHF: 0.86,
      BRL: 4.95,
      ARS: 823.50,
      CLP: 925.00,
      PEN: 3.75,
      INR: 83.12,
      KRW: 1335.50,
      TRY: 30.25,
      RUB: 88.50,
      SEK: 10.45,
      // Crypto rates (Crypto per USD) = 1 / Price in USD
      BTC: 1 / 43100,
      ETH: 1 / 2300,
      SOL: 1 / 98.50
    };

    try {
      // Map crypto codes to CoinCap IDs
      const cryptoMap = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana'
      };

      const isCryptoBase = ['BTC', 'ETH', 'SOL'].includes(baseCurrency);
      let combinedRates = { ...fallbackRates, ...rates };

      // Parallel fetch - Fawaz Currency API (more accurate rates) + CoinCap for crypto
      const [fiatResult, cryptoResult] = await Promise.allSettled([
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`).then(res => res.json()),
        fetch(`https://api.coincap.io/v2/assets?ids=${Object.values(cryptoMap).join(',')}`).then(res => res.json())
      ]);

      // Process Fiat - Fawaz API returns { usd: { cop: 3750, eur: 0.92, ... } }
      if (fiatResult.status === 'fulfilled' && fiatResult.value && fiatResult.value.usd) {
        const fawazRates = fiatResult.value.usd;
        Object.keys(fawazRates).forEach(key => {
          const upperKey = key.toUpperCase();
          // Only update currencies we know about (skip crypto codes, Fawaz doesn't have them)
          if (!['BTC', 'ETH', 'SOL'].includes(upperKey) && allCurrencies.some(c => c.code === upperKey)) {
            combinedRates[upperKey] = fawazRates[key];
          }
        });
        combinedRates['USD'] = 1; // Ensure USD base is 1
      } else {
        console.warn('Using cached/fallback fiat rates');
      }

      // Process Crypto
      if (cryptoResult.status === 'fulfilled' && cryptoResult.value && cryptoResult.value.data) {
        const change24h = {};
        cryptoResult.value.data.forEach(crypto => {
          const code = Object.keys(cryptoMap).find(k => cryptoMap[k] === crypto.id);
          if (code) {
            const priceInUSD = parseFloat(crypto.priceUsd);
            if (priceInUSD > 0) {
              combinedRates[code] = 1 / priceInUSD;
            }
            if (crypto.changePercent24Hr) {
              change24h[code] = parseFloat(crypto.changePercent24Hr);
            }
          }
        });
        setCryptoChange24h(change24h);
      } else {
        console.warn('Using cached/fallback crypto rates');
      }

      // Calculate relative rates
      const baseRate = combinedRates[baseCurrency] || fallbackRates[baseCurrency];
      const adjustedRates = {};
      Object.keys(combinedRates).forEach(code => {
        adjustedRates[code] = combinedRates[code] / baseRate;
      });

      setRates(adjustedRates);
      localStorage.setItem('currency_rates', JSON.stringify(adjustedRates));

      const now = new Date();
      setLastUpdate(now);
      localStorage.setItem('last_update', now.toISOString());

    } catch (error) {
      console.error('Critical error in rate calculation:', error);
      if (Object.keys(rates).length === 0) setRates(fallbackRates);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  const handleAmountChange = (currency, value) => {
    if (value === '') {
      setAmounts({});
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (!rates[currency]) return;

    const newAmounts = { [currency]: value };
    const baseAmount = numValue / rates[currency];

    allCurrencies.forEach(curr => {
      if (curr.code !== currency && rates[curr.code]) {
        const convertedValue = baseAmount * rates[curr.code];
        // Use more decimals for crypto and when values are very small
        const isCrypto = curr.isCrypto;
        const decimals = isCrypto && convertedValue < 1 ? 8 : isCrypto ? 6 : 2;
        newAmounts[curr.code] = convertedValue.toFixed(decimals);
      }
    });

    setAmounts(newAmounts);
  };

  const handleCalculatorClick = (currency) => {
    setShowCalculator(currency);
    setCalculatorValue(amounts[currency] || '');
  };

  const handleCalculatorButton = (value) => {
    if (value === 'C') {
      setCalculatorValue('');
    } else if (value === '⌫') {
      setCalculatorValue(calculatorValue.slice(0, -1));
    } else if (value === '=') {
      try {
        const result = eval(calculatorValue.replace('×', '*').replace('÷', '/'));
        setCalculatorValue(result.toString());
        handleAmountChange(showCalculator, result.toString());
      } catch (error) {
        setCalculatorValue('Error');
      }
    } else {
      setCalculatorValue(calculatorValue + value);
    }
  };

  const applyCalculatorValue = () => {
    if (calculatorValue && !isNaN(calculatorValue)) {
      handleAmountChange(showCalculator, calculatorValue);
    }
    setShowCalculator(null);
  };

  const toggleCurrency = (code) => {
    let updated;
    if (selectedCurrencies.includes(code)) {
      if (selectedCurrencies.length > 1) {
        updated = selectedCurrencies.filter(c => c !== code);
        // Also unpin if removed
        const updatedPins = pinnedCurrencies.filter(c => c !== code);
        setPinnedCurrencies(updatedPins);
        localStorage.setItem('pinned_currencies', JSON.stringify(updatedPins));
      } else {
        return;
      }
    } else {
      updated = [...selectedCurrencies, code];
    }
    setSelectedCurrencies(updated);
    localStorage.setItem('selected_currencies', JSON.stringify(updated));
  };

  const togglePin = (code) => {
    let updated;
    if (pinnedCurrencies.includes(code)) {
      updated = pinnedCurrencies.filter(c => c !== code);
    } else {
      updated = [...pinnedCurrencies, code];
    }
    setPinnedCurrencies(updated);
    localStorage.setItem('pinned_currencies', JSON.stringify(updated));
  };

  const copyToClipboard = (code) => {
    const value = amounts[code];
    if (!value) return;
    const currency = allCurrencies.find(c => c.code === code);
    const text = `${currency.symbol}${value} ${code}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCurrency(code);
      setTimeout(() => setCopiedCurrency(null), 1500);
    });
  };

  const calculatorButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', '⌫', '', '']
  ];

  const displayCurrencies = allCurrencies
    .filter(c => selectedCurrencies.includes(c.code))
    .sort((a, b) => {
      const aPinned = pinnedCurrencies.includes(a.code);
      const bPinned = pinnedCurrencies.includes(b.code);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });

  return (
    <div className={`min-h-screen p-4 font-sans relative overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-teal-50 to-white'
    }`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

        body {
          font-family: 'Outfit', sans-serif;
        }

        .bg-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .theme-dark .bg-glow { opacity: 0.3; }
        .theme-light .bg-glow { opacity: 0.15; }

        .glow-1 {
          background: radial-gradient(circle, #14b8a6 0%, transparent 70%);
          top: -200px;
          right: -200px;
        }

        .glow-2 {
          background: radial-gradient(circle, #0d9488 0%, transparent 70%);
          bottom: -200px;
          left: -200px;
        }

        .theme-dark .currency-row {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(13, 148, 136, 0.05) 100%);
          border: 1px solid rgba(20, 184, 166, 0.15);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
        .theme-dark .currency-row:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(13, 148, 136, 0.08) 100%);
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.2);
        }

        .theme-light .currency-row {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 253, 250, 0.6) 100%);
          border: 1px solid rgba(20, 184, 166, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .theme-light .currency-row:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 250, 0.8) 100%);
          border-color: rgba(20, 184, 166, 0.4);
          box-shadow: 0 4px 16px rgba(20, 184, 166, 0.12);
        }

        .currency-row {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .currency-input {
          background: transparent;
          border: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.25rem;
          font-weight: 600;
          text-align: right;
        }
        .theme-dark .currency-input { color: white; }
        .theme-light .currency-input { color: #0f172a; }

        .currency-input:focus {
          outline: none;
        }

        .theme-dark .calc-button {
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        .theme-dark .calc-button:hover {
          background: rgba(20, 184, 166, 0.2);
          border-color: rgba(20, 184, 166, 0.3);
        }
        .theme-light .calc-button {
          background: rgba(20, 184, 166, 0.08);
          border: 1px solid rgba(20, 184, 166, 0.15);
        }
        .theme-light .calc-button:hover {
          background: rgba(20, 184, 166, 0.15);
          border-color: rgba(20, 184, 166, 0.3);
        }

        .calc-button {
          transition: all 0.15s;
        }
        .calc-button:active {
          transform: scale(0.95);
        }

        .refresh-spin {
          animation: spin 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .teal-gradient-btn {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          box-shadow: 0 4px 20px rgba(20, 184, 166, 0.4);
        }

        .teal-gradient-btn:hover {
          box-shadow: 0 6px 30px rgba(20, 184, 166, 0.5);
        }

        .currency-picker-item {
          transition: all 0.2s;
        }

        .currency-picker-item:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className={`theme-${theme}`}>
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/50">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.title}
              </h1>
              <p className={`text-xs font-medium ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                {lastUpdate && lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleLang}
              className={`p-2 rounded-xl transition-all border text-xs font-bold ${
                isDark
                  ? 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/30 text-teal-300'
                  : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 text-teal-600'
              }`}
              title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all border ${
                isDark
                  ? 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/30 text-teal-300'
                  : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 text-teal-600'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowCurrencyPicker(true)}
              className={`p-2 rounded-xl transition-all border ${
                isDark
                  ? 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/30 text-teal-300'
                  : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 text-teal-600'
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={fetchRates}
              disabled={loading}
              className="p-2 teal-gradient-btn text-white rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'refresh-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Base Currency Selector */}
        <div className="mb-4">
          <select
            value={baseCurrency}
            onChange={(e) => {
              setBaseCurrency(e.target.value);
              setAmounts({});
            }}
            className={`w-full px-4 py-2.5 backdrop-blur-xl border text-sm rounded-xl focus:outline-none focus:border-teal-400 transition-colors ${
              isDark
                ? 'bg-black/40 border-teal-500/30 text-white'
                : 'bg-white/60 border-teal-500/20 text-slate-800'
            }`}
          >
            {allCurrencies.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.flag} {t.baseCurrency}: {curr.name} ({curr.code})
              </option>
            ))}
          </select>
        </div>

        {/* Currency Rows - Compact Layout */}
        <div className="space-y-2">
          {displayCurrencies.map((currency) => (
            <div
              key={currency.code}
              className="currency-row rounded-xl p-3 flex items-center gap-3"
            >
              {/* Pin / Flag and Code */}
              <div className="flex items-center gap-2 min-w-[100px]">
                <button
                  onClick={() => togglePin(currency.code)}
                  className="flex-shrink-0 p-0.5 transition-colors"
                >
                  <Star className={`w-3.5 h-3.5 ${
                    pinnedCurrencies.includes(currency.code)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-teal-600 hover:text-teal-400'
                  }`} />
                </button>
                <span className="text-2xl">{currency.flag}</span>
                <div className={`font-bold text-sm flex flex-col ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <span className="flex items-center gap-1.5">
                    {currency.code}
                    {/* 24h Change Badge for Crypto */}
                    {currency.isCrypto && cryptoChange24h[currency.code] !== undefined && (
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${
                        cryptoChange24h[currency.code] >= 0
                          ? 'text-emerald-400 bg-emerald-500/15'
                          : 'text-red-400 bg-red-500/15'
                      }`}>
                        {cryptoChange24h[currency.code] >= 0 ? '▲' : '▼'} {Math.abs(cryptoChange24h[currency.code]).toFixed(1)}%
                      </span>
                    )}
                  </span>
                  {/* Mobile-only Rate Display */}
                  {rates[currency.code] && currency.code !== baseCurrency && (
                    <span className={`text-[10px] font-mono sm:hidden ${isDark ? 'text-teal-400/80' : 'text-teal-600/70'}`}>
                      {rates[currency.code].toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-1 flex items-center justify-end gap-2 text-right">
                <span className="text-teal-500/60 text-sm font-mono flex-shrink-0">{currency.symbol}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amounts[currency.code] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      if (value === '') {
                        setAmounts({});
                      } else {
                        handleAmountChange(currency.code, value);
                      }
                    }
                  }}
                  placeholder="0.00"
                  className="currency-input flex-1 min-w-0 w-full"
                />
                <button
                  onClick={() => copyToClipboard(currency.code)}
                  className="p-1.5 hover:bg-teal-500/20 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar"
                >
                  {copiedCurrency === currency.code
                    ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                    : <Copy className="w-3.5 h-3.5 text-teal-500/50" />
                  }
                </button>
                <button
                  onClick={() => fetchHistory(currency.code)}
                  className="p-1.5 hover:bg-teal-500/20 rounded-lg transition-colors flex-shrink-0"
                  title={t.history}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-teal-500/50" />
                </button>
                <button
                  onClick={() => handleCalculatorClick(currency.code)}
                  className="p-1.5 hover:bg-teal-500/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <Calculator className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {/* Rate Badge - Desktop Only */}
              {rates[currency.code] && currency.code !== baseCurrency && (
                <div className={`text-xs font-mono min-w-[60px] text-right hidden sm:block ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>
                  {rates[currency.code].toFixed(4)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Currency Picker Modal */}
        {showCurrencyPicker && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
            <div className={`rounded-t-3xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col border ${
              isDark
                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-teal-500/30 shadow-teal-500/20'
                : 'bg-gradient-to-b from-white to-slate-50 border-teal-500/20 shadow-teal-500/10'
            }`}>
              <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-teal-500/20' : 'border-teal-200'}`}>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t.selectCurrencies}
                </h3>
                <button
                  onClick={() => setShowCurrencyPicker(false)}
                  className={`text-2xl font-light w-8 h-8 flex items-center justify-center ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-500'}`}
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {allCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => toggleCurrency(currency.code)}
                      className={`currency-picker-item w-full flex items-center justify-between p-4 rounded-xl transition-all ${selectedCurrencies.includes(currency.code)
                        ? isDark
                          ? 'bg-gradient-to-r from-teal-500/20 to-teal-600/20 border border-teal-500/40'
                          : 'bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-300'
                        : isDark
                          ? 'bg-black/20 border border-teal-500/10 hover:border-teal-500/20'
                          : 'bg-white/50 border border-slate-200 hover:border-teal-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currency.flag}</span>
                        <div className="text-left">
                          <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {currency.code}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>
                            {currency.name}
                          </div>
                        </div>
                      </div>
                      {selectedCurrencies.includes(currency.code) && (
                        <Check className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-4 border-t ${isDark ? 'border-teal-500/20' : 'border-teal-200'}`}>
                <button
                  onClick={() => setShowCurrencyPicker(false)}
                  className="w-full py-3 teal-gradient-btn text-white rounded-xl font-bold transition-all"
                >
                  {t.done} ({selectedCurrencies.length} {t.selected})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
            <div className={`rounded-t-3xl w-full max-w-md p-6 shadow-2xl border ${
              isDark
                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-teal-500/30 shadow-teal-500/20'
                : 'bg-gradient-to-b from-white to-slate-50 border-teal-500/20 shadow-teal-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold flex items-center gap-2 text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Calculator className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                  {t.calculator}
                </h3>
                <button
                  onClick={() => setShowCalculator(null)}
                  className={`text-2xl font-light w-8 h-8 flex items-center justify-center ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-500'}`}
                >
                  ✕
                </button>
              </div>

              <div className={`rounded-xl p-4 mb-4 border ${
                isDark ? 'bg-black/60 border-teal-500/20' : 'bg-slate-100 border-teal-200'
              }`}>
                <div className={`text-right text-3xl font-mono h-12 overflow-x-auto ${isDark ? 'text-teal-100' : 'text-slate-800'}`}>
                  {calculatorValue || '0'}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {calculatorButtons.flat().map((btn, idx) => (
                  btn && (
                    <button
                      key={idx}
                      onClick={() => handleCalculatorButton(btn)}
                      className={`calc-button py-4 rounded-xl font-bold text-lg ${
                        isDark ? 'text-white' : 'text-slate-700'
                      } ${['÷', '×', '-', '+', '='].includes(btn)
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-lg shadow-teal-500/30 !text-white'
                        : btn === 'C' || btn === '⌫'
                          ? 'bg-red-500/30 hover:bg-red-500/50 border-red-500/40 !text-white'
                          : ''
                        }`}
                    >
                      {btn}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={applyCalculatorValue}
                className="w-full py-3 teal-gradient-btn text-white rounded-xl font-bold transition-all text-lg"
              >
                {t.apply}
              </button>
            </div>
          </div>
        )}

        {/* Chart Modal */}
        {showChart && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
            <div className={`rounded-t-3xl w-full max-w-md p-6 shadow-2xl border ${
              isDark
                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-teal-500/30 shadow-teal-500/20'
                : 'bg-gradient-to-b from-white to-slate-50 border-teal-500/20 shadow-teal-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold flex items-center gap-2 text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <BarChart3 className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                  {(() => {
                    const curr = allCurrencies.find(c => c.code === showChart);
                    return curr ? `${curr.flag} ${showChart}` : showChart;
                  })()}
                  <span className={`text-sm font-normal ${isDark ? 'text-teal-400/60' : 'text-teal-600/50'}`}>
                    {t.history}
                  </span>
                </h3>
                <button
                  onClick={() => { setShowChart(null); setChartData(null); }}
                  className={`text-2xl font-light w-8 h-8 flex items-center justify-center ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-500'}`}
                >
                  ✕
                </button>
              </div>

              <div className={`rounded-xl p-4 border ${isDark ? 'bg-black/40 border-teal-500/15' : 'bg-slate-50 border-teal-200'}`}>
                {chartLoading && (
                  <div className={`text-center py-8 text-sm ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                    {t.loading}
                  </div>
                )}
                {!chartLoading && !chartData && (
                  <div className={`text-center py-8 text-sm ${isDark ? 'text-teal-400/60' : 'text-teal-600/50'}`}>
                    {t.noData}
                  </div>
                )}
                {!chartLoading && chartData && (
                  <div>
                    <div className="flex justify-center mb-3">
                      <Sparkline data={chartData.values} width={280} height={100} />
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between px-1">
                      {chartData.labels.map((label, i) => (
                        <span key={i} className={`text-[9px] font-mono ${isDark ? 'text-teal-400/50' : 'text-teal-600/40'}`}>
                          {label}
                        </span>
                      ))}
                    </div>
                    {/* Min/Max */}
                    <div className="flex justify-between mt-3 px-1">
                      <div>
                        <span className={`text-[10px] ${isDark ? 'text-teal-400/40' : 'text-teal-600/30'}`}>Min </span>
                        <span className={`text-xs font-mono font-semibold ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                          {Math.min(...chartData.values).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span className={`text-[10px] ${isDark ? 'text-teal-400/40' : 'text-teal-600/30'}`}>Max </span>
                        <span className={`text-xs font-mono font-semibold ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                          {Math.max(...chartData.values).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div>
                        <span className={`text-[10px] ${isDark ? 'text-teal-400/40' : 'text-teal-600/30'}`}>Δ </span>
                        <span className={`text-xs font-mono font-semibold ${
                          chartData.values[chartData.values.length-1] >= chartData.values[0] ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {((chartData.values[chartData.values.length-1] - chartData.values[0]) / chartData.values[0] * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className={`mt-6 text-center text-xs ${isDark ? 'text-teal-400/60' : 'text-teal-600/50'}`}>
          {t.lastUpdate}: {lastUpdate && lastUpdate.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}
        </div>
      </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
