import { useState, useEffect } from 'react';
import { getAllUsersAdmin, deleteUserAdmin, updateUserRoleAdmin } from '../api/Services';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersAdmin();
      setUsers(data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUserAdmin(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleChangeRole = async (id, currentRole) => {
    const roles = ['renter', 'owner', 'admin'];
    const newRole = window.prompt(
      `Change role for this user?\nCurrent: ${currentRole}\n\nEnter new role (renter/owner/admin):`,
      currentRole
    );

    if (!newRole || newRole === currentRole) return;

    if (!roles.includes(newRole.toLowerCase())) {
      toast.error('Invalid role. Use: renter, owner, or admin');
      return;
    }

    try {
      await updateUserRoleAdmin(id, newRole.toLowerCase());
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <Loader />;

  return (
    <div className="admin-users">
      <div className="container">
        
        {/* Header */}
        <div className="admin-page-header">
          <h1>◈ Users Management</h1>
          <p className="subtitle">Total Users: {users.length}</p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="renter">Renters</option>
            <option value="owner">Owners</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="no-data">
              <p>No users found</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleChangeRole(user._id, user.role)}
                          className="btn-change-role"
                          title="Change role"
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="btn-delete"
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminUsers;