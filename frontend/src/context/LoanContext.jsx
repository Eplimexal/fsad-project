import { useEffect, useState } from 'react';
import { LoanContext } from './loanContextObject';
import { loanApi } from '../services/api';
import { MOCK_APPLICATIONS, MOCK_LOANS, MOCK_OFFERS } from '../services/mockData';

const getOfflineData = () => {
  const saved = localStorage.getItem('offlineLoanData');
  if (saved) return JSON.parse(saved);

  const seed = {
    loans: MOCK_LOANS,
    loanOffers: MOCK_OFFERS,
    applications: MOCK_APPLICATIONS,
  };
  localStorage.setItem('offlineLoanData', JSON.stringify(seed));
  return seed;
};

const saveOfflineData = (next) => localStorage.setItem('offlineLoanData', JSON.stringify(next));
const isNetworkError = (err) => !err?.response;

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await loanApi.getDashboardData();
        setLoans(data.loans);
        setLoanOffers(data.loanOffers);
        setApplications(data.applications);
      } catch {
        const fallback = getOfflineData();
        setLoans(fallback.loans);
        setLoanOffers(fallback.loanOffers);
        setApplications(fallback.applications);
      }
    };

    bootstrap();
  }, []);

  const createLoanOffer = async (offer) => {
    try {
      const newOffer = await loanApi.createLoanOffer(offer);
      setLoanOffers((prev) => [...prev, newOffer]);
      return newOffer;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const newOffer = { id: `O-${Date.now()}`, ...offer, createdAt: new Date().toISOString() };
      const nextOffers = [...loanOffers, newOffer];
      setLoanOffers(nextOffers);
      saveOfflineData({ loans, loanOffers: nextOffers, applications });
      return newOffer;
    }
  };

  const createLoanApplication = async (application) => {
    try {
      const newApp = await loanApi.createLoanApplication(application);
      setApplications((prev) => [...prev, newApp]);
      return newApp;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const newApp = { id: `APP-${Date.now()}`, ...application, status: 'pending', appliedAt: new Date().toISOString() };
      const nextApplications = [...applications, newApp];
      setApplications(nextApplications);
      saveOfflineData({ loans, loanOffers, applications: nextApplications });
      return newApp;
    }
  };

  const approveLoan = async (applicationId) => {
    try {
      const { application, loan } = await loanApi.approveLoan(applicationId);
      setApplications((prev) => prev.map((a) => (a.id === application.id ? application : a)));
      setLoans((prev) => [...prev, loan]);
      return loan;
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const app = applications.find((a) => a.id === applicationId);
      if (!app) return null;
      const loan = {
        id: `L-${Date.now()}`,
        borrowerId: app.borrowerId,
        lenderId: app.lenderId || 'OFFLINE-LENDER',
        amount: Number(app.loanAmount),
        interestRate: Number(app.interestRate),
        tenure: Number(app.tenure),
        status: 'active',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + Number(app.tenure) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        remainingAmount: Number(app.loanAmount),
        payments: [],
      };
      const nextApplications = applications.map((a) => (a.id === applicationId ? { ...a, status: 'approved' } : a));
      const nextLoans = [...loans, loan];
      setApplications(nextApplications);
      setLoans(nextLoans);
      saveOfflineData({ loans: nextLoans, loanOffers, applications: nextApplications });
      return loan;
    }
  };

  const rejectApplication = async (applicationId) => {
    try {
      const application = await loanApi.rejectApplication(applicationId);
      setApplications((prev) => prev.map((a) => (a.id === application.id ? application : a)));
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const nextApplications = applications.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' } : a));
      setApplications(nextApplications);
      saveOfflineData({ loans, loanOffers, applications: nextApplications });
    }
  };

  const addPayment = async (loanId, payment) => {
    try {
      const updatedLoan = await loanApi.addPayment(loanId, payment);
      setLoans((prev) => prev.map((loan) => (loan.id === loanId ? updatedLoan : loan)));
    } catch (err) {
      if (!isNetworkError(err)) throw err;
      const nextLoans = loans.map((loan) => {
        if (loan.id !== loanId) return loan;
        const remaining = Math.max(0, Number(loan.remainingAmount) - Number(payment.amount));
        return {
          ...loan,
          payments: [...loan.payments, payment],
          remainingAmount: remaining,
          status: remaining === 0 ? 'completed' : loan.status,
        };
      });
      setLoans(nextLoans);
      saveOfflineData({ loans: nextLoans, loanOffers, applications });
    }
  };

  const calculateInterest = (principal, rate, months) => (principal * rate * months) / (12 * 100);

  const value = {
    loans,
    loanOffers,
    applications,
    createLoanOffer,
    createLoanApplication,
    approveLoan,
    rejectApplication,
    addPayment,
    calculateInterest,
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};
