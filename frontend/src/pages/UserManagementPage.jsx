import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserManagementPage.module.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`);
                setUsers(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/role`, { role: newRole });
            setUsers(users.map(user => (user._id === userId ? { ...user, role: newRole } : user)));
        } catch (err) {
            console.error("Failed to update user role", err);
        }
    };

    if (loading) return <div className={styles.UserManagementPage}>Loading...</div>;
    if (error) return <div className={styles.UserManagementPage}>Error: {error.message}</div>;

    return (
        <div className={styles.UserManagementPage}>
            <h1 className={styles.Title}>User Management</h1>
            <div className={styles.TableContainer}>
                <table className={styles.UserTable}>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="developer">Developer</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;