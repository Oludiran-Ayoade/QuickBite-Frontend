import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { toast, ToastContainer } from 'react-toastify';


const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');

  const url = 'http://localhost:3001/auth/forgot-password';
 

  const sendOTP = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    try {
      const response = await axios.post(
        url,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { success, message } = response.data;
    
      if (success) {
        toast.success(message);
        navigate('/verify-otp', { state: { email } });
        localStorage.setItem('resetEmail', email);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      <Header  />
      <div className='col-7 pt-12 col-lg-6 mx-auto p-5 mt-5 shadow rounded-5'>
        <h1 className='text-center text-orange mt-5'>Forgot Password</h1>
        <input
          style={{ width: '400px' }}
          type='text'
          placeholder='Enter your E-Mail'
          className='form-control border-2 rounded-5'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={sendOTP} className='btn btn-success-orange-login mt-2'>
          Send OTP
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;
