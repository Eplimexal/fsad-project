import { useEffect, useState } from 'react';
import { LoanContext } from './loanContextObject';
import { loanApi } from '../services/api';

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [applications, setApplications] = useState([]);

  const refreshDashboardData = async () => {
    const data = await loanApi.getDashboardData();
    setLoans(data.loans);
    setLoanOffers(data.loanOffers);
    setApplications(data.applications);
  };

  useEffect(() => {
    refreshDashboardData();

    const intervalId = setInterval(() => {
      refreshDashboardData();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const createLoanOffer = async (offer) => {
    const newOffer = await loanApi.createLoanOffer(offer);
    setLoanOffers((prev) => [...prev, newOffer]);
    return newOffer;
  };

  const updateLoanOffer = async (offerId, offer) => {
    const updatedOffer = await loanApi.updateLoanOffer(offerId, offer);
    setLoanOffers((prev) => prev.map((existingOffer) => (existingOffer.id === offerId ? updatedOffer : existingOffer)));
    return updatedOffer;
  };

  const deleteLoanOffer = async (offerId) => {
    await loanApi.deleteLoanOffer(offerId);
    setLoanOffers((prev) => prev.filter((offer) => offer.id !== offerId));
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
    updateLoanOffer,
    deleteLoanOffer,
    createLoanApplication,
    approveLoan,
    rejectApplication,
    addPayment,
    calculateInterest,
    refreshDashboardData,
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};
