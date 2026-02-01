import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeCard = ({ employee, onDelete }) => {
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'terminated':
        return 'badge-danger';
      default:
        return 'badge-success';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDelete(employee);
    }
  };

  return (
    <div className="employee-card animate-fade-in-up">
      <div className="employee-card-header">
        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-4">
          {employee.profilePicture ? (
            <img
              src={employee.profilePicture}
              alt={employee.name}
              className="employee-card-picture"
            />
          ) : (
            <div className="employee-card-placeholder">
              <span>{employee.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div>
            <h3 className="employee-card-title">{employee.name}</h3>
            <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="employee-card-body">
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone}</p>
        <p><strong>Employee ID:</strong> {employee.employeeId}</p>
        <p><strong>Salary:</strong> ₹{employee.salary?.toLocaleString('en-IN')}</p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Link 
          to={`/employees/edit/${employee._id}`}
          className="btn btn-secondary flex-1"
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          className="btn btn-error flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;