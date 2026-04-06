/**
 * Format currency to Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with ₹ symbol
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency with decimal places
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string with ₹ symbol
 */
export const formatCurrencyWithDecimals = (amount, decimals = 2) => {
  if (!amount && amount !== 0) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Parse currency string back to number
 * @param {string} currencyString - The formatted currency string
 * @returns {number} The numeric value
 */
export const parseCurrency = (currencyString) => {
  return parseInt(currencyString.replace(/₹|,/g, ''), 10);
};
