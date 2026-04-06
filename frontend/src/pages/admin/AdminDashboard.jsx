import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Header, Sidebar, PageLayout, StatCard, Modal } from '../../components/Layout';
import './dashboard.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'lender', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'borrower', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'borrower', status: 'inactive' },
  ]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'borrower' });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { id: users.length + 1, ...newUser, status: 'active' }]);
      setNewUser({ name: '', email: '', role: 'borrower' });
      setShowUserModal(false);
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview' },
    { id: 'users', label: 'User Management' },
    { id: 'security', label: 'Security & Settings' },
    { id: 'reports', label: 'System Reports' },
  ];

  return (
    <div>
      <Header>
        <div className="user-menu">
          <div className="user-info">
            <p className="user-name">{user?.name || 'Admin'}</p>
            <p className="user-role">{user?.role}</p>
          </div>
          <div className="user-avatar">{user?.name?.[0] || 'A'}</div>
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
              <h2>Admin Dashboard</h2>
              <div className="grid grid-4 mt-3">
                <StatCard
                  title="Total Users"
                  value={users.length}
                  icon="👥"
                  color="primary"
                />
                <StatCard
                  title="Active Users"
                  value={users.filter((u) => u.status === 'active').length}
                  icon="✓"
                  color="success"
                />
                <StatCard
                  title="Lenders"
                  value={users.filter((u) => u.role === 'lender').length}
                  icon="💰"
                  color="warning"
                />
                <StatCard
                  title="Borrowers"
                  value={users.filter((u) => u.role === 'borrower').length}
                  icon="📋"
                  color="danger"
                />
              </div>

              <div className="card mt-3">
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--secondary-color)', marginTop: '16px' }}>
                  System running smoothly. All users active.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <div className="flex-between mb-2">
                <h2>User Management</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowUserModal(true)}
                >
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
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                        <td>
                          <span className={`badge badge-${u.status}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => toggleUserStatus(u.id)}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h2>Security & Settings</h2>
              <div className="card mt-3">
                <h3>System Security</h3>
                <div className="settings-group">
                  <div className="setting-item">
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p style={{ color: 'var(--secondary-color)' }}>
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Data Encryption</h4>
                      <p style={{ color: 'var(--secondary-color)' }}>
                        Enable end-to-end encryption
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Audit Logging</h4>
                      <p style={{ color: 'var(--secondary-color)' }}>
                        Log all system activities
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2>System Reports</h2>
              <div className="card mt-3">
                <h3>Available Reports</h3>
                <ul style={{ marginTop: '16px' }}>
                  <li>User Activity Report</li>
                  <li>Loan Performance Report</li>
                  <li>Financial Summary Report</li>
                  <li>Security Audit Report</li>
                </ul>
              </div>
            </div>
          )}
        </PageLayout>
      </div>

      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Add New User"
      >
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
            placeholder="Enter user name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            placeholder="Enter user email"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="borrower">Borrower</option>
            <option value="lender">Lender</option>
            <option value="analyst">Financial Analyst</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddUser}
          style={{ width: '100%' }}
        >
          Add User
        </button>
      </Modal>
    </div>
  );
};
