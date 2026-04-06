import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from './data/store.js';
import { requireAuth, requireRole, signToken } from './middleware/auth.js';

const app = express();
const PORT = globalThis.process?.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const sanitizeUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'borrower' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const db = readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const user = {
    id: uuidv4(),
    name,
    email,
    role,
    passwordHash: await bcrypt.hash(password, 10),
  };

  db.users.push(user);
  writeDb(db);

  const safeUser = sanitizeUser(user);
  return res.status(201).json({ user: safeUser, token: signToken(safeUser) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password || '', user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (role && role !== user.role) {
    return res.status(403).json({ message: 'Selected role does not match your account role' });
  }

  const safeUser = sanitizeUser(user);
  return res.json({ user: safeUser, token: signToken(safeUser) });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(req.user);
});

app.get('/api/loans', requireAuth, (req, res) => {
  const db = readDb();
  res.json(db.loans);
});

app.get('/api/offers', requireAuth, (_req, res) => {
  const db = readDb();
  res.json(db.loanOffers);
});

app.post('/api/offers', requireAuth, requireRole('lender', 'admin'), (req, res) => {
  const db = readDb();
  const offer = {
    id: `O-${Date.now()}`,
    ...req.body,
    minAmount: Number(req.body.minAmount),
    maxAmount: Number(req.body.maxAmount),
    interestRate: Number(req.body.interestRate),
    tenure: Number(req.body.tenure),
    createdAt: new Date().toISOString(),
  };
  db.loanOffers.push(offer);
  writeDb(db);
  res.status(201).json(offer);
});

app.get('/api/applications', requireAuth, (_req, res) => {
  const db = readDb();
  res.json(db.applications);
});

app.post('/api/applications', requireAuth, requireRole('borrower', 'admin'), (req, res) => {
  const db = readDb();
  const application = {
    id: `APP-${Date.now()}`,
    ...req.body,
    loanAmount: Number(req.body.loanAmount),
    interestRate: Number(req.body.interestRate),
    tenure: Number(req.body.tenure),
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };
  db.applications.push(application);
  writeDb(db);
  res.status(201).json(application);
});

app.put('/api/applications/:id/approve', requireAuth, requireRole('lender', 'admin'), (req, res) => {
  const db = readDb();
  const appIndex = db.applications.findIndex((item) => item.id === req.params.id);
  if (appIndex < 0) return res.status(404).json({ message: 'Application not found' });

  db.applications[appIndex].status = 'approved';
  db.applications[appIndex].lenderId = req.user.id;

  const loan = {
    id: `L-${Date.now()}`,
    borrowerId: db.applications[appIndex].borrowerId,
    lenderId: req.user.id,
    amount: db.applications[appIndex].loanAmount,
    interestRate: db.applications[appIndex].interestRate,
    tenure: db.applications[appIndex].tenure,
    status: 'active',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + db.applications[appIndex].tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    remainingAmount: db.applications[appIndex].loanAmount,
    payments: [],
  };

  db.loans.push(loan);
  writeDb(db);
  res.json({ application: db.applications[appIndex], loan });
});

app.put('/api/applications/:id/reject', requireAuth, requireRole('lender', 'admin'), (req, res) => {
  const db = readDb();
  const appIndex = db.applications.findIndex((item) => item.id === req.params.id);
  if (appIndex < 0) return res.status(404).json({ message: 'Application not found' });

  db.applications[appIndex].status = 'rejected';
  writeDb(db);
  res.json(db.applications[appIndex]);
});

app.post('/api/loans/:id/payments', requireAuth, requireRole('borrower', 'admin'), (req, res) => {
  const db = readDb();
  const loanIndex = db.loans.findIndex((item) => item.id === req.params.id);
  if (loanIndex < 0) return res.status(404).json({ message: 'Loan not found' });

  const payment = {
    id: req.body.id || `P-${Date.now()}`,
    amount: Number(req.body.amount),
    date: req.body.date || new Date().toISOString().split('T')[0],
    status: req.body.status || 'completed',
  };

  db.loans[loanIndex].payments.push(payment);
  db.loans[loanIndex].remainingAmount = Math.max(0, db.loans[loanIndex].remainingAmount - payment.amount);
  if (db.loans[loanIndex].remainingAmount === 0) {
    db.loans[loanIndex].status = 'completed';
  }

  writeDb(db);
  res.status(201).json(db.loans[loanIndex]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
