# LoanHub - Loan Issuance Management System

A comprehensive web application for managing the loan issuance process, including loan tracking, payment management, interest calculation, and transaction records. Built with React and Node.js.

## Features

### 👤 User Roles

1. **Admin**
   - Oversee platform operations
   - Manage user accounts (create, activate, deactivate)
   - Monitor system security and settings
   - View system reports and analytics

2. **Lender**
   - Create and manage loan offers
   - Review and approve loan applications
   - Track payments from borrowers
   - Manage active loans and borrower interactions

3. **Borrower**
   - Browse available loan offers
   - Submit loan applications
   - Track payment schedules
   - Make loan payments
   - View loan details and remaining balance

4. **Financial Analyst**
   - Analyze loan performance data
   - Assess credit risk
   - Generate financial reports
   - Monitor loan disbursement trends
   - Track default rates and risk metrics

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Chart.js & React-Chartjs-2** - Data visualization
- **CSS3** - Styling with custom design system

### Backend (Recommended Setup)
- **Node.js & Express** - REST API server
- **MongoDB or PostgreSQL** - Database
- **JWT** - Authentication
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "c:\Users\%USERNAME%\Documents\USER_NAME\Files\FSAD\project 15"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Header, Sidebar, Page layouts
│   └── styles.css      # Component styles
├── context/            # React Context for state management
│   ├── AuthContext.jsx # Authentication context
│   └── LoanContext.jsx # Loan data context
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── admin/          # Admin dashboard
│   ├── lender/         # Lender dashboard
│   ├── borrower/       # Borrower dashboard
│   └── analyst/        # Analyst dashboard
├── services/           # API service utilities
├── styles/             # Global styles
└── App.jsx            # Main app component with routing
```

## Usage

### Logging In

1. Navigate to the login page
2. Enter credentials:
   - **Email**: Any valid email
   - **Password**: Any password (mock auth)
   - **Role**: Select your role (Admin, Lender, Borrower, or Analyst)
3. Click "Login" to access your dashboard

### Demo Credentials

- **Admin**: admin@example.com
- **Lender**: lender@example.com
- **Borrower**: borrower@example.com
- **Analyst**: analyst@example.com

Password: `password123` (seeded backend accounts)

## Features by Role

### Admin Dashboard
- View total users and active user count
- User management (add, activate, deactivate)
- Security settings configuration
- System reports and monitoring
- User role distribution analytics

### Lender Dashboard
- Create loan offers with custom terms
- View pending, approved, and rejected applications
- Approve or reject loan applications
- Track active loans
- Monitor payment history

### Borrower Dashboard
- Browse available loan offers
- Submit loan applications
- View application status
- Track active loans and remaining balance
- Make payments
- View payment history

### Analyst Dashboard
- Loan performance metrics and trends
- Risk assessment and categorization
- Financial reports (monthly, quarterly)
- Loan disbursement trends
- Default rate monitoring
- Borrower credit analysis


## Backend Setup (Implemented)

The project now includes a Node.js + Express backend in the `backend/` directory with JWT auth and role-based APIs.

```bash
cd backend
npm install
npm run dev
```

Set optional frontend API URL in `.env`:
```bash
VITE_API_URL=http://localhost:4000/api
```

> If backend is not running, the app automatically falls back to offline demo mode for login/register and core loan workflows.

## API Endpoints (Backend)

### Authentication
```
POST /api/auth/login           - User login
POST /api/auth/register        - User registration
POST /api/auth/logout          - User logout
```

### Loans
```
GET  /api/loans                - Get all loans
GET  /api/loans/:id            - Get loan details
POST /api/loans                - Create new loan
PUT  /api/loans/:id            - Update loan
```

### Applications
```
GET  /api/applications         - Get all applications
POST /api/applications         - Create application
PUT  /api/applications/:id     - Update application status
```

### Payments
```
GET  /api/payments             - Get all payments
POST /api/payments             - Record payment
GET  /api/payments/:loanId     - Get loan payments
```

### Analytics
```
GET  /api/analytics/dashboard  - Dashboard metrics
GET  /api/analytics/risk       - Risk assessment data
GET  /api/analytics/reports    - Financial reports
```

## Key Features

### 1. Loan Management
- Create and manage loan offers
- Track loan status (active, closed, defaulted)
- Calculate remaining balances
- Monitor loan tenure and due dates

### 2. Payment Tracking
- Record payments with date and status
- Track payment history per loan
- Calculate outstanding amounts
- Monitor payment schedule compliance

### 3. Interest Calculation
- Automatic interest rate application
- Calculate total interest for loan terms
- Monthly/quarterly payment calculations
- Interest accrual tracking

### 4. Risk Assessment
- Categorize loans by risk level (Low, Medium, High)
- Track default rates
- Monitor payment compliance
- Generate risk reports

### 5. Analytics & Reporting
- Loan disbursement trends
- Interest income analysis
- Borrower performance metrics
- Risk distribution charts

## Authentication Flow

1. User enters credentials on login/register page
2. Credentials validated (currently mocked)
3. User data stored in localStorage
4. AuthContext provides user info to entire app
5. Protected routes check authentication status
6. Unauthorized access redirects to login

## State Management

### AuthContext
- Manages user authentication state
- Provides login/logout/register functions
- Persists user data in localStorage

### LoanContext
- Manages loan data
- Provides CRUD operations for loans
- Handles application approval/rejection
- Manages payment recording

## Styling

Custom CSS with design system:
- **Color Scheme**: Blue (#2563eb) primary, slate secondary
- **Responsive Design**: Mobile-first approach
- **Components**: Cards, buttons, forms, badges, modals
- **Spacing**: 8px base unit for consistency

## Performance Optimizations

- React Router for client-side navigation
- Context API for efficient state management
- CSS-in-JS optimization
- Lazy loading ready (can be enhanced)
- Chart.js for efficient data visualization

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
# Windows: taskkill /F /IM node.exe
# Mac/Linux: lsof -ti:5173 | xargs kill -9
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot reload not working
- Restart the dev server
- Clear browser cache
- Check Vite config

## License

MIT License - feel free to use this project

---

**Happy Lending! 💰**
