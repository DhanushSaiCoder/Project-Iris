import React, { useEffect, useState, useMemo } from 'react';
import PageLoading from "../components/common/PageLoading";
import axios from 'axios';
import Fuse from 'fuse.js';
import styles from './UserManagementPage.module.css';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleChangeLoading, setRoleChangeLoading] = useState({}); // New state for individual role change loading
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // You can adjust this value

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
        setRoleChangeLoading(prev => ({ ...prev, [userId]: true }));
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/role`, { role: newRole });
            setUsers(users.map(user => (user._id === userId ? { ...user, role: newRole } : user)));
        } catch (err) {
            console.error("Failed to update user role", err);
        } finally {
            setRoleChangeLoading(prev => ({ ...prev, [userId]: false }));
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <PageLoading />;
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
                        {currentItems.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} disabled={roleChangeLoading[user._id]}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="developer">Developer</option>
                                    </select>
                                    {roleChangeLoading[user._id] && <LoadingSpinner />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.Pagination}>
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? styles.ActivePage : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default UserManagementPage;