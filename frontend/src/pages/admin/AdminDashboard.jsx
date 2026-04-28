import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoan } from '../../hooks/useLoan';
import { Header, Sidebar, PageLayout, StatCard, Modal } from '../../components/Layout';
import { adminApi } from '../../services/api';
import { formatCurrency } from '../../utils/currencyFormatter';
import './dashboard.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loans, loanOffers, applications, approveLoan, rejectApplication } = useLoan();

  const [activeSection, setActiveSection] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'borrower' });
  const [users, setUsers] = useState([]);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState({ id: '', name: '', email: '', role: 'borrower', password: '' });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await adminApi.getUsers();
        setUsers(data);
      } catch (err) {
        setActionError(err?.response?.data?.message || err?.message || 'Unable to load users.');
      }
    };

    loadUsers();
    const intervalId = setInterval(loadUsers, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const totalDisbursed = loans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
  const pendingApplications = applications.filter((app) => app.status === 'pending');

  const handleAddUser = async () => {
    setActionError('');
    setActionSuccess('');

    if (!newUser.name || !newUser.email || !newUser.password) {
      setActionError('Name, email, and password are required.');
      return;
    }

    if (newUser.password.length < 6) {
      setActionError('Password must be at least 6 characters.');
      return;
    }

    try {
      const createdUser = await adminApi.createUser({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
      });

      setUsers((prev) => [...prev, createdUser]);
      setActionSuccess(`User ${createdUser.name} created successfully.`);
      setNewUser({ name: '', email: '', password: '', role: 'borrower' });
      setShowUserModal(false);
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Unable to create user.');
    }
  };


  const handleOpenEdit = (account) => {
    setEditingUser({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      password: '',
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    setActionError('');
    setActionSuccess('');

    if (!editingUser.name || !editingUser.email) {
      setActionError('Name and email are required.');
      return;
    }

    if (editingUser.password && editingUser.password.length < 6) {
      setActionError('Updated password must be at least 6 characters.');
      return;
    }

    try {
      const updatedUser = await adminApi.updateUser(editingUser.id, {
        name: editingUser.name.trim(),
        email: editingUser.email.trim(),
        role: editingUser.role,
        password: editingUser.password || undefined,
      });

      setUsers((prev) => prev.map((account) => (account.id === updatedUser.id ? updatedUser : account)));
      setActionSuccess(`User ${updatedUser.name} updated successfully.`);
      setShowEditModal(false);
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Unable to update user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    setActionError('');
    setActionSuccess('');

    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((account) => account.id !== userId));
      setActionSuccess('User deleted successfully.');
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Unable to delete user.');
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
    { id: 'users', label: 'User Management' },
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
                <h2>User Management</h2>
                <button className="btn btn-primary" onClick={() => setShowUserModal(true)}>
                  + Add User
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{account.role}</td>
                        <td>
                          <span className="badge badge-active">{account.status || 'active'}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(account)}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(account.id)}>
                              Delete
                            </button>
                          </div>
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

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Add New User">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Enter user name"
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
          <label>Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Enter temporary password"
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
        <button className="btn btn-primary" onClick={handleAddUser} style={{ width: '100%' }}>
          Add User
        </button>
      </Modal>


      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            placeholder="Enter user name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            placeholder="Enter user email"
          />
        </div>
        <div className="form-group">
          <label>New Password (optional)</label>
          <input
            type="password"
            value={editingUser.password}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
            <option value="borrower">Borrower</option>
            <option value="lender">Lender</option>
            <option value="admin">Admin</option>
            <option value="analyst">Financial Analyst</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleUpdateUser} style={{ width: '100%' }}>
          Update User
        </button>
      </Modal>

    </div>
  );
};
