# Currency Converter App - Project Guide for Claude AI

## Project Overview

This is a modern, real-time currency converter web application built with React and Vite. The app provides instant currency conversion between 20+ global currencies with an integrated calculator and a sleek, responsive UI featuring a teal/turquoise color scheme.

**Primary Language:** Spanish (UI and documentation)
**Type:** Single-page application (SPA)
**Main File:** `src/App.jsx` (458 lines) - Contains the entire application logic

## Key Features

- **Real-time Exchange Rates**: Fetches live currency rates from ExchangeRate-API and CoinCap API
- **20+ Currencies**: Including COP, USD, EUR, HNL, MXN, GBP, JPY, CNY, and more
- **Cryptocurrencies**: Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) support
- **Integrated Calculator**: Built-in calculator for each currency input
- **Currency Selection**: Users can customize which currencies to display
- **Auto-conversion**: Real-time conversion across all selected currencies (fiat and crypto)
- **Modern UI**: Gradient backgrounds, glassmorphism effects, custom animations
- **Responsive Design**: Mobile-first approach with TailwindCSS

## Technology Stack

### Core
- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server (fast HMR)
- **JavaScript (ESM)** - No TypeScript

### Styling
- **TailwindCSS 3.4.0** - Utility-first CSS framework
- **Custom CSS** - Inline styles in App.jsx for animations and effects
- **Google Fonts** - Outfit (UI), JetBrains Mono (numbers)

### Dependencies
- **lucide-react 0.294.0** - Icon library (RefreshCw, TrendingUp, Calculator, Plus, Check, X)

### DevOps
- **Docker** - Containerized deployment with Nginx
- **Docker Compose** - Local orchestration
- **Nginx** - Production web server

## Project Structure

```
currency-converter-app/
├── src/
│   ├── App.jsx           # Main component (all logic here)
│   ├── main.jsx          # React entry point
│   └── index.css         # Global Tailwind imports
├── public/               # Static assets
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Docker Compose config
├── nginx.conf            # Nginx server config
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS config
├── DEPLOYMENT.md         # Deployment guide
├── GIT_COMMANDS.md       # Git workflow reference
└── README.md             # User-facing documentation
```

## Component Architecture

### Single Component Design
The entire application is contained in one React component: `CurrencyConverter` in `src/App.jsx`. This is intentional for simplicity.

### State Management (useState)

```javascript
const [rates, setRates] = useState({})                    // Exchange rates object
const [baseCurrency, setBaseCurrency] = useState('USD')   // Selected base currency
const [amounts, setAmounts] = useState({})                // Currency amounts object
const [loading, setLoading] = useState(true)              // Loading state
const [lastUpdate, setLastUpdate] = useState(null)        // Last fetch timestamp
const [showCalculator, setShowCalculator] = useState(null) // Calculator modal currency
const [calculatorValue, setCalculatorValue] = useState('') // Calculator display
const [showCurrencyPicker, setShowCurrencyPicker] = useState(false) // Picker modal
const [selectedCurrencies, setSelectedCurrencies] = useState(['USD', 'COP', 'EUR', 'HNL', 'MXN'])
```

### Key Functions

1. **`fetchRates()`** (lines 38-49)
   - Fetches exchange rates from `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
   - Updates `rates` state and `lastUpdate` timestamp
   - Called on mount and when base currency changes

2. **`handleAmountChange(currency, value)`** (lines 55-77)
   - Converts input amount to all other currencies
   - Calculates conversions relative to base currency
   - Updates `amounts` state object

3. **`handleCalculatorButton(value)`** (lines 84-100)
   - Handles calculator input (numbers, operators, clear, backspace)
   - Uses `eval()` for calculation (⚠️ safe here since input is controlled)
   - Supports: +, -, ×, ÷, =, C (clear), ⌫ (backspace)

4. **`toggleCurrency(code)`** (lines 109-117)
   - Adds/removes currencies from `selectedCurrencies`
   - Prevents removing last currency (minimum 1)

## API Integration

### Fiat Exchange Rate API
- **Endpoint**: `https://api.exchangerate-api.com/v4/latest/USD`
- **Method**: GET
- **No Auth Required**: Free tier, no API key needed
- **Purpose**: Fetches all fiat currency exchange rates relative to USD
- **Response Format**:
```json
{
  "rates": {
    "USD": 1,
    "COP": 4234.56,
    "EUR": 0.85,
    ...
  }
}
```

### CoinCap Cryptocurrency API
- **Endpoint**: `https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana`
- **Method**: GET
- **No Auth Required**: Free tier (30 calls/min, 10k/month)
- **Purpose**: Fetches real-time cryptocurrency prices in USD
- **Response Format**:
```json
{
  "data": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "priceUsd": "43250.5234"
    },
    ...
  ]
}
```

### Rate Calculation Logic
All conversions are normalized through the base currency:
```javascript
baseAmount = inputAmount / rates[inputCurrency]
convertedAmount = baseAmount * rates[targetCurrency]
```

### Cryptocurrency Integration
- Crypto codes (BTC, ETH, SOL) are mapped to CoinCap IDs (bitcoin, ethereum, solana)
- Crypto prices are fetched in USD and combined with fiat rates
- Supports using crypto as base currency for conversions
- Crypto values display 6-8 decimals (vs 2 for fiat) for precision

## Styling & Design System

