import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
    id: number;
    username: string;
    role: string;
}

const DatabaseManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/admin/users`,
                newUser,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('User added successfully');
            fetchUsers();
            setNewUser({ username: '', password: '', role: '' });
        } catch (error) {
            toast.error('Failed to add user');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Database Management</h2>
            
            {/* Add User Form */}
            <form onSubmit={handleAddUser} className="mb-4">
                <div className="row">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="security">Security</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-primary">Add User</button>
                    </div>
                </div>
            </form>

            {/* Users Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {/* Add delete handler */}}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatabaseManager; 