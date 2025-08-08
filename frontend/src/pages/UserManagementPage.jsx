import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import styles from './UserManagementPage.module.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const fuseOptions = {
        keys: [
            "fullName",
            "email"
        ],
        threshold: 0.3, // Adjust as needed for fuzziness
    };

    const fuse = useMemo(() => new Fuse(users, fuseOptions), [users, fuseOptions]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        return fuse.search(searchTerm).map(result => result.item);
    }, [searchTerm, users, fuse]);

    if (loading) return <div className={styles.UserManagementPage}>Loading...</div>;
    if (error) return <div className={styles.UserManagementPage}>Error: {error.message}</div>;

    return (
        <div className={styles.UserManagementPage}>
            <h1 className={styles.Title}>User Management</h1>
            <input
                type="text"
                placeholder="Search by name or email..."
                className={styles.SearchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                        {filteredUsers.map(user => (
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