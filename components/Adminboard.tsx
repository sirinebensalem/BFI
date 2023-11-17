import React, { useState, useEffect } from 'react';
import { User } from '../interfaces';
import toast from 'react-hot-toast';

const UserBoard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/auth/Users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdateRole = async (newRole: string, index: number) => {
        const updatedUsers = [...users];
        updatedUsers[index].role = newRole;
        setUsers(updatedUsers);

        const userToUpdate = users[index];
        try {
            setLoading(true);
            const res = await fetch('/api/auth/updateUserRole', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userToUpdate.id,
                    newRole: newRole,
                }),
            });

            if (res.ok) {
                toast.success(`Successfully updated the role!`);
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.error(`An error occurred while updating the role.`);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteUser = async (userId: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/auth/updateUserRole?id=${userId}`, {
                method: 'DELETE',
            });
    
            if (res.ok) {
                toast.success(`User deleted successfully!`);
                // Remove the deleted user from the local state
                setUsers(users.filter(user => user.id !== userId));
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(`An error occurred while deleting the user.`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
<div className="container mx-auto p-4">
    <table className="min-w-full bg-[#6e6e6e27] border rounded-lg overflow-hidden">
        <thead className="bg-transparent">
            <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Current Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-[#6e6e6e2d]' : 'bg-transparent'}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <select
                            value={user.role}
                            onChange={(e) =>
                                handleUpdateRole(e.target.value, index)
                            }
                            className="border rounded p-1"
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="RH">RH</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 bg-red  border-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-md"
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

export default UserBoard;
