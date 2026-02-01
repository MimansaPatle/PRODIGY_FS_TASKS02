import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, handleApiError } from '../services/api';
import EmployeeCard from '../components/EmployeeCard';
import { useToast } from '../context/ToastContext';

const EmployeeList = () => {
  const { showSuccess, showError } = useToast();
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAPI.getAll(filters);
      setEmployees(response.data.data.employees);
      setPagination(response.data.data.pagination);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (employee) => {
    try {
      await employeeAPI.delete(employee._id);
      showSuccess(`Employee ${employee.name} deleted successfully!`);
      fetchEmployees();
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  // CSV Export functionality
  const exportToCSV = async () => {
    try {
      // Get all employees for export (no pagination)
      const response = await employeeAPI.getAll({ ...filters, limit: 1000, page: 1 });
      const allEmployees = response.data.data.employees;
      
      // Create CSV content
      const headers = [
        'Employee ID',
        'Name',
        'Email',
        'Phone',
        'Position',
        'Department',
        'Salary',
        'Status',
        'Join Date',
        'Street Address',
        'City',
        'State',
        'ZIP Code',
        'Country',
        'Emergency Contact Name',
        'Emergency Contact Relationship',
        'Emergency Contact Phone'
      ];
      
      const csvContent = [
        headers.join(','),
        ...allEmployees.map(emp => [
          emp.employeeId || '',
          `"${emp.name || ''}"`,
          emp.email || '',
          emp.phone || '',
          `"${emp.position || ''}"`,
          emp.department || '',
          emp.salary || '',
          emp.status || '',
          emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : '',
          `"${emp.address?.street || ''}"`,
          emp.address?.city || '',
          emp.address?.state || '',
          emp.address?.zipCode || '',
          emp.address?.country || '',
          `"${emp.emergencyContact?.name || ''}"`,
          emp.emergencyContact?.relationship || '',
          emp.emergencyContact?.phone || ''
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`CSV file exported successfully! (${allEmployees.length} employees)`);
      
    } catch (error) {
      const errorMessage = 'Failed to export employee data';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  // PDF Export functionality
  const exportToPDF = async () => {
    try {
      // Get all employees for export
      const response = await employeeAPI.getAll({ ...filters, limit: 1000, page: 1 });
      const allEmployees = response.data.data.employees;
      
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Employee Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1E3C72; }
            .report-title { font-size: 18px; color: #666; margin-top: 5px; }
            .report-date { font-size: 14px; color: #999; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #1E3C72; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .status-active { color: #22C55E; font-weight: bold; }
            .status-inactive { color: #F59E0B; font-weight: bold; }
            .status-terminated { color: #EF4444; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">PRODIGY Employee System</div>
            <div class="report-title">Employee Report</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              ${allEmployees.map(emp => `
                <tr>
                  <td>${emp.employeeId || ''}</td>
                  <td>${emp.name || ''}</td>
                  <td>${emp.email || ''}</td>
                  <td>${emp.position || ''}</td>
                  <td>${emp.department || ''}</td>
                  <td class="status-${emp.status?.toLowerCase() || ''}">${emp.status || ''}</td>
                  <td>₹${emp.salary?.toLocaleString('en-IN') || ''}</td>
                  <td>${emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Total Employees: ${allEmployees.length}</p>
            <p>Report generated by PRODIGY Employee Management System</p>
          </div>
        </body>
        </html>
      `;
      
      // Open in new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      
      showSuccess(`PDF report generated successfully! (${allEmployees.length} employees)`);
      
    } catch (error) {
      const errorMessage = 'Failed to generate PDF report';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
  const statuses = ['Active', 'Inactive', 'Terminated'];

  if (isLoading && employees.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p className="text-gray-600 mt-4">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 animate-fade-in-down">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Employees
          </h1>
          <p className="text-gray-600">
            Manage your employee records and information
          </p>
        </div>
        <div className="flex items-center gap-6">
          {/* Export Buttons */}
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="btn btn-outline flex items-center justify-center gap-2"
              title="Export to CSV"
            >
              <span className="icon-download"></span>
              CSV
            </button>
            <button
              onClick={exportToPDF}
              className="btn btn-outline flex items-center justify-center gap-2"
              title="Export to PDF"
            >
              <span className="icon-document"></span>
              PDF
            </button>
          </div>
          <Link
            to="/employees/add"
            className="btn btn-primary"
          >
            Add Employee
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card-premium p-6 mb-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">
              Search
            </label>
            <input
              type="text"
              placeholder="Search employees..."
              className="input-field"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div>
            <label className="form-label">
              Department
            </label>
            <select
              className="form-select"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">
              Status
            </label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">
              Per Page
            </label>
            <select
              className="form-select"
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error animate-fade-in">
          <p>{error}</p>
        </div>
      )}

      {/* Employee Grid */}
      {employees.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {employees.map((employee, index) => (
              <div
                key={employee._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EmployeeCard 
                  employee={employee} 
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="card p-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {((pagination.currentPage - 1) * pagination.limit) + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalEmployees)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalEmployees}</span>{' '}
                  results
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="btn btn-outline"
                    style={{ opacity: !pagination.hasPrevPage ? 0.5 : 1 }}
                  >
                    ← Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`btn ${page === pagination.currentPage ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn btn-outline"
                    style={{ opacity: !pagination.hasNextPage ? 0.5 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 animate-bounce-in">
          <div className="text-6xl mb-4">
            👥
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first employee.</p>
          <Link to="/employees/add" className="btn btn-primary">
            ➕ Add Employee
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;