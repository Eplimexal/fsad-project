import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoan } from '../../hooks/useLoan';
import { Header, Sidebar, PageLayout, StatCard, Modal } from '../../components/Layout';
import { formatCurrency } from '../../utils/currencyFormatter';
import './dashboard.css';

export const BorrowerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loans, applications, loanOffers, createLoanApplication, addPayment } = useLoan();
  const [activeSection, setActiveSection] = useState('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [newApplication, setNewApplication] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: '',
    purpose: '',
  });
  const [newPayment, setNewPayment] = useState({
    amount: '',
  });

  const myLoans = loans.filter((l) => l.borrowerId === user?.id);
  const myApplications = applications.filter((a) => a.borrowerId === user?.id);

  const handleCreateApplication = async () => {
    if (
      newApplication.loanAmount &&
      newApplication.interestRate &&
      newApplication.tenure &&
      newApplication.purpose
    ) {
      await createLoanApplication({
        ...newApplication,
        borrowerId: user?.id,
        borrowerName: user?.name,
      });
      setNewApplication({
        loanAmount: '',
        interestRate: '',
        tenure: '',
        purpose: '',
      });
      setShowApplicationModal(false);
    }
  };

  const handleMakePayment = async () => {
    if (newPayment.amount && selectedLoan) {
      await addPayment(selectedLoan.id, {
        id: 'P' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(newPayment.amount),
        status: 'completed',
      });
      setNewPayment({ amount: '' });
      setShowPaymentModal(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'apply', label: 'Browse Offers' },
    { id: 'applications', label: 'My Applications' },
    { id: 'loans', label: 'My Loans' },
    { id: 'payments', label: 'Payments' },
  ];

  return (
    <div>
      <Header>
        <div className="user-menu">
          <div className="user-info">
            <p className="user-name">{user?.name || 'Borrower'}</p>
            <p className="user-role">Borrower</p>
          </div>
          <div className="user-avatar">{user?.name?.[0] || 'B'}</div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </Header>

      <div className="main-layout">
        <Sidebar
          items={sidebarItems}
          selectedItem={activeSection}
          onSelect={setActiveSection}
        />

        <PageLayout>
          {activeSection === 'overview' && (
            <div>
              <h2>Borrower Dashboard</h2>
              <div className="grid grid-4 mt-3">
                <StatCard
                  title="Active Loans"
                  value={myLoans.filter((l) => l.status === 'active').length}
                  icon="📋"
                  color="primary"
                />
                <StatCard
                  title="Total Borrowed"
                  value={formatCurrency(myLoans.reduce((sum, l) => sum + l.amount, 0))}
                  icon="💰"
                  color="success"
                />
                <StatCard
                  title="Total Due"
                  value={formatCurrency(myLoans.reduce((sum, l) => sum + l.remainingAmount, 0))}
                  icon="⏳"
                  color="warning"
                />
                <StatCard
                  title="Pending Applications"
                  value={myApplications.filter((a) => a.status === 'pending').length}
                  icon="📝"
                  color="danger"
                />
              </div>

              <div className="card mt-3">
                <h3>Loan Summary</h3>
                {myLoans.length > 0 ? (
                  <div className="stats-table">
                    {myLoans.map((loan) => (
                      <div key={loan.id} className="stat-row">
                        <span>Loan {loan.id}</span>
                        <strong>{formatCurrency(loan.remainingAmount)} remaining</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--secondary-color)' }}>No active loans</p>
                )}
              </div>
            </div>
          )}

          {activeSection === 'apply' && (
            <div>
              <div className="flex-between mb-2">
                <h2>Available Loan Offers</h2>
              </div>

              <div className="cards-grid">
                {loanOffers.map((offer) => (
                  <div key={offer.id} className="card loan-card">
                    <div>
                      <h3>{formatCurrency(offer.minAmount)} - {formatCurrency(offer.maxAmount)}</h3>
                      <p style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                        by {offer.lenderName}
                      </p>
                    </div>
                    <div className="loan-details">
                      <div>
                        <p>Interest Rate</p>
                        <h4>{offer.interestRate}%</h4>
                      </div>
                      <div>
                        <p>Tenure</p>
                        <h4>{offer.tenure} months</h4>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => setShowApplicationModal(true)}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'applications' && (
            <div>
              <h2>My Applications</h2>
              <div className="card mt-3">
                {myApplications.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Tenure</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myApplications.map((app) => (
                        <tr key={app.id}>
                          <td>{formatCurrency(app.loanAmount)}</td>
                          <td>{app.interestRate}%</td>
                          <td>{app.tenure} months</td>
                          <td>{app.purpose}</td>
                          <td>
                            <span className={`badge badge-${app.status}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--secondary-color)' }}>No applications yet</p>
                )}
              </div>
            </div>
          )}

          {activeSection === 'loans' && (
            <div>
              <h2>My Loans</h2>
              <div className="card mt-3">
                {myLoans.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Loan ID</th>
                        <th>Amount</th>
                        <th>Interest</th>
                        <th>Remaining</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLoans.map((loan) => (
                        <tr key={loan.id}>
                          <td>{loan.id}</td>
                          <td>{formatCurrency(loan.amount)}</td>
                          <td>{loan.interestRate}%</td>
                          <td>{formatCurrency(loan.remainingAmount)}</td>
                          <td>{loan.dueDate}</td>
                          <td>
                            <span className={`badge badge-${loan.status}`}>
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--secondary-color)' }}>No loans</p>
                )}
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div>
              <div className="flex-between mb-2">
                <h2>My Payments</h2>
                {myLoans.length > 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedLoan(myLoans[0]);
                      setShowPaymentModal(true);
                    }}
                  >
                    + Make Payment
                  </button>
                )}
              </div>

              <div className="card mt-3">
                {myLoans.length > 0 ? (
                  <div>
                    {myLoans.map((loan) => (
                      <div key={loan.id} className="mb-3">
                        <h3>{loan.id}</h3>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loan.payments.map((payment) => (
                              <tr key={payment.id}>
                                <td>{payment.date}</td>
                                <td>{formatCurrency(payment.amount)}</td>
                                <td>
                                  <span className={`badge badge-${payment.status}`}>
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--secondary-color)' }}>No payments</p>
                )}
              </div>
            </div>
          )}
        </PageLayout>
      </div>

      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Apply for Loan"
      >
        <div className="form-group">
          <label>Loan Amount</label>
          <input
            type="number"
            value={newApplication.loanAmount}
            onChange={(e) =>
              setNewApplication({ ...newApplication, loanAmount: e.target.value })
            }
            placeholder="Enter desired loan amount"
          />
        </div>
        <div className="form-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={newApplication.interestRate}
            onChange={(e) =>
              setNewApplication({ ...newApplication, interestRate: e.target.value })
            }
            placeholder="Interest rate"
          />
        </div>
        <div className="form-group">
          <label>Tenure (months)</label>
          <input
            type="number"
            value={newApplication.tenure}
            onChange={(e) =>
              setNewApplication({ ...newApplication, tenure: e.target.value })
            }
            placeholder="Loan tenure"
          />
        </div>
        <div className="form-group">
          <label>Purpose</label>
          <input
            type="text"
            value={newApplication.purpose}
            onChange={(e) =>
              setNewApplication({ ...newApplication, purpose: e.target.value })
            }
            placeholder="Purpose of loan"
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCreateApplication}
          style={{ width: '100%' }}
        >
          Submit Application
        </button>
      </Modal>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Make Payment"
      >
        <div className="form-group">
          <label>Loan</label>
          <select
            value={selectedLoan?.id || ''}
            onChange={(e) => {
              const loan = myLoans.find((l) => l.id === e.target.value);
              setSelectedLoan(loan);
            }}
          >
            <option value="">Select a loan</option>
            {myLoans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.id} - ${loan.remainingAmount.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Payment Amount</label>
          <input
            type="number"
            value={newPayment.amount}
            onChange={(e) =>
              setNewPayment({ ...newPayment, amount: e.target.value })
            }
            placeholder="Enter payment amount"
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleMakePayment}
          style={{ width: '100%' }}
        >
          Make Payment
        </button>
      </Modal>
    </div>
  );
};
