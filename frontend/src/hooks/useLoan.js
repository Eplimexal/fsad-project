import { useContext } from 'react';
import { LoanContext } from '../context/loanContextObject';

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) throw new Error('useLoan must be used within LoanProvider');
  return context;
};
