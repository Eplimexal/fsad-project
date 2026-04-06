import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoan } from '../../hooks/useLoan';
import { Header, Sidebar, PageLayout, StatCard, Modal } from '../../components/Layout';
import { formatCurrency } from '../../utils/currencyFormatter';
import './dashboard.css';

export const LenderDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loanOffers, applications, approveLoan, rejectApplication, createLoanOffer } = useLoan();
  const [activeSection, setActiveSection] = useState('overview');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    minAmount: '',
    maxAmount: '',
    interestRate: '',
    tenure: '',
  });

  const handleCreateOffer = async () => {
    if (
      newOffer.minAmount &&
      newOffer.maxAmount &&
      newOffer.interestRate &&
      newOffer.tenure
    ) {
      await createLoanOffer({
        ...newOffer,
        lenderId: user?.id,
        lenderName: user?.name,
        status: 'active',
      });
      setNewOffer({
        minAmount: '',
        maxAmount: '',
        interestRate: '',
        tenure: '',
      });
      setShowOfferModal(false);
    }
  };

  const handleApproveApplication = async (appId) => {
    await approveLoan(appId);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'offers', label: 'Loan Offers' },
    { id: 'applications', label: 'Applications' },
    { id: 'active-loans', label: 'Active Loans' },
    { id: 'payments', label: 'Payment Tracking' },
  ];

  const myApplications = applications.filter((app) => app.lenderId === user?.id || !app.lenderId);

  return (
    <div>
      <Header>
        <div className="user-menu">
          <div className="user-info">
            <p className="user-name">{user?.name || 'Lender'}</p>
            <p className="user-role">Lender</p>
          </div>
          <div className="user-avatar">{user?.name?.[0] || 'L'}</div>
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
              <h2>Lender Dashboard</h2>
              <div className="grid grid-4 mt-3">
                <StatCard
                  title="Total Offers"
                  value={loanOffers.length}
                  icon="📊"
                  color="primary"
                />
                <StatCard
                  title="Pending Applications"
                  value={myApplications.filter((a) => a.status === 'pending').length}
                  icon="⏳"
                  color="warning"
                />
                <StatCard
                  title="Approved"
                  value={myApplications.filter((a) => a.status === 'approved').length}
                  icon="✓"
                  color="success"
                />
                <StatCard
                  title="Rejected"
                  value={myApplications.filter((a) => a.status === 'rejected').length}
                  icon="✕"
                  color="danger"
                />
              </div>

              <div className="card mt-3">
                <h3>Quick Stats</h3>
                <div className="stats-table">
                  <div className="stat-row">
                    <span>Active Offers:</span>
                    <strong>{loanOffers.filter((o) => o.status === 'active').length}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Total Applications:</span>
                    <strong>{myApplications.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'offers' && (
            <div>
              <div className="flex-between mb-2">
                <h2>Loan Offers</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowOfferModal(true)}
                >
                  + Create Offer
                </button>
              </div>

              <div className="cards-grid">
                {loanOffers.map((offer) => (
                  <div key={offer.id} className="card loan-card">
                    <div className="flex-between">
                      <h3>{formatCurrency(offer.minAmount)} - {formatCurrency(offer.maxAmount)}</h3>
                      <span className={`badge badge-${offer.status}`}>{offer.status}</span>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'applications' && (
            <div>
              <h2>Loan Applications</h2>
              <div className="card mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Amount</th>
                      <th>Interest Rate</th>
                      <th>Tenure</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myApplications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.borrowerName}</td>
                        <td>{formatCurrency(app.loanAmount)}</td>
                        <td>{app.interestRate}%</td>
                        <td>{app.tenure} months</td>
                        <td>
                          <span className={`badge badge-${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleApproveApplication(app.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => rejectApplication(app.id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'active-loans' && (
            <div>
              <h2>Active Loans</h2>
              <div className="card mt-3">
                <p style={{ color: 'var(--secondary-color)' }}>
                  View and manage loans that have been approved and issued.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div>
              <h2>Payment Tracking</h2>
              <div className="card mt-3">
                <p style={{ color: 'var(--secondary-color)' }}>
                  Track all payments from borrowers.
                </p>
              </div>
            </div>
          )}
        </PageLayout>
      </div>

      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        title="Create Loan Offer"
      >
        <div className="form-group">
          <label>Minimum Amount</label>
          <input
            type="number"
            value={newOffer.minAmount}
            onChange={(e) =>
              setNewOffer({ ...newOffer, minAmount: e.target.value })
            }
            placeholder="Enter minimum amount"
          />
        </div>
        <div className="form-group">
          <label>Maximum Amount</label>
          <input
            type="number"
            value={newOffer.maxAmount}
            onChange={(e) =>
              setNewOffer({ ...newOffer, maxAmount: e.target.value })
            }
            placeholder="Enter maximum amount"
          />
        </div>
        <div className="form-group">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={newOffer.interestRate}
            onChange={(e) =>
              setNewOffer({ ...newOffer, interestRate: e.target.value })
            }
            placeholder="Enter interest rate"
          />
        </div>
        <div className="form-group">
          <label>Tenure (months)</label>
          <input
            type="number"
            value={newOffer.tenure}
            onChange={(e) =>
              setNewOffer({ ...newOffer, tenure: e.target.value })
            }
            placeholder="Enter tenure"
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCreateOffer}
          style={{ width: '100%' }}
        >
          Create Offer
        </button>
      </Modal>
    </div>
  );
};
