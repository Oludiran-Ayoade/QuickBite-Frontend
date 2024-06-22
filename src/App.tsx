import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/Auth/SignUpPage';
import SignInPage from './pages/Auth/SignInPage';
import PageNotFound from './pages/PageNotFound';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProducts from './pages/Admin/AddProducts';
import UpdateProduct from './pages/Admin/UpdateProduct';
import VerifyOTP from './pages/Auth/VerifyOtp';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AllUsers from './pages/Admin/AllUsers'
import OrderList from './pages/Admin/OrderList';
import { useAuth } from './context/auth';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={ <SignUpPage />} />
      <Route path="/signin" element={  <SignInPage />} />
      <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/signin" replace />} />
      <Route path="/allusers" element={isAuthenticated ? <AllUsers /> : <Navigate to="/signin" replace />} />
      <Route path="/orders" element={isAuthenticated ? <OrderList /> : <Navigate to="/signin" replace />} />
      <Route path="/addproducts" element={isAuthenticated ? <AddProducts /> : <Navigate to="/signin" replace />} />
      <Route path="/updateproducts" element={isAuthenticated ? <UpdateProduct /> : <Navigate to="/signin" replace />} />
      <Route path="/forgotpassword" element={<ForgotPassword /> } />
      <Route path="/verify-otp" element={<VerifyOTP /> } />
      <Route path="/productdetails/:id" element={<ProductDetailsPage userId={''}/>} />
      <Route path="/reset-password" element={<ResetPassword /> } />
      <Route path="/cartpage" element={isAuthenticated ? <CartPage /> : <Navigate to="/signin" replace />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
