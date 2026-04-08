import { useEffect, useState } from 'react';
import { LoanContext } from './loanContextObject';
import { loanApi } from '../services/api';

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const bootstrap = async () => {
      const data = await loanApi.getDashboardData();
      setLoans(data.loans);
      setLoanOffers(data.loanOffers);
      setApplications(data.applications);
    };

    bootstrap();
  }, []);

  const createLoanOffer = async (offer) => {
    const newOffer = await loanApi.createLoanOffer(offer);
    setLoanOffers((prev) => [...prev, newOffer]);
    return newOffer;
  };

  const createLoanApplication = async (application) => {
    const newApp = await loanApi.createLoanApplication(application);
    setApplications((prev) => [...prev, newApp]);
    return newApp;
  };

  const approveLoan = async (applicationId) => {
    const { application, loan } = await loanApi.approveLoan(applicationId);
    setApplications((prev) => prev.map((a) => (a.id === application.id ? application : a)));
    setLoans((prev) => [...prev, loan]);
    return loan;
  };

  const rejectApplication = async (applicationId) => {
    const application = await loanApi.rejectApplication(applicationId);
    setApplications((prev) => prev.map((a) => (a.id === application.id ? application : a)));
  };

  const addPayment = async (loanId, payment) => {
    const updatedLoan = await loanApi.addPayment(loanId, payment);
    setLoans((prev) => prev.map((loan) => (loan.id === loanId ? updatedLoan : loan)));
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
