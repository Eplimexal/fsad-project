import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');
const defaultPasswordHash = bcrypt.hashSync('password123', 10);

const seedData = {
  users: [
    { id: 'U-ADMIN', name: 'Admin User', email: 'admin@example.com', role: 'admin', passwordHash: defaultPasswordHash },
    { id: 'U-LENDER', name: 'John Doe', email: 'lender@example.com', role: 'lender', passwordHash: defaultPasswordHash },
    { id: 'U-BORROWER', name: 'Jane Smith', email: 'borrower@example.com', role: 'borrower', passwordHash: defaultPasswordHash },
    { id: 'U-ANALYST', name: 'Finance Analyst', email: 'analyst@example.com', role: 'analyst', passwordHash: defaultPasswordHash }
  ],
  loanOffers: [
    { id: 'O001', lenderId: 'U-LENDER', lenderName: 'John Doe', minAmount: 100000, maxAmount: 1000000, interestRate: 5.5, tenure: 60, status: 'active', createdAt: '2024-01-01' }
  ],
  applications: [
    { id: 'APP001', borrowerId: 'U-BORROWER', borrowerName: 'Jane Smith', loanAmount: 250000, interestRate: 7.2, tenure: 48, status: 'pending', purpose: 'Business expansion', appliedAt: '2024-03-01' }
  ],
  loans: [],
  payments: []
};

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));
}

export const readDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
export const writeDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
