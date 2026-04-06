import './styles.css';

export const Header = ({ children }) => (
  <header className="header">
    <div className="container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>LoanHub</h1>
        </div>
        <div className="navbar-content">{children}</div>
      </nav>
    </div>
  </header>
);

export const Sidebar = ({ items, selectedItem, onSelect }) => (
  <aside className="sidebar">
    <nav className="sidebar-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-link ${selectedItem === item.id ? 'active' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

export const PageLayout = ({ children }) => (
  <div className="page-layout">
    <div className="container">{children}</div>
  </div>
);

export const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

export const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
