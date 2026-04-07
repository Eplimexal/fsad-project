import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoan } from '../../hooks/useLoan';
import { Header, Sidebar, PageLayout, StatCard, Modal } from '../../components/Layout';
import { authApi } from '../../services/api';
import { formatCurrency } from '../../utils/currencyFormatter';
import './dashboard.css';

const seededUsers = [
  { id: 'U-ADMIN', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: 'U-LENDER', name: 'John Doe', email: 'lender@example.com', role: 'lender', status: 'active' },
  { id: 'U-BORROWER', name: 'Jane Smith', email: 'borrower@example.com', role: 'borrower', status: 'active' },
  { id: 'U-ANALYST', name: 'Finance Analyst', email: 'analyst@example.com', role: 'analyst', status: 'active' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loans, loanOffers, applications, approveLoan, rejectApplication } = useLoan();

  const [activeSection, setActiveSection] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'borrower' });
  const [createdUsers, setCreatedUsers] = useState([]);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const users = useMemo(() => [...seededUsers, ...createdUsers], [createdUsers]);

  const totalDisbursed = loans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
  const pendingApplications = applications.filter((app) => app.status === 'pending');

  const handleAddUser = async () => {
    setActionError('');
    setActionSuccess('');

    if (!newUser.name || !newUser.email) {
      setActionError('Name and email are required to create a user.');
      return;
    }

    try {
      const response = await authApi.register({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: 'password123',
        role: newUser.role,
      });

      setCreatedUsers((prev) => [...prev, { ...response.user, status: 'active' }]);
      setActionSuccess(`User ${response.user.name} created successfully.`);
      setNewUser({ name: '', email: '', role: 'borrower' });
      setShowUserModal(false);
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Unable to create user.');
    }
  };

  const handleApproveApplication = async (applicationId) => {
    setActionError('');
    setActionSuccess('');
    try {
      await approveLoan(applicationId);
      setActionSuccess('Application approved successfully.');
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Unable to approve application.');
    }
  };

  const handleRejectApplication = async (applicationId) => {
    setActionError('');
    setActionSuccess('');
    try {
      await rejectApplication(applicationId);
      setActionSuccess('Application rejected successfully.');
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Unable to reject application.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview' },
    { id: 'users', label: 'User Onboarding' },
    { id: 'applications', label: 'Applications Control' },
    { id: 'reports', label: 'System Insights' },
  ];

  return (
    <div>
      <Header>
        <div className="user-menu">
          <div className="user-info">
            <p className="user-name">{user?.name || 'Admin'}</p>
            <p className="user-role">Platform Administrator</p>
          </div>
          <div className="user-avatar">{user?.name?.[0] || 'A'}</div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </Header>

      <div className="main-layout">
        <Sidebar items={sidebarItems} selectedItem={activeSection} onSelect={setActiveSection} />

        <PageLayout>
          {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
          {actionError && <div className="alert alert-error">{actionError}</div>}

          {activeSection === 'overview' && (
            <div>
              <h2>Admin Command Center</h2>
              <div className="grid grid-4 mt-3">
                <StatCard title="Total Users" value={users.length} icon="👥" color="primary" />
                <StatCard title="Pending Applications" value={pendingApplications.length} icon="⏳" color="warning" />
                <StatCard title="Active Loans" value={loans.filter((l) => l.status === 'active').length} icon="📋" color="success" />
                <StatCard title="Disbursed" value={formatCurrency(totalDisbursed)} icon="💰" color="danger" />
              </div>

              <div className="card mt-3">
                <h3>Operational Snapshot</h3>
                <div className="stats-table">
                  <div className="stat-row">
                    <span>Open Loan Offers</span>
                    <strong>{loanOffers.filter((offer) => offer.status === 'active').length}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Approved Applications</span>
                    <strong>{applications.filter((app) => app.status === 'approved').length}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Rejected Applications</span>
                    <strong>{applications.filter((app) => app.status === 'rejected').length}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <div className="flex-between mb-2">
                <h2>User Onboarding</h2>
                <button className="btn btn-primary" onClick={() => setShowUserModal(true)}>
                  + Create User Account
                </button>
              </div>

              <div className="card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{account.role}</td>
                        <td>
                          <span className="badge badge-active">{account.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'applications' && (
            <div>
              <h2>Applications Control</h2>
              <div className="card mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Amount</th>
                      <th>Rate</th>
                      <th>Tenure</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.borrowerName}</td>
                        <td>{formatCurrency(app.loanAmount)}</td>
                        <td>{app.interestRate}%</td>
                        <td>{app.tenure} months</td>
                        <td>
                          <span className={`badge badge-${app.status}`}>{app.status}</span>
                        </td>
                        <td>
                          {app.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn btn-success btn-sm" onClick={() => handleApproveApplication(app.id)}>
                                Approve
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleRejectApplication(app.id)}>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>No action required</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2>System Insights</h2>
              <div className="grid grid-2 mt-3">
                <div className="card">
                  <h3>Loan Portfolio</h3>
                  <div className="stats-table">
                    <div className="stat-row">
                      <span>Total Loans</span>
                      <strong>{loans.length}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Total Outstanding</span>
                      <strong>{formatCurrency(loans.reduce((sum, loan) => sum + Number(loan.remainingAmount || 0), 0))}</strong>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Application Funnel</h3>
                  <div className="stats-table">
                    <div className="stat-row">
                      <span>Pending</span>
                      <strong>{applications.filter((app) => app.status === 'pending').length}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Approved</span>
                      <strong>{applications.filter((app) => app.status === 'approved').length}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Rejected</span>
                      <strong>{applications.filter((app) => app.status === 'rejected').length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PageLayout>
      </div>

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Create User Account">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Enter user email"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="borrower">Borrower</option>
            <option value="lender">Lender</option>
            <option value="admin">Admin</option>
            <option value="analyst">Financial Analyst</option>
          </select>
        </div>
        <p style={{ color: 'var(--secondary-color)', fontSize: '12px', marginBottom: '12px' }}>
          New user will be created with default password <strong>password123</strong>.
        </p>
        <button className="btn btn-primary" onClick={handleAddUser} style={{ width: '100%' }}>
          Create User
        </button>
      </Modal>
    </div>
  );
};
