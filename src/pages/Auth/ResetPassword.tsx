import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';


const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailFromStorage, setEmailFromStorage] = useState<string>('');
  const [otpFromStorage, setOtpFromStorage] = useState<string>('');
 
  useEffect(() => {
    const email = localStorage.getItem('resetEmail');
    const otp = localStorage.getItem('resetOTP');
    if (email && otp) {
      setEmailFromStorage(email);
      setOtpFromStorage(otp);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (values: any) => {
    const { newPassword, confirmNewPassword } = values;

    try {
      const response = await axios.post(
        'https://quickbite-backend-1-w5az.onrender.com/auth/reset-password',
        { email: emailFromStorage, otp: otpFromStorage, newPassword, confirmNewPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { success, message } = response.data;

      if (success) {
        toast.success(message);
        navigate('/signin');
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      // console.error('Error resetting password:', error.response?.data?.message);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const validationSchema = yup.object({
    newPassword: yup.string().min(8, 'Password should be at least 8 characters').required('New password is required'),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Confirm New Password is required'),
  });

  return (
    <>
      <Header />
      <div className='col-7 pt-12 col-lg-6 mx-auto p-5 mt-5 shadow rounded-5'>
        <h1 className='text-center text-orange'>Reset Password</h1>
        <Formik
          initialValues={{ newPassword: '', confirmNewPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter new password'
              className='form-control border-2 w-50 mx-auto rounded-5'
              name='newPassword'
            />
            <ErrorMessage name='newPassword' component='div' className='text-danger' />

            <Field
              type={showPassword ? 'text' : 'password'}
              placeholder='Confirm new password'
              className='form-control border-2 w-50 mx-auto mt-2 rounded-5'
              name='confirmNewPassword'
            />
            <ErrorMessage name='confirmNewPassword' component='div' className='text-danger' />

            <button type='button' onClick={togglePasswordVisibility} className='btn btn-success-orange-login' style={{width: '70px', marginLeft:'20px' }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>

            <button type='submit' className='btn btn-success-orange-login' style={{marginLeft: '110px', marginTop: '10px'}}>
              Reset
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default ResetPassword;
