import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const User = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'No token found. Please login again.',
          showConfirmButton: false,
          timer: 2000,
        });
        navigate('/login'); // Navigate to login page if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:4200/api/admin/appUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });

        if (!response.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Session expired. Please login again!',
            showConfirmButton: false,
            timer: 2000,
          });
          navigate('/Login');
          return;
        }

        const responseData = await response.json();
        setUsers(responseData);
      } catch (err) {
        console.error('Error fetching users:', err);
        alert("Failed to load users.");
      }
    };

    fetchUsers(); // Initial fetch
    const interval = setInterval(fetchUsers, 5000); // Polling

    return () => clearInterval(interval); // Clean up
  }, [navigate]); // Include navigate in dependency array

  return (
    <div className="container py-4" style={{ marginTop: '5rem' }}>
      <div className="row">
        {users.map((user) => (
          <div key={user.id} className="col-12 col-sm-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm text-center p-3">
              <div className="card-body p-0">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">📧 {user.email}</p>
                <p className="card-text">📞 {user.nomber}</p>
                <p className="card-text">💰 Balance: {user.balance}</p>
                <p className="card-text">💰 userid: {user._id}</p>
                <p className="card-text">🕒 Last login: {user.lastlogindt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
