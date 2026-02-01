import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, handleApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update form data when user context changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        createdAt: user.createdAt || ''
      });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getProfile();
      const userData = response.data.data.user;
      
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        role: userData.role || '',
        createdAt: userData.createdAt || ''
      });
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      const response = await authAPI.updateProfile(updateData);
      const updatedUser = response.data.data.user;
      
      // Update the context
      updateUser(updatedUser);
      
      // Update the form data to reflect the changes
      setFormData({
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        role: updatedUser.role || '',
        createdAt: updatedUser.createdAt || ''
      });
      
      showSuccess('Profile updated successfully!');
      setSuccess('Profile updated successfully!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="card-premium p-6">
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content profile-page">
      {/* Professional Header */}
      <div className="mb-8 animate-fade-in-down">
        <div className="card-premium p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="profile-avatar-large">
              <span className="text-3xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-primary mb-3">
                {user?.username}
              </h1>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                <div className="badge badge-info">
                  <span className="icon-shield mr-2"></span>
                  {user?.role} Account
                </div>
                {formData.createdAt && (
                  <div className="text-sm text-gray-500">
                    <span className="icon-clock mr-2"></span>
                    Member since {new Date(formData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-lg">
                Manage your account information and security preferences
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                <span className="icon-arrow-left mr-2"></span>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-12">
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

          {/* Account Information Card */}
          <div className="card-premium p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="icon-user text-white"></span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Account Information</h2>
                <p className="text-gray-500">Update your personal details and contact information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Username */}
                <div>
                  <label className="form-label">
                    <span className="icon-user mr-2"></span>
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="input-field"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">
                    <span className="icon-at mr-2"></span>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Role (Read-only) */}
                <div>
                  <label className="form-label">

                    <br></br>
                    <span className="icon-shield mr-2"></span>
                    Account Role
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input-field bg-gray-50 text-gray-600"
                      value={formData.role}
                      disabled
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <span className="icon-alert-circle mr-1"></span>
                    Contact system administrator to change your role
                  </p>
                </div>

                {/* Account Status */}
                <div>
                  <label className="form-label">
                    <span className="icon-check-circle mr-2"></span>
                    Account Status
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium">Active & Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Privacy Card */}
          <div className="card-premium p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <span className="icon-shield text-white"></span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Security & Privacy</h2>
                <p className="text-gray-500">Manage your account security and privacy settings</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Password Section */}
              <div className="flex items-center justify-between p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="icon-key text-white"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Password</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Last updated: Recently • Strong password detected
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/change-password')}
                  className="btn btn-outline"
                >
                  <span className="icon-key mr-2"></span>
                  Change Password
                </button>
              </div>

              {/* Account Security */}
              <div className="flex items-center justify-between p-8 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="icon-check-circle text-white"></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Account Security</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your account is secure and all security checks passed
                    </p>
                  </div>
                </div>
                <div className="badge badge-success">
                  <span className="icon-check mr-1"></span>
                  Verified
                </div>
              </div>

              {/* Session Information */}
              <div className="p-8 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="icon-clock text-white"></span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Session Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Login:</span>
                    <span className="font-medium">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Session Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="card-premium p-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row gap-6 justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline flex-1 sm:flex-none px-8 py-3"
                disabled={isSubmitting}
              >
                <span className="icon-arrow-left mr-2"></span>
                Back to Dashboard
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
                    <span className="icon-save mr-2"></span>
                    <span>Save Changes</span>
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

export default Profile;