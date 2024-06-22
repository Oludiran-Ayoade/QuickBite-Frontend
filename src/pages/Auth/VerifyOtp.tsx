import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { toast, ToastContainer } from 'react-toastify';


const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOTP] = useState<string>('');
  const [timer, setTimer] = useState<number>(60); // Timer in seconds (changed to 60)
  const { email }: { email: string } = location.state || { email: '' }; // Get email from location state


  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const verifyOTP = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    try {
      const response = await axios.post(
        https://quickbite-backend-1-w5az.onrender.com/auth/verify-otp',
        { email, userOTP: otp },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { success, message } = response.data;

      if (success) {
        toast.success(message);
        localStorage.setItem('resetOTP', otp);
        navigate('/reset-password', { state: { email } });
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data?.message);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <>
      <Header />
      <div className='col-7 pt-12 col-lg-6 mx-auto p-5 mt-5 shadow rounded-5'>
        <h1 className='text-center text-orange mt-5'>Verify OTP</h1>
        <p className='text-center text-orange' style={{ fontSize: '15px' }}>Enter the OTP sent to <br /> {email}</p>
        <input
          style={{ width: '400px' }}
          type='text'
          placeholder='Enter OTP'
          className='form-control border-2 rounded-5'
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />
        {timer > 0 ? (
          <p className='text-center text-danger'>Time remaining: {timer} seconds</p>
        ) : (
          <p className='text-center text-danger'>OTP has expired</p>
        )}
        <button onClick={verifyOTP} className='btn btn-success-orange-login mt-2'>
          Verify OTP
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default VerifyOtp;
