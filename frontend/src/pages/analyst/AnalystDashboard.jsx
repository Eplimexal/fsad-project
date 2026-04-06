import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoan } from '../../hooks/useLoan';
import { Header, Sidebar, PageLayout, StatCard } from '../../components/Layout';
import { formatCurrency } from '../../utils/currencyFormatter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AnalystDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loans, applications } = useLoan();
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
  const avgInterestRate = (loans.reduce((sum, l) => sum + l.interestRate, 0) / loans.length).toFixed(2);
  const activeLoansCount = loans.filter((l) => l.status === 'active').length;
  const approvedAppsCount = applications.filter((a) => a.status === 'approved').length;

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Loan Disbursements (₹)',
        data: [120000, 190000, 150000, 250000, 220000, 300000],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const riskData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        label: 'Number of Loans',
        data: [5, 8, 2],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'analysis', label: 'Loan Analysis' },
    { id: 'risk', label: 'Risk Assessment' },
    { id: 'reports', label: 'Financial Reports' },
  ];

  return (
    <div>
      <Header>
        <div className="user-menu">
          <div className="user-info">
            <p className="user-name">{user?.name || 'Analyst'}</p>
            <p className="user-role">Financial Analyst</p>
          </div>
          <div className="user-avatar">{user?.name?.[0] || 'F'}</div>
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
              <h2>Financial Analyst Dashboard</h2>
              <div className="grid grid-4 mt-3">
                <StatCard
                  title="Total Loaned"
                  value={formatCurrency(totalLoaned)}
                  icon="💰"
                  color="primary"
                />
                <StatCard
                  title="Avg Interest Rate"
                  value={`${avgInterestRate}%`}
                  icon="📊"
                  color="success"
                />
                <StatCard
                  title="Active Loans"
                  value={activeLoansCount}
                  icon="📋"
                  color="warning"
                />
                <StatCard
                  title="Approved Apps"
                  value={approvedAppsCount}
                  icon="✓"
                  color="danger"
                />
              </div>

              <div className="grid grid-2 mt-3">
                <div className="card">
                  <h3>Loan Disbursement Trend</h3>
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                        },
                      },
                    }}
                  />
                </div>

                <div className="card">
                  <h3>Risk Distribution</h3>
                  <Bar
                    data={riskData}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analysis' && (
            <div>
              <h2>Loan Analysis</h2>
              <div className="card mt-3">
                <h3>Loan Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric">
                    <span>Total Loans</span>
                    <h4>{loans.length}</h4>
                  </div>
                  <div className="metric">
                    <span>Average Loan Amount</span>
                    <h4>{formatCurrency(totalLoaned / loans.length)}</h4>
                  </div>
                  <div className="metric">
                    <span>Total Outstanding</span>
                    <h4>{formatCurrency(loans.reduce((sum, l) => sum + l.remainingAmount, 0))}</h4>
                  </div>
                  <div className="metric">
                    <span>Default Rate</span>
                    <h4>2.5%</h4>
                  </div>
                </div>
              </div>

              <div className="card mt-3">
                <h3>Detailed Loan Data</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Amount</th>
                      <th>Interest Rate</th>
                      <th>Remaining</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{formatCurrency(loan.amount)}</td>
                        <td>{loan.interestRate}%</td>
                        <td>{formatCurrency(loan.remainingAmount)}</td>
                        <td>
                          <span className={`badge badge-${loan.status}`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'risk' && (
            <div>
              <h2>Risk Assessment</h2>
              <div className="grid grid-3 mt-3">
                <div className="card">
                  <h3>Low Risk</h3>
                  <h4 style={{ color: 'var(--success-color)', fontSize: '32px' }}>5</h4>
                  <p style={{ color: 'var(--secondary-color)', marginTop: '8px' }}>
                    Loans with excellent payment history
                  </p>
                </div>
                <div className="card">
                  <h3>Medium Risk</h3>
                  <h4 style={{ color: 'var(--warning-color)', fontSize: '32px' }}>8</h4>
                  <p style={{ color: 'var(--secondary-color)', marginTop: '8px' }}>
                    Loans with occasional delays
                  </p>
                </div>
                <div className="card">
                  <h3>High Risk</h3>
                  <h4 style={{ color: 'var(--danger-color)', fontSize: '32px' }}>2</h4>
                  <p style={{ color: 'var(--secondary-color)', marginTop: '8px' }}>
                    Loans requiring monitoring
                  </p>
                </div>
              </div>

              <div className="card mt-3">
                <h3>Risk Mitigation Strategies</h3>
                <ul style={{ marginTop: '16px', color: 'var(--secondary-color)' }}>
                  <li>Monitor high-risk loans weekly</li>
                  <li>Enforce stricter repayment schedules</li>
                  <li>Increase collateral requirements</li>
                  <li>Regular financial audits</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2>Financial Reports</h2>
              <div className="card mt-3">
                <h3>Available Reports</h3>
                <div className="report-list">
                  <div className="report-item">
                    <h4>Monthly Performance Report</h4>
                    <p style={{ color: 'var(--secondary-color)' }}>
                      Generate a comprehensive report of loan performance for the month
                    </p>
                    <button className="btn btn-primary">Download</button>
                  </div>
                  <div className="report-item">
                    <h4>Quarterly Financial Summary</h4>
                    <p style={{ color: 'var(--secondary-color)' }}>
                      Quarterly analysis of interest income and disbursements
                    </p>
                    <button className="btn btn-primary">Download</button>
                  </div>
                  <div className="report-item">
                    <h4>Risk Assessment Report</h4>
                    <p style={{ color: 'var(--secondary-color)' }}>
                      Detailed risk analysis and recommendations
                    </p>
                    <button className="btn btn-primary">Download</button>
                  </div>
                  <div className="report-item">
                    <h4>Borrower Credit Analysis</h4>
                    <p style={{ color: 'var(--secondary-color)' }}>
                      Individual borrower credit and payment history
                    </p>
                    <button className="btn btn-primary">Download</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PageLayout>
      </div>
    </div>
  );
};