### Color Palette
- **Primary**: Teal/Turquoise (`#14b8a6`, `#0d9488`)
- **Background**: Slate dark gradients (`slate-950`, `teal-950`, `slate-900`)
- **Text**: White, teal-300, teal-400
- **Effects**: Glassmorphism, backdrop blur, gradient glows

### Custom Animations
- **Refresh spin**: 0.6s rotation on refresh button
- **Hover effects**: Transform, shadow, border color transitions
- **Background glows**: Fixed position radial gradients with blur

### Responsive Breakpoints
TailwindCSS defaults:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start production preview on port 3000
npm start
```

## Docker Commands

```bash
# Build image
docker build -t currency-converter .

# Run container
docker run -p 80:80 currency-converter

# Docker Compose
docker-compose up -d
docker-compose down
```

## Common Tasks for Claude

### Adding a New Fiat Currency
1. Add entry to `allCurrencies` array (lines 5-29)
2. Include: `{ code: 'XXX', name: 'Currency Name', flag: '🏳️' }`
3. ExchangeRate-API automatically supports most ISO currency codes

### Adding a New Cryptocurrency
1. Add entry to `allCurrencies` array with `isCrypto: true` flag
   - Example: `{ code: 'ADA', name: 'Cardano', flag: '₳', isCrypto: true }`
2. Update `cryptoMap` object in `fetchRates()` function (lines 45-49)
   - Map the crypto code to its CoinCap ID
   - Example: `'ADA': 'cardano'`
3. CoinCap API supports 2000+ cryptocurrencies
4. Find CoinCap IDs at: https://api.coincap.io/v2/assets

### Modifying Calculator
1. Update `calculatorButtons` array (lines 119-125)
2. Modify `handleCalculatorButton()` logic (lines 84-100)

### Changing Color Scheme
1. Update inline `<style>` tag (lines 131-230)
2. Replace teal colors (`#14b8a6`, `#0d9488`) throughout
3. Update TailwindCSS classes (teal-*) in JSX

### Adding New API Provider
1. Modify `fetchRates()` function (lines 38-49)
2. Update API URL and response parsing
3. Ensure rate object structure matches: `{ USD: 1, EUR: 0.85, ... }`

### Extracting Components
If refactoring to separate components:
- `CurrencyRow` - Individual currency input row
- `Calculator` - Calculator modal
- `CurrencyPicker` - Currency selection modal
- `Header` - App header with refresh button

## Build & Deployment

### Production Build
1. Vite builds to `dist/` folder
2. Static files served by Nginx in Docker
3. Multi-stage Docker build keeps image small

### Environment
- **Dev Server**: Vite dev server with HMR
- **Production**: Nginx serving static files
- **Port**: 80 (Docker), 5173 (dev), 3000 (preview)

### Deployment Targets
- **Dokploy**: GitHub integration or Docker registry
- **Docker Hub**: Push built image
- **Any static host**: Vercel, Netlify, GitHub Pages (build `dist/`)

## Code Style & Conventions

- **Single quotes** for strings
- **Arrow functions** preferred
- **Template literals** for string interpolation
- **Inline styles** in `<style>` tag for component-specific CSS
- **TailwindCSS** for layout and utilities
- **Spanish** variable names and UI text

## Known Patterns

1. **Controlled Inputs**: All inputs use `value={amounts[currency.code] || ''}`
2. **Modal Pattern**: Fixed overlay + centered content with backdrop blur
3. **Loading States**: `disabled={loading}` on buttons during fetch
4. **Input Validation**: Regex `/^\d*\.?\d*$/` for decimal numbers

## Potential Improvements

When asked to enhance the app, consider:
- Add more cryptocurrencies (Cardano, Ripple, Litecoin, etc.)
- Currency favorites/pinning
- Local storage for selected currencies
- Historical rate charts for crypto
- Offline support with cached rates
- Currency symbols (€, $, £, ¥)
- Dark/light mode toggle
- Multi-language support
- Rate alerts/notifications for crypto price changes
- Copy to clipboard feature
- Display 24h price change percentage for cryptos
- Market cap and volume information

## Security Notes

- **eval() usage**: Used in calculator (line 91) - safe because input is controlled and sanitized
- **No sensitive data**: No API keys, user data, or authentication
- **HTTPS API**: ExchangeRate-API uses HTTPS

## Testing Checklist

When making changes, verify:
- [ ] Currency conversion calculations are accurate
- [ ] Base currency switching works correctly
- [ ] Calculator performs all operations (+, -, ×, ÷)
- [ ] Currency picker can add/remove currencies
- [ ] Refresh button updates rates
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Docker image builds and runs

## Questions to Ask User

When unclear about requirements:
- Which currency should be default?
- Should historical data be stored?
- Is offline mode needed?
- What decimal precision for conversions?
- Should there be a maximum number of currencies displayed?

---

## Changelog

### 2026-01-18 - Cryptocurrency Support
- Added Bitcoin (BTC), Ethereum (ETH), and Solana (SOL)
- Integrated CoinCap API for real-time crypto prices
- Modified fetchRates() to combine fiat and crypto data
- Updated decimal precision for crypto values (6-8 decimals)
- Changed default selected currencies to include BTC and ETH

**Last Updated**: 2026-01-18
**Maintained By**: Yoany Andrés
**For**: Claude AI Assistant
