# 💰 Currency Conversion Reference Guide

## Indian Rupee (₹) Implementation

### Quick Facts
- **Symbol**: ₹
- **Format**: ₹X,XX,XXX (Indian numbering: every 2 digits after first 3)
- **Locale**: en-IN
- **Decimal**: No decimals for whole amounts (2 decimals optional)

### Example Conversions

| Original USD | Converted INR | Display |
|---|---|---|
| $50,000 | ₹500,000 | ₹5,00,000 |
| $100,000 | ₹1,000,000 | ₹10,00,000 |
| $300,000 | ₹3,000,000 | ₹30,00,000 |
| $500,000 | ₹5,000,000 | ₹50,00,000 |
| $1,000 | ₹10,000 | ₹10,000 |

### Utility Functions

Located in: `src/utils/currencyFormatter.js`

#### 1. formatCurrency(amount)
```javascript
import { formatCurrency } from '../../utils/currencyFormatter';

// Usage
const amount = 500000;
const formatted = formatCurrency(amount);
// Returns: "₹5,00,000"
```

#### 2. formatCurrencyWithDecimals(amount, decimals)
```javascript
const amount = 500000.50;
const formatted = formatCurrencyWithDecimals(amount, 2);
// Returns: "₹5,00,000.50"
```

#### 3. parseCurrency(currencyString)
```javascript
const currencyStr = "₹5,00,000";
const amount = parseCurrency(currencyStr);
// Returns: 500000
```

---

## Updated Sample Data

### Loans (LoanContext.jsx)

**Loan 1 (L001):**
- Amount: ₹500,000 (₹5,00,000)
- Interest: 7.5%
- Tenure: 60 months
- Remaining: ₹300,000

**Loan 2 (L002):**
- Amount: ₹750,000 (₹7,50,000)
- Interest: 8.2%
- Tenure: 84 months
- Remaining: ₹650,000

**Loan 3 (L003):**
- Amount: ₹300,000 (₹3,00,000)
- Interest: 6.5%
- Tenure: 48 months
- Remaining: ₹0

### Loan Offers

- **Offer 1**: ₹100,000 - ₹1,000,000 @ 5.5% / 60 months
- **Offer 2**: ₹50,000 - ₹500,000 @ 6.8% / 72 months
- **Offer 3**: ₹200,000 - ₹2,000,000 @ 7.2% / 84 months

### Applications

- **App 1**: ₹500,000 - Approved
- **App 2**: ₹600,000 - Pending
- **App 3**: ₹400,000 - Pending

### Payments

- Payment amounts: ₹10,000 - ₹12,000 range
- EMI calculation based on rupee amounts
- All payment histories updated

---

## Formatted Display Examples

### In Stat Cards
```javascript
<StatCard
  title="Total Borrowed"
  value={formatCurrency(5000000)}
  icon="💰"
  color="success"
/>
// Displays: "₹50,00,000"
```

### In Tables
```jsx
<td>{formatCurrency(loan.amount)}</td>
// Displays: "₹5,00,000"
```

### In Calculations
```javascript
const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
// sum = 1550000

const display = formatCurrency(totalLoaned);
// Displays: "₹15,50,000"
```

---

## Localization Benefits

### Indian Number Format
- ✅ **Thousands separator every 2 digits** after first 3
  - 1,000 (one thousand)
  - 10,000 (ten thousand)
  - 1,00,000 (one lakh)
  - 10,00,000 (ten lakh)
  - 1,00,00,000 (one crore)

- ✅ **Automatic handling** via `Intl.NumberFormat('en-IN', ...)`
- ✅ **Proper currency symbol** (₹) in locale
- ✅ **Standard in India** for all financial institutions

---

## Chart Updates

### Analyst Dashboard Charts

**Loan Disbursement Chart:**
```javascript
datasets: [
  {
    label: 'Loan Disbursements (₹)',  // ← Added currency
    data: [120000, 190000, 150000, 250000, 220000, 300000],
    // All amounts converted to rupees (10x multiplier from original)
  }
]
```

---

## Backwards Compatibility

### To Revert to USD (if needed):
```javascript
// Option 1: Use simple dollar formatting
const formatUSD = (amount) => `$${amount.toLocaleString()}`;

// Option 2: Use Intl with USD
const formatUSD = (amount) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(amount);
```

---

## Testing Checklist

- ✅ All dashboards display amounts in ₹
- ✅ Rupee symbol (₹) appears correctly
- ✅ Indian number formatting works (X,XX,XXX)
- ✅ Calculations use rupee amounts
- ✅ Charts display with ₹ legend
- ✅ Mobile view displays correctly
- ✅ Copy-paste values work properly
- ✅ No decimal places for whole amounts
- ✅ Responsive on all screen sizes

---

## Files Modified for Currency

1. `/src/utils/currencyFormatter.js` - NEW utility file
2. `/src/context/LoanContext.jsx` - Sample data updated
3. `/src/pages/lender/LenderDashboard.jsx` - Uses formatCurrency()
4. `/src/pages/borrower/BorrowerDashboard.jsx` - Uses formatCurrency()
5. `/src/pages/analyst/AnalystDashboard.jsx` - Uses formatCurrency()

---

## Performance Notes

- 🚀 **Zero performance impact** - formatting happens at display time
- 💾 **Data stored as numbers** - no string conversion
- 🔄 **Easy to switch** - one function change switches currency
- 📱 **Mobile optimized** - efficient formatting algorithm

---

## Indian Market Alignment

Your app now uses:
- ✅ Rupee currency (₹)
- ✅ Indian number formatting
- ✅ Realistic Indian loan amounts
- ✅ Professional financial display

**Perfect for:** Indian fintech, NBFC applications, Indian banking sectors
