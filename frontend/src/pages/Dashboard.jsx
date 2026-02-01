import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI, handleApiError } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch statistics and recent employees
      const [statsResponse, employeesResponse] = await Promise.all([
        employeeAPI.getStats(),
        employeeAPI.getAll({ limit: 5, page: 1 })
      ]);

      setStats(statsResponse.data.data);
      setRecentEmployees(employeesResponse.data.data.employees);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-cards">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          <h3 className="error-title">Error Loading Dashboard</h3>
          <p className="error-message">{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.overview?.totalEmployees || 0,
      icon: 'users',
      gradient: 'gradient-primary',
      change: `+${stats?.overview?.recentHires || 0} this month`,
      animation: 'animate-fade-in-up',
      delay: '0s'
    },
    {
      title: 'Active Employees',
      value: stats?.overview?.activeEmployees || 0,
      icon: 'check-circle',
      gradient: 'gradient-success',
      change: 'Currently working',
      animation: 'animate-fade-in-up',
      delay: '0.1s'
    },
    {
      title: 'Departments',
      value: stats?.departmentStats?.length || 0,
      icon: 'office-building',
      gradient: 'gradient-secondary',
      change: 'Active departments',
      animation: 'animate-fade-in-up',
      delay: '0.2s'
    },
    {
      title: 'Recent Hires',
      value: stats?.overview?.recentHires || 0,
      icon: 'clock',
      gradient: 'gradient-warning',
      change: 'Last 30 days',
      animation: 'animate-fade-in-up',
      delay: '0.3s'
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header fade-in-down">
        <h1 className="dashboard-title typewriter">
          Dashboard
        </h1>
        <p className="dashboard-subtitle fade-in-up">
          Welcome to your employee management system overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`stat-card hover-lift hover-glow ${card.animation}`}
            style={{ animationDelay: card.delay }}
          >
            <div className="stat-card-content">
              <div className={`stat-icon ${card.gradient}`}>
                <span className={`icon-${card.icon}`}></span>
              </div>
              <div className="stat-info">
                <p className="stat-value">{card.value}</p>
                <p className="stat-change">{card.change}</p>
              </div>
            </div>
            <h3 className="stat-title">{card.title}</h3>
            
            {/* Animated Progress Bar */}
            <div className="progress-bar">
              <div 
                className={`progress-fill ${card.gradient}`}
                style={{ 
                  width: `${Math.min((card.value / 100) * 100, 100)}%`,
                  animationDelay: `${0.5 + index * 0.1}s`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Department Statistics */}
        <div className="content-card animate-fade-in-up">
          <div className="card-header">
            <h2 className="card-title">Department Overview</h2>
            <span className="icon-chart-bar"></span>
          </div>
          
          <div className="department-list">
            {stats?.departmentStats?.slice(0, 6).map((dept, index) => (
              <div 
                key={index} 
                className="department-item fade-in-right"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="department-info">
                  <h4 className="department-name">{dept._id}</h4>
                  <p className="department-salary">
                    Avg Salary: ₹{dept.avgSalary?.toLocaleString('en-IN') || 0}
                  </p>
                </div>
                <div className="department-stats">
                  <span className="employee-count">{dept.count}</span>
                  <p className="count-label">employees</p>
                </div>
                
                {/* Animated Bar */}
                <div className="department-bar">
                  <div 
                    className="bar-fill gradient-primary"
                    style={{ width: `${(dept.count / Math.max(...(stats?.departmentStats?.map(d => d.count) || [1]))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/employees" className="view-all-link">
            View All Employees →
          </Link>
        </div>

        {/* Recent Employees */}
        <div className="content-card animate-fade-in-up">
          <div className="card-header">
            <h2 className="card-title">Recent Employees</h2>
            <span className="icon-users"></span>
          </div>
          
          <div className="employee-list">
            {recentEmployees.length > 0 ? (
              recentEmployees.map((employee, index) => (
                <div 
                  key={employee._id} 
                  className="employee-item fade-in-up"
                  style={{ animationDelay: `${1.0 + index * 0.1}s` }}
                >
                  <div className="employee-avatar-section">
                    {employee.profilePicture ? (
                      <img
                        src={employee.profilePicture}
                        alt={employee.name}
                        className="employee-card-picture"
                      />
                    ) : (
                      <div className="employee-avatar gradient-primary">
                        <span className="avatar-text">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="employee-info">
                    <h4 className="employee-name">{employee.name}</h4>
                    <p className="employee-position">{employee.position}</p>
                  </div>
                  <div className="employee-status">
                    <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                      {employee.status}
                    </span>
                    <p className="employee-department">{employee.department}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state bounce-in">
                <span className="icon-user-add"></span>
                <p className="empty-text">No employees found</p>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <Link to="/employees/add" className="action-button primary">
              <span className="icon-user-add"></span>
              Add Employee
            </Link>
            <Link to="/employees" className="action-button outline">
              <span className="icon-users"></span>
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions animate-fade-in-up">
        <h2 className="section-title">
          <span className="icon-trending-up"></span>
          Quick Actions
        </h2>
        <div className="actions-grid">
          <Link to="/employees/add" className="quick-action-card success animate-fade-in-up">
            <div className="action-icon gradient-success">
              <span className="icon-user-add"></span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Add New Employee</h3>
              <p className="action-description">Create employee record</p>
            </div>
          </Link>
          
          <Link to="/employees" className="quick-action-card secondary animate-fade-in-up">
            <div className="action-icon gradient-secondary">
              <span className="icon-users"></span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Manage Employees</h3>
              <p className="action-description">View and edit records</p>
            </div>
          </Link>
          
          <button onClick={fetchDashboardData} className="quick-action-card primary animate-fade-in-up">
            <div className="action-icon gradient-primary">
              <span className="icon-refresh"></span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Refresh Data</h3>
              <p className="action-description">Update dashboard</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;