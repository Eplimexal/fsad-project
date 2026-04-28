import { useMemo, useState } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const getRiskLevel = (loan) => {
  const remainingRatio = loan.amount > 0 ? loan.remainingAmount / loan.amount : 0;

  if (loan.status === 'completed' || remainingRatio <= 0.2) {
    return 'Low Risk';
  }

  if (remainingRatio <= 0.6) {
    return 'Medium Risk';
  }

  return 'High Risk';
};

const buildCsvContent = (rows) => rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');

const downloadCsv = (filename, rows) => {
  const csv = buildCsvContent(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const AnalystDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loans, applications } = useLoan();
  const [activeSection, setActiveSection] = useState('overview');

  const riskTaggedLoans = useMemo(() => loans.map((loan) => ({ ...loan, riskLevel: getRiskLevel(loan) })), [loans]);

  const riskCounts = useMemo(() => {
    const counts = { 'Low Risk': 0, 'Medium Risk': 0, 'High Risk': 0 };
    riskTaggedLoans.forEach((loan) => {
      counts[loan.riskLevel] += 1;
    });
    return counts;
  }, [riskTaggedLoans]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount || 0), 0);
  const avgInterestRate = loans.length
    ? (loans.reduce((sum, l) => sum + Number(l.interestRate || 0), 0) / loans.length).toFixed(2)
    : '0.00';
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
        data: [riskCounts['Low Risk'], riskCounts['Medium Risk'], riskCounts['High Risk']],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      },
    ],
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'analysis', label: 'Loan Analysis' },
    { id: 'risk', label: 'Risk Assessment' },
    { id: 'reports', label: 'Financial Reports' },
  ];

  const reportConfigs = [
    {
      title: 'Monthly Performance Report',
      description: 'Comprehensive month-wise loan performance snapshot.',
      filename: 'monthly-performance-report.csv',
      rows: [
        ['Loan ID', 'Amount', 'Remaining', 'Interest Rate', 'Status'],
        ...loans.map((loan) => [loan.id, loan.amount, loan.remainingAmount, loan.interestRate, loan.status]),
      ],
    },
    {
      title: 'Quarterly Financial Summary',
      description: 'Quarterly totals for disbursed and outstanding value.',
      filename: 'quarterly-financial-summary.csv',
      rows: [
        ['Metric', 'Value'],
        ['Total Loaned', totalLoaned],
        ['Total Outstanding', loans.reduce((sum, loan) => sum + Number(loan.remainingAmount || 0), 0)],
        ['Active Loans', activeLoansCount],
      ],
    },
    {
      title: 'Risk Assessment Report',
      description: 'Loan-by-loan risk posture with aggregate counts.',
      filename: 'risk-assessment-report.csv',
      rows: [
        ['Risk Level', 'Loan Count'],
        ['Low Risk', riskCounts['Low Risk']],
        ['Medium Risk', riskCounts['Medium Risk']],
        ['High Risk', riskCounts['High Risk']],
        [],
        ['Loan ID', 'Risk Level', 'Amount', 'Remaining', 'Status'],
        ...riskTaggedLoans.map((loan) => [loan.id, loan.riskLevel, loan.amount, loan.remainingAmount, loan.status]),
      ],
    },
    {
      title: 'Borrower Credit Analysis',
      description: 'Borrower-linked approvals and liabilities overview.',
      filename: 'borrower-credit-analysis.csv',
      rows: [
        ['Borrower ID', 'Applications', 'Approved Applications', 'Total Borrowed'],
        ...Object.values(
          applications.reduce((acc, application) => {
            const borrowerId = application.borrowerId || 'Unknown';
            if (!acc[borrowerId]) {
              acc[borrowerId] = { borrowerId, applications: 0, approved: 0, totalBorrowed: 0 };
            }
            acc[borrowerId].applications += 1;
            if (application.status === 'approved') {
              acc[borrowerId].approved += 1;
              acc[borrowerId].totalBorrowed += Number(application.loanAmount || 0);
            }
            return acc;
          }, {}),
        ).map((row) => [row.borrowerId, row.applications, row.approved, row.totalBorrowed]),
      ],
    },
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
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </Header>

      <div className="main-layout">
        <Sidebar items={sidebarItems} selectedItem={activeSection} onSelect={setActiveSection} />

        <PageLayout>
          {activeSection === 'overview' && (
            <div>
              <h2>Financial Analyst Dashboard</h2>
              <div className="grid grid-4 mt-3">
                <StatCard title="Total Loaned" value={formatCurrency(totalLoaned)} icon="💰" color="primary" />
                <StatCard title="Avg Interest Rate" value={`${avgInterestRate}%`} icon="📊" color="success" />
                <StatCard title="Active Loans" value={activeLoansCount} icon="📋" color="warning" />
                <StatCard title="Approved Apps" value={approvedAppsCount} icon="✓" color="danger" />
              </div>

              <div className="grid grid-2 mt-3">
                <div className="card">
                  <h3>Loan Disbursement Trend</h3>
                  <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
                </div>

                <div className="card">
                  <h3>Risk Distribution</h3>
                  <Bar data={riskData} options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }} />
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
                  <div className="metric"><span>Total Loans</span><h4>{loans.length}</h4></div>
                  <div className="metric"><span>Average Loan Amount</span><h4>{formatCurrency(loans.length ? totalLoaned / loans.length : 0)}</h4></div>
                  <div className="metric"><span>Total Outstanding</span><h4>{formatCurrency(loans.reduce((sum, l) => sum + Number(l.remainingAmount || 0), 0))}</h4></div>
                  <div className="metric"><span>Default Rate</span><h4>2.5%</h4></div>
                </div>
              </div>

              <div className="card mt-3">
                <h3>Detailed Loan Data</h3>
                <table className="table">
                  <thead>
                    <tr><th>Loan ID</th><th>Amount</th><th>Interest Rate</th><th>Remaining</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{formatCurrency(loan.amount)}</td>
                        <td>{loan.interestRate}%</td>
                        <td>{formatCurrency(loan.remainingAmount)}</td>
                        <td><span className={`badge badge-${loan.status}`}>{loan.status}</span></td>
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
                <div className="card"><h3>Low Risk</h3><h4 style={{ color: 'var(--success-color)', fontSize: '32px' }}>{riskCounts['Low Risk']}</h4><p style={{ color: 'var(--secondary-color)', marginTop: '8px' }}>Loans with lower remaining exposure</p></div>
                <div className="card"><h3>Medium Risk</h3><h4 style={{ color: 'var(--warning-color)', fontSize: '32px' }}>{riskCounts['Medium Risk']}</h4><p style={{ color: 'var(--secondary-color)', marginTop: '8px' }}>Loans requiring periodic monitoring</p></div>
                <div className="card"><h3>High Risk</h3><h4 style={{ color: 'var(--danger-color)', fontSize: '32px' }}>{riskCounts['High Risk']}</h4><p style={{ color: 'var(--secondary-color)', marginTop: '8px' }}>Loans with high outstanding exposure</p></div>
              </div>

              <div className="card mt-3">
                <h3>Loan-Level Risk Listing</h3>
                <table className="table">
                  <thead>
                    <tr><th>Loan ID</th><th>Amount</th><th>Remaining</th><th>Status</th><th>Risk Level</th></tr>
                  </thead>
                  <tbody>
                    {riskTaggedLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{formatCurrency(loan.amount)}</td>
                        <td>{formatCurrency(loan.remainingAmount)}</td>
                        <td>{loan.status}</td>
                        <td>{loan.riskLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2>Financial Reports</h2>
              <div className="card mt-3">
                <h3>Available Reports</h3>
                <div className="report-list">
                  {reportConfigs.map((report) => (
                    <div key={report.title} className="report-item">
                      <h4>{report.title}</h4>
                      <p style={{ color: 'var(--secondary-color)' }}>{report.description}</p>
                      <button className="btn btn-primary" onClick={() => downloadCsv(report.filename, report.rows)}>Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </PageLayout>
      </div>
    </div>
  );
};
