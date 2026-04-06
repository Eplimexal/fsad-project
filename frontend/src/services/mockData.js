export const MOCK_USERS = [
  { id: 'U-ADMIN', name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'password123' },
  { id: 'U-LENDER', name: 'John Doe', email: 'lender@example.com', role: 'lender', password: 'password123' },
  { id: 'U-BORROWER', name: 'Jane Smith', email: 'borrower@example.com', role: 'borrower', password: 'password123' },
  { id: 'U-ANALYST', name: 'Finance Analyst', email: 'analyst@example.com', role: 'analyst', password: 'password123' },
];

export const MOCK_OFFERS = [
  {
    id: 'O001',
    lenderId: 'U-LENDER',
    lenderName: 'John Doe',
    minAmount: 100000,
    maxAmount: 1000000,
    interestRate: 5.5,
    tenure: 60,
    status: 'active',
    createdAt: '2024-01-01',
  },
];

export const MOCK_APPLICATIONS = [
  {
    id: 'APP001',
    borrowerId: 'U-BORROWER',
    borrowerName: 'Jane Smith',
    loanAmount: 250000,
    interestRate: 7.2,
    tenure: 48,
    status: 'pending',
    purpose: 'Business expansion',
    appliedAt: '2024-03-01',
  },
];

export const MOCK_LOANS = [];
