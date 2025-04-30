import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';
import Loader from "../Loader";
import { setUserLogged } from '../../auth';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all fields',
      });
      return;
    }
    setLoading(true);
    const formData = { username, password };
    try {
      const response = await fetch('http://localhost:4200/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const responseData = await response.json();
      setUserLogged(responseData);
      // alert("Login successful!");
      Swal.fire({
        icon: 'success',
        title: 'Logged in successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        setLoading(false);
        navigate('/User');
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: 'auto', marginTop: '7rem', marginBottom: '3rem' }}>
      <div className="card-body">
        <div className="animate form login_form" style={{ background: 'azure', padding: '10px' }}>
          <section className="login_content">
            <form onSubmit={handleSubmit}>
              <h1 style={{ textAlign: 'center' }}>Login Form</h1>
              <div>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                  }}
                ></i>
              </div>
              <div>
                <div className="row mt-2">
                  <div className="col-md-4 mt-2">
                    <button type="submit" className="width-35 btn btn-success" disabled={loading}>
                      <i className="ace-icon fa fa-key"></i>
                      <span className="bigger-110">Login</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Login;
