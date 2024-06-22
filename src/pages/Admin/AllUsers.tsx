import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalSpent: number;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('https://quickbite-backend-1-w5az.onrender.com/auth/getallusers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
    <Header />
    <div className='alluser'>
      <h2>User Information</h2>
      <table className='user-table'>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td># {user.totalSpent.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default UserTable;
