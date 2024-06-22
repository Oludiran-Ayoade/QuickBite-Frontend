import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  conpassword: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  
  const validationSchema = yup.object({
    firstName: yup.string().required('FirstName is required!'),
    lastName: yup.string().required('LastName is required!'),
    email: yup.string().email('Invalid email').required('Email is required!'),
    password: yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
    conpassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      conpassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const url = 'http://localhost:3001/auth/signup';

     await axios.post(url, values)
        .then((res) => {
          if (res.data.status) {
            toast.success("Account Successfully Created");
            setTimeout(() => navigate('/signin'), 5000);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.message);
        });
    },
  });

  const [showPass, setShowPass] = useState(false);

  const show = () => {
    setShowPass(true);
  };

  const hide = () => {
    setShowPass(false);
  };

  return (
    <>
    <Header />
      <div className='col-2 pt-5 col-sm-6 mt-4 mx-auto p-5 shadow rounded-5' style={{ height: '515px' }}>
      <h1 className='text-center text-orange mb-3'>Sign Up </h1>
        <form action='' onSubmit={formik.handleSubmit}>
          <input type="text" placeholder='firstName' className='form-control border-2 rounded-5' style={{ width: '400px' }} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName} name="firstName" />
          <p className='text-danger'>{formik.touched.firstName && formik.errors.firstName}</p>

          <input type="text" placeholder='lastName' className='mt-3 form-control border-2 rounded-5' style={{ width: '400px' }} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName} name="lastName" />
          <p className='text-danger'>{formik.touched.lastName && formik.errors.lastName}</p>

          <input type="text" placeholder='Email' className='mt-3 form-control border-2 rounded-5' style={{ width: '400px' }} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} name="email" />
          <p className='text-danger'>{formik.touched.email && formik.errors.email}</p>

          <input type={showPass ? "text" : "password"} className='mt-3 form-control border-2 rounded-5' style={{ width: '400px' }} placeholder='Password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} name="password" />
          <p className='text-danger'>{formik.touched.password && formik.errors.password}</p>

          <input type={showPass ? "text" : "password"} className='mt-3 form-control border-2 rounded-5' style={{ width: '400px' }} placeholder='Confirm Password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.conpassword} name="conpassword" />
          <p className='text-danger'>{formik.touched.conpassword && formik.errors.conpassword}</p>

          {showPass ? <button onClick={hide} className='btn btn-primary-orange d-flex mt-1' type='button'>Hide</button> : <button onClick={show} className='btn btn-primary-orange d-flex mt-1' type='button'>Show</button>}

          <button type="submit" className='btn btn-success-orange col-5 mt-3'> Sign Up </button>
        </form>

        <div className='d-flex mx-auto mt-5'><p className='ms-2 mt-5 already'>already have an account? </p> <Link to='/signin' className='mt-5 already'> Sign In </Link></div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default SignUpPage;
