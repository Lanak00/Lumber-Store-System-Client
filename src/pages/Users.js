import React, { useState, useEffect } from 'react';
import UserItem from '../components/user/UserItem';
import AdminRegistrationForm from '../components/user/AdminRegistrationForm';
import classes from '../components/orders/MyOrdersPage.module.css'; // Import the styles for users page
import buttonStyles from '../components/products/AllProductsPage.module.css'; // Import button styles

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('clients');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userRole = getUserRoleFromToken(token);
  const apiUrl = `https://localhost:7046/api/User`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data.filter(user => user.userRole === 2)); // Default to clients
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [apiUrl, token]);

  const handleAddUserClick = () => setIsFormOpen(true);

  const handleCloseForm = () => {
    setIsFormOpen(false); // Re-fetch users to update the list after a new user is added
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilteredUsers(
      users.filter(user => {
        if (tab === 'clients') return user.userRole === 1;
        if (tab === 'employees') return user.userRole === 0;
        if (tab === 'administrators') return user.userRole === 2;
        return false;
      })
    );
  };

  return (
    <div className={classes.ordersPage}>
      <div className={classes.tabs}>
        <span
          onClick={() => handleTabChange('employees')}
          className={`${classes.tab} ${activeTab === 'employees' ? classes.active : ''}`}
        >
          Zaposleni
        </span>
        <span
          onClick={() => handleTabChange('clients')}
          className={`${classes.tab} ${activeTab === 'clients' ? classes.active : ''}`}
        >
          Klijenti
        </span>
        <span
          onClick={() => handleTabChange('administrators')}
          className={`${classes.tab} ${activeTab === 'administrators' ? classes.active : ''}`}
        >
          Administratori
        </span>
      </div>

      <div className={classes.ordersContainer}>
        {filteredUsers.map(user => (
          <UserItem user={user} key={user.id} />
        ))}
      </div>

      {(userRole === 'Administrator') && (
        <button className={buttonStyles.addProductButton} onClick={handleAddUserClick}>
          +
        </button>
      )}

      {isFormOpen && (
        <AdminRegistrationForm onClose={handleCloseForm} />
      )}
    </div>
  );
}

// Helper function to extract the user role from the JWT token
const getUserRoleFromToken = (token) => {
  if (!token) return null; // Check if the token is null or undefined
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (error) {
    console.error("Error parsing token:", error);
    return null; // Return null if token parsing fails
  }
};

export default UsersPage;
