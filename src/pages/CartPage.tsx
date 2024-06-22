import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { removeFromCart, setFilteredCartItems } from '../redux/cartSlice';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2'
import Footer from '../components/Footer';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
}


const CartPage: React.FC = () => {
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';
  const firstName = user?.firstName;
  const email = user?.email;
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const cart = useSelector((state: any) => state.cart.filteredCartItems || []);
  // console.log(cart);
    

  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`https://quickbite-backend-1-w5az.onrender.com/auth/getcart/${userId}`);
      const rawCartItems: CartItem[] = response.data.cart || [];
      const filteredCartItems = rawCartItems.filter(item => item.quantity > 0);
      dispatch(setFilteredCartItems(filteredCartItems));
      calculateGrandTotal(filteredCartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const removeCartItem = async (productId: string) => {
    try {
      await axios.post(`https://quickbite-backend-1-w5az.onrender.com/auth/removefromcart`, { userId, productId });
      dispatch(removeFromCart(productId)); 
      fetchCart(); 
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const calculateGrandTotal = (cartItems: CartItem[]) => {
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setGrandTotal(total);
  };

  const adjustQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 0) {
      newQuantity = 0;
    }

    try {
      const updatedCart = cart.map((item: CartItem, i: number) =>
        i === index ? { ...item, quantity: newQuantity } : item
      );
      dispatch(setFilteredCartItems(updatedCart)); // Update cart items in Redux store
      calculateGrandTotal(updatedCart);

      if (newQuantity === 0) {
        await removeCartItem(updatedCart[index]._id);
      } else {
        await axios.post('https://quickbite-backend-1-w5az.onrender.com/auth/updatecart', {
          userId,
          productId: String(updatedCart[index]._id),
          quantity: newQuantity,
        });
      }
    } catch (error) {
      // console.error('Error updating cart quantity:', error);
    }
  };
 

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement) as any ,
      });

      if (paymentMethodReq.error) {
        // console.error('Error creating payment method:', paymentMethodReq.error);
        return;
      }

      const paymentIntentReq =
       await axios.post('https://quickbite-backend-1-w5az.onrender.com/auth/checkout', {
        userId,
        amount: grandTotal * 100,
        paymentMethodId: paymentMethodReq.paymentMethod?.id,
        return_url: 'http://localhost:5173/',
        cart,
        firstName,
        email
      });
     // console.log(paymentIntentReq);
     
      if (paymentIntentReq) {
        // console.log(paymentIntentReq.data.message);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment Successful!",
          confirmButtonColor: "green",
        });
      }
      
      setLoading(false);
      // const confirmPayment = await stripe.confirmCardPayment(paymentIntentReq.data.paymentIntent.client_secret, {
      //   payment_method: paymentMethodReq.paymentMethod?.id,
      // });

      // if (confirmPayment.error) {
      //   console.error('Error confirming payment:', confirmPayment.error);
      // } else {
      //   console.log('Payment successful:', confirmPayment.paymentIntent);
      // }
    } catch (error) {
      setLoading(false);
      // console.error('Error processing payment:', error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Payment not Successful!",
        confirmButtonColor: "red",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="cart-page">
        <h1>Checkout</h1>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart && cart.length > 0 ? (
              cart.map((item: CartItem, index: number) => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.name} width="50" height="50" /></td>
                  <td>{item.name}</td>
                  <td>#{item.price.toLocaleString()}</td>
                  <td>
                    <button onClick={() => adjustQuantity(index, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => adjustQuantity(index, item.quantity + 1)}>+</button>
                  </td>
                  <td>#{item.quantity * item.price}</td>
                  <td>
                    <button onClick={() => removeCartItem(item._id)}>Remove</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}><h3>No items in cart</h3></td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="total-cost">
          <h2>Grand Total: #{(grandTotal).toLocaleString()}</h2>
            <form onSubmit={handlePayment}>
              <CardElement className="StripeElement"/>
              <button type="submit" disabled={loading} style={{ position: 'relative' }}>
              {loading && <div className="spinner" />}  {!loading && 'Pay'}
             </button>
            </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
