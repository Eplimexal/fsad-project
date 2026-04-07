import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateField, validateFields } from '../validation/authValidation';
import './auth.css';

const LOGIN_FIELDS = ['email', 'password', 'role'];

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'borrower',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        const nextError = validateField(name, value, next);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: nextError,
        }));
      }
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const nextErrors = validateFields(LOGIN_FIELDS, formData);
    setErrors(nextErrors);
    setTouched({ email: true, password: true, role: true });

    if (Object.keys(nextErrors).length > 0) return;

    try {
      const userData = await login(formData);
      navigate(`/${userData.role}`);
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>LoanHub</h1>
        <h2>Login</h2>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={errors.email && touched.email ? 'input-error' : ''}
            />
            {errors.email && touched.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={errors.password && touched.password ? 'input-error' : ''}
            />
            {errors.password && touched.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.role && touched.role ? 'input-error' : ''}
            >
              <option value="borrower">Borrower</option>
              <option value="lender">Lender</option>
              <option value="admin">Admin</option>
              <option value="analyst">Financial Analyst</option>
            </select>
            {errors.role && touched.role && <p className="field-error">{errors.role}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={hasErrors && Object.keys(touched).length > 0}>
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="auth-link-btn"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};
