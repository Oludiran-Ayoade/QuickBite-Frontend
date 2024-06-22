import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../context/auth';
import { toast, ToastContainer } from 'react-toastify';


const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const url = 'https://quickbite-backend-1-w5az.onrender.com/auth/signin';
  const signin = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    try {
      const response = await axios.post(
        url,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const { status, token, user, message } = response.data;
    
      if (!status) {
        // console.log('Login failed:', message);
        toast.error(message); 
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        login(user, token); // Pass the token to the login function from useAuth
        toast.success('Login successful'); // Notify user of successful login

        if (user.role === 1) {
          // Admin Sign-in
          navigate('/admin');
        } else {
          // Regular User Sign-in
          navigate('/');
        }
      }
    } catch (error: any) {
      // console.error('Error:', error.response?.data?.message);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      <Header />
      <div className='col-7 pt-12 col-lg-6 mx-auto p-5 mt-5 shadow rounded-5'>
        <h1 className='text-center text-orange mt-5'>Sign In</h1>
        <input
          style={{ width: '400px' }}
          type='text'
          placeholder='Enter your E-Mail'
          className='form-control border-2 rounded-5'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ width: '400px' }}
          type='password'
          placeholder='Enter your Password'
          className='form-control border-2 mt-2 rounded-5'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signin} className='btn btn-success-orange-login mt-2'>
          Sign In
        </button>
        <Link style={{color: '#d98e03' }} to='/forgotpassword'> <p className='text-center text-orange' style={{fontSize: '15px'}}>forgot password?</p> </Link>
      </div>
      <div style={{ marginTop: '15px', marginLeft: '450px' }}>
        <h6 className='m-1 already'>
          You don't have an Account?{' '}
          <Link to='/signup'>
            <button className='btn' style={{ width: '120px', height: '30px' , marginTop: '-10px', marginLeft: '-30px', textDecoration: 'underline', color: '#d98e03'}}>
              Sign Up
            </button>
          </Link>
        </h6>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignInPage;
