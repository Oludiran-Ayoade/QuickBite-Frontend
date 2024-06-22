import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  addToCart } from '../redux/cartSlice'; 
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number; 
}

interface ProductCardProps {
  product: Product;
  userId: string;
  onAddToCart: (productId: string, quantity: number, userId: string) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userId }) => {
  const dispatch = useDispatch();
  // const cartItems = useSelector((state: any) => state.cart.cartItems as CartItem[]);
  // console.log(cartItems);
  

  const handleAddToCart = async () => {
    try {
      if (product.stock > 0) {
        await axios.post('http://localhost:3001/auth/addtocart', { productId: product._id, quantity: 1, userId });
        dispatch(addToCart({ _id: product._id, name: product.name, price: product.price, quantity: 1 }));
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error('Product is out of stock!');
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <>
    <div className="product-card product_product shadow-lg">
      <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
        <img src={product.image} alt={product.name} className="product-image shadow-lg" />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: #{product.price}</p>
      </Link>
      <button className="btn-add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
    </div>
    <Toaster />
    </>
  );
};

export default ProductCard;

