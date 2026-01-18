import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Calculator, Plus, Check, X } from 'lucide-react';

const CurrencyConverter = () => {
  const allCurrencies = [
    { code: 'USD', name: 'Dólar estadounidense', flag: '🇺🇸' },
    { code: 'COP', name: 'Peso colombiano', flag: '🇨🇴' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'HNL', name: 'Lempira hondureña', flag: '🇭🇳' },
    { code: 'MXN', name: 'Peso mexicano', flag: '🇲🇽' },
    { code: 'GBP', name: 'Libra esterlina', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yen japonés', flag: '🇯🇵' },
    { code: 'CNY', name: 'Yuan chino', flag: '🇨🇳' },
    { code: 'CAD', name: 'Dólar canadiense', flag: '🇨🇦' },
    { code: 'AUD', name: 'Dólar australiano', flag: '🇦🇺' },
    { code: 'CHF', name: 'Franco suizo', flag: '🇨🇭' },
    { code: 'BRL', name: 'Real brasileño', flag: '🇧🇷' },
    { code: 'ARS', name: 'Peso argentino', flag: '🇦🇷' },
    { code: 'CLP', name: 'Peso chileno', flag: '🇨🇱' },
    { code: 'PEN', name: 'Sol peruano', flag: '🇵🇪' },
    { code: 'INR', name: 'Rupia india', flag: '🇮🇳' },
    { code: 'KRW', name: 'Won surcoreano', flag: '🇰🇷' },
    { code: 'TRY', name: 'Lira turca', flag: '🇹🇷' },
    { code: 'RUB', name: 'Rublo ruso', flag: '🇷🇺' },
    { code: 'SEK', name: 'Corona sueca', flag: '🇸🇪' }
  ];

  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showCalculator, setShowCalculator] = useState(null);
  const [calculatorValue, setCalculatorValue] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'COP', 'EUR', 'HNL', 'MXN']);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      const data = await response.json();
      setRates(data.rates);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching rates:', error);
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
        newAmounts[curr.code] = convertedValue.toFixed(2);
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
    if (selectedCurrencies.includes(code)) {
      if (selectedCurrencies.length > 1) {
        setSelectedCurrencies(selectedCurrencies.filter(c => c !== code));
      }
    } else {
      setSelectedCurrencies([...selectedCurrencies, code]);
    }
  };

  const calculatorButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['C', '⌫', '', '']
  ];

  const displayCurrencies = allCurrencies.filter(c => selectedCurrencies.includes(c.code));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-4 font-sans relative overflow-hidden">
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
          opacity: 0.3;
          pointer-events: none;
        }
        
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
        
        .currency-row {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(13, 148, 136, 0.05) 100%);
          border: 1px solid rgba(20, 184, 166, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
        
        .currency-row:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(13, 148, 136, 0.08) 100%);
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.2);
        }
        
        .currency-input {
          background: transparent;
          border: none;
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.25rem;
          font-weight: 600;
          text-align: right;
        }
        
        .currency-input:focus {
          outline: none;
        }
        
        .calc-button {
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
          transition: all 0.15s;
        }
        
        .calc-button:hover {
          background: rgba(20, 184, 166, 0.2);
          border-color: rgba(20, 184, 166, 0.3);
        }
        
        .calc-button:active {
          transform: scale(0.95);
          background: rgba(20, 184, 166, 0.25);
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
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Conversor
              </h1>
              <p className="text-teal-400 text-xs font-medium">
                {lastUpdate && lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowCurrencyPicker(true)}
              className="p-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 rounded-xl transition-all"
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
            className="w-full px-4 py-2.5 bg-black/40 backdrop-blur-xl border border-teal-500/30 text-white text-sm rounded-xl focus:outline-none focus:border-teal-400 transition-colors"
          >
            {allCurrencies.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.flag} Moneda base: {curr.name} ({curr.code})
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
              {/* Flag and Code */}
              <div className="flex items-center gap-2 min-w-[80px]">
                <span className="text-2xl">{currency.flag}</span>
                <div className="text-white font-bold text-sm">
                  {currency.code}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-1 flex items-center justify-end gap-2">
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
                  className="currency-input flex-1 min-w-0"
                />
                <button
                  onClick={() => handleCalculatorClick(currency.code)}
                  className="p-1.5 hover:bg-teal-500/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <Calculator className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {/* Rate Badge - Only show if not base currency */}
              {rates[currency.code] && currency.code !== baseCurrency && (
                <div className="text-xs text-teal-300 font-mono min-w-[60px] text-right">
                  {rates[currency.code].toFixed(4)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Currency Picker Modal */}
        {showCurrencyPicker && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-teal-500/30 rounded-t-3xl w-full max-w-md shadow-2xl shadow-teal-500/20 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-teal-500/20">
                <h3 className="text-white font-bold text-lg">
                  Seleccionar divisas
                </h3>
                <button
                  onClick={() => setShowCurrencyPicker(false)}
                  className="text-teal-400 hover:text-teal-300 text-2xl font-light w-8 h-8 flex items-center justify-center"
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
                      className={`currency-picker-item w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                        selectedCurrencies.includes(currency.code)
                          ? 'bg-gradient-to-r from-teal-500/20 to-teal-600/20 border border-teal-500/40'
                          : 'bg-black/20 border border-teal-500/10 hover:border-teal-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currency.flag}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold text-sm">
                            {currency.code}
                          </div>
                          <div className="text-teal-300 text-xs">
                            {currency.name}
                          </div>
                        </div>
                      </div>
                      {selectedCurrencies.includes(currency.code) && (
                        <Check className="w-5 h-5 text-teal-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-teal-500/20">
                <button
                  onClick={() => setShowCurrencyPicker(false)}
                  className="w-full py-3 teal-gradient-btn text-white rounded-xl font-bold transition-all"
                >
                  Listo ({selectedCurrencies.length} seleccionadas)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-teal-500/30 rounded-t-3xl w-full max-w-md p-6 shadow-2xl shadow-teal-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                  <Calculator className="w-5 h-5 text-teal-400" />
                  Calculadora
                </h3>
                <button
                  onClick={() => setShowCalculator(null)}
                  className="text-teal-400 hover:text-teal-300 text-2xl font-light w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="bg-black/60 border border-teal-500/20 rounded-xl p-4 mb-4">
                <div className="text-right text-3xl text-teal-100 font-mono h-12 overflow-x-auto">
                  {calculatorValue || '0'}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {calculatorButtons.flat().map((btn, idx) => (
                  btn && (
                    <button
                      key={idx}
                      onClick={() => handleCalculatorButton(btn)}
                      className={`calc-button py-4 rounded-xl text-white font-bold text-lg ${
                        ['÷', '×', '-', '+', '='].includes(btn) 
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-lg shadow-teal-500/30' 
                          : btn === 'C' || btn === '⌫'
                          ? 'bg-red-500/30 hover:bg-red-500/50 border-red-500/40'
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
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-teal-400/60">
          Última actualización: {lastUpdate && lastUpdate.toLocaleString('es-ES')}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
