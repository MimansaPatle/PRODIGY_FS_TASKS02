import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(formData);
    
    if (!result.success) {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="flex flex-col items-center">
          <div className="loading-spinner"></div>
          <p className="text-white mt-4 text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        {/* Header */}
        <div className="login-header">
          <h1 className="welcome-title">
            Welcome Back
          </h1>
          <p className="welcome-subtitle">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="login-form-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span className="icon-alert-circle"></span>
                <p>{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon icon icon-user"></span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon icon icon-lock"></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  <span className={showPassword ? 'icon-eye-off' : 'icon-eye'}></span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner w-5 h-5 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white text-sm opacity-80">
            PRODIGY Employee Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;