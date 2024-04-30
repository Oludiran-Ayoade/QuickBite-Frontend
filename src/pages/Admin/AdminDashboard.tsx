import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import Footer from "../../components/Footer";

const AdminDashboard: React.FC = () => {
    const { auth, isAuthenticated  } = useAuth();
    const navigate = useNavigate(); 

      // Redirect to sign-in page if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin'); // Redirect to sign-in page
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    // Return null to prevent rendering the rest of the component when not authenticated
    return null;
  }

  return (
    <>
    <Header />
    <div className="container">
      <h1 className="text-orange mt-5">Admin Dashboard</h1>
      <div className="container-fluid p-3 dash_col">
          <div className="col-sm-1 column_width">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin_col_a" >
            <div className="card w-70 p-4 shadow-lg rounded-5"  style={{border: "2px solid #d98e03", marginLeft: "150px"}}>
              <h3 className='text-orange'> Admin Name : {auth?.user?.firstName}</h3>
              <h3 className='text-orange'> Admin LastName : {auth?.user?.lastName}</h3>
              <h3 className='text-orange'> Admin Email : {auth?.user?.email}</h3>
            </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AdminDashboard;
