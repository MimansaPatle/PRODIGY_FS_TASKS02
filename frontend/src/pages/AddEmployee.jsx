import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, handleApiError } from '../services/api';
import { useToast } from '../context/ToastContext';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    profilePicture: null,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const [profilePreview, setProfilePreview] = useState(null);

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
  const statuses = ['Active', 'Inactive'];

  // Use useCallback to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Clean up form data
      const submitData = {
        ...formData,
        salary: parseFloat(formData.salary)
      };

      await employeeAPI.create(submitData);
      showSuccess('Employee created successfully!');
      navigate('/employees');
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
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Add New Employee
        </h1>
        <p className="text-gray-600">
          Create a new employee record with all necessary information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Error Message */}
        {error && (
          <div className="alert alert-error animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="card-premium p-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="icon-user mr-3"></span>
            Basic Information
          </h2>
          
          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-8">
            <div className="profile-picture-container">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <span>{formData.name ? formData.name.charAt(0).toUpperCase() : '?'}</span>
                </div>
              )}
              <label className="profile-picture-upload">
                <span className="icon-camera"></span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="profile-picture-input"
                />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div>
              <label className="form-label">
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

            <div>
              <label className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="input-field"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="form-label">
                Join Date *
              </label>
              <input
                type="date"
                name="joinDate"
                required
                className="input-field"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="card-premium p-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="icon-office-building mr-3"></span>
            Job Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                Position *
              </label>
              <input
                type="text"
                name="position"
                required
                className="input-field"
                placeholder="Enter job position"
                value={formData.position}
                onChange={handleChange}
                autoComplete="organization-title"
              />
            </div>

            <div>
              <label className="form-label">
                Department *
              </label>
              <select
                name="department"
                required
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">
                Salary (₹) *
              </label>
              <input
                type="number"
                name="salary"
                required
                min="0"
                step="1000"
                className="input-field"
                placeholder="Enter salary amount"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">
                Status *
              </label>
              <select
                name="status"
                required
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card-premium p-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="icon-office-building mr-3"></span>
            Address Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-label">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                className="input-field"
                placeholder="Enter street address"
                value={formData.address.street}
                onChange={handleChange}
                autoComplete="street-address"
              />
            </div>

            <div>
              <label className="form-label">
                City
              </label>
              <input
                type="text"
                name="address.city"
                className="input-field"
                placeholder="Enter city"
                value={formData.address.city}
                onChange={handleChange}
                autoComplete="address-level2"
              />
            </div>

            <div>
              <label className="form-label">
                State
              </label>
              <input
                type="text"
                name="address.state"
                className="input-field"
                placeholder="Enter state"
                value={formData.address.state}
                onChange={handleChange}
                autoComplete="address-level1"
              />
            </div>

            <div>
              <label className="form-label">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                className="input-field"
                placeholder="Enter ZIP code"
                value={formData.address.zipCode}
                onChange={handleChange}
                autoComplete="postal-code"
              />
            </div>

            <div>
              <label className="form-label">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                className="input-field"
                placeholder="Enter country"
                value={formData.address.country}
                onChange={handleChange}
                autoComplete="country"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="card-premium p-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="icon-alert-circle mr-3"></span>
            Emergency Contact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                className="input-field"
                placeholder="Enter contact name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                className="input-field"
                placeholder="e.g., Spouse, Parent"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">
                Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyContact.phone"
                className="input-field"
                placeholder="Enter contact phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="btn btn-outline flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex-1 sm:flex-none flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner w-5 h-5 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create Employee</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;