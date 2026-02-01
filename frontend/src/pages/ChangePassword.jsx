import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, handleApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      const errorMsg = 'Current password is required';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (!formData.newPassword) {
      const errorMsg = 'New password is required';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (formData.newPassword.length < 6) {
      const errorMsg = 'New password must be at least 6 characters long';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      const errorMsg = 'New passwords do not match';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      const errorMsg = 'New password must be different from current password';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password changed successfully!');
      showSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-content">
      {/* Professional Header */}
      <div className="mb-8 animate-fade-in-down">
        <div className="card-premium p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
              <span className="icon-key text-white text-2xl"></span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-primary mb-3">
                Change Password
              </h1>
              <p className="text-gray-600 text-lg">
                Update your account password for enhanced security
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="btn btn-secondary"
              >
                <span className="icon-arrow-left mr-2"></span>
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Success Message */}
          {success && (
            <div className="alert alert-success animate-fade-in">
              <span className="icon-check-circle"></span>
              <p>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-error animate-fade-in">
              <span className="icon-alert-circle"></span>
              <p>{error}</p>
            </div>
          )}

          {/* Password Change Form */}
          <div className="card-premium p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="icon-shield text-white"></span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Security Update</h2>
                <p className="text-gray-500">Enter your current password and choose a new secure password</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Current Password */}
              <div>
                <label className="form-label">
                  <span className="icon-key mr-2"></span>
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    required
                    className="input-field pr-12"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    <span className={showPasswords.current ? 'icon-eye-off' : 'icon-eye'}></span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="form-label">
                  <span className="icon-lock mr-2"></span>
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    required
                    className="input-field pr-12"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    <span className={showPasswords.new ? 'icon-eye-off' : 'icon-eye'}></span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="icon-alert-circle mr-1"></span>
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="form-label">
                  <span className="icon-check-circle mr-2"></span>
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    className="input-field pr-12"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    <span className={showPasswords.confirm ? 'icon-eye-off' : 'icon-eye'}></span>
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="icon-shield mr-2 text-blue-600"></span>
                    Password Strength Analysis
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`flex items-center gap-2 text-sm ${formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={formData.newPassword.length >= 6 ? 'icon-check' : 'icon-x'}></span>
                      At least 6 characters
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={/[A-Z]/.test(formData.newPassword) ? 'icon-check' : 'icon-x'}></span>
                      Uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={/[0-9]/.test(formData.newPassword) ? 'icon-check' : 'icon-x'}></span>
                      Contains number
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="card-premium p-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row gap-6 justify-end">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="btn btn-outline flex-1 sm:flex-none px-8 py-3"
                disabled={isSubmitting}
              >
                <span className="icon-arrow-left mr-2"></span>
                Back to Profile
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex-1 sm:flex-none px-8 py-3 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner w-5 h-5 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span className="icon-key mr-2"></span>
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;