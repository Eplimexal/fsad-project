import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateField, validateFields } from '../validation/authValidation';
import './auth.css';

const REGISTER_FIELDS = ['name', 'email', 'password', 'confirmPassword', 'role'];

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'borrower',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');

  const hasErrors = useMemo(() => Object.keys(errors).some((key) => errors[key]), [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (touched[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value, next),
        }));
      }

      if ((name === 'password' || name === 'confirmPassword') && touched.confirmPassword) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: validateField('confirmPassword', next.confirmPassword, next),
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

    const nextErrors = validateFields(REGISTER_FIELDS, formData);
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true,
    });

    if (Object.keys(nextErrors).length > 0) return;

    try {
      const user = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      navigate(`/${user.role}`);
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>LoanHub</h1>
        <h2>Create your account</h2>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              className={errors.name && touched.name ? 'input-error' : ''}
            />
            {errors.name && touched.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password"
              className={errors.password && touched.password ? 'input-error' : ''}
            />
            {errors.password && touched.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && touched.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
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
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="auth-link-btn">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};
