# LoanHub Backend API Setup Guide

## Overview

This guide helps you set up a Node.js/Express backend API for the LoanHub loan management system.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB or PostgreSQL
- Postman (for API testing)

## Initial Setup

### 1. Create Backend Directory

```bash
# From the project root
mkdir server
cd server
npm init -y
```

### 2. Install Dependencies

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken axios
npm install --save-dev nodemon
```

### 3. Create Project Structure

```
server/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Loan.js
│   ├── Application.js
│   ├── Payment.js
│   └── index.js
├── routes/
│   ├── auth.js
│   ├── loans.js
│   ├── applications.js
│   ├── payments.js
│   ├── analytics.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── controllers/
│   ├── authController.js
│   ├── loanController.js
│   ├── applicationController.js
│   ├── paymentController.js
│   └── analyticsController.js
├── .env
├── .env.example
├── .gitignore
├── server.js
└── package.json
```

### 4. Create .env File

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/loanhub
# Or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/loanhub

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Server Implementation

### 1. Main Server File (server.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. Database Configuration (config/database.js)

```javascript
// For MongoDB
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loanhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
```

### 3. User Model (models/User.js)

```javascript
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'lender', 'borrower', 'analyst'],
    default: 'borrower'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 4. Loan Model (models/Loan.js)

```javascript
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  tenure: {
    type: Number, // in months
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'defaulted', 'pending'],
    default: 'active'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  remainingAmount: Number,
  totalInterest: Number,
  payments: [{
    date: Date,
    amount: Number,
    status: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);
```

### 5. Application Model (models/Application.js)

```javascript
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowerName: String,
  loanAmount: {
    type: Number,
    required: true
  },
  interestRate: Number,
  tenure: Number,
  purpose: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: String
});

module.exports = mongoose.model('Application', applicationSchema);
```

### 6. Payment Model (models/Payment.js)

```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  method: {
    type: String,
    enum: ['bank_transfer', 'card', 'check', 'other'],
    default: 'bank_transfer'
  },
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
```

## API Routes Implementation

### Authentication Routes (routes/auth.js)

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    user = new User({ name, email, password, role });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Loan Routes (routes/loans.js)

```javascript
const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const { authenticate } = require('../middleware/auth');

// Get all loans (admin/analyst)
router.get('/', authenticate, async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('borrowerId', 'name email')
      .populate('lenderId', 'name email');
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get borrower's loans
router.get('/borrower/:borrowerId', authenticate, async (req, res) => {
  try {
    const loans = await Loan.find({ borrowerId: req.params.borrowerId })
      .populate('lenderId', 'name email');
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create loan (from approved application)
router.post('/', authenticate, async (req, res) => {
  try {
    const { borrowerId, lenderId, amount, interestRate, tenure } = req.body;
    
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + parseInt(tenure));
    
    const totalInterest = (amount * interestRate * tenure) / (12 * 100);
    
    const loan = new Loan({
      borrowerId,
      lenderId,
      amount,
      interestRate,
      tenure,
      dueDate,
      remainingAmount: amount,
      totalInterest
    });
    
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Running the Backend

### Update package.json scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Run the server:

```bash
npm run dev
```

## Connecting Frontend to Backend

Update your API calls in `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

## Testing API Endpoints

Use Postman or curl:

```bash
# Test health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "lender"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Additional Configuration

### Add Validation
Install `joi` for input validation:
```bash
npm install joi
```

### Add Request Logging
Install `morgan`:
```bash
npm install morgan
```

### Database Migrations
For PostgreSQL, use `knex` and `db-migrate`

## Deployment

### Heroku
1. Create `Procfile`
2. Set environment variables
3. Deploy with `git push heroku main`

### Docker
Create `Dockerfile` and `docker-compose.yml`

## Next Steps

1. Implement all route handlers
2. Add comprehensive error handling
3. Add input validation
4. Implement rate limiting
5. Add logging and monitoring
6. Set up CI/CD pipeline
7. Add unit and integration tests

---

For more details, refer to the main README.md
