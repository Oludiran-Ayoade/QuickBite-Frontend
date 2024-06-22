import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; 
import { useAuth } from '../context/auth';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface ProductDetailsPageProps {
  userId: string;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ( ) => {
  const { id } = useParams<{ id?: string }>();
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';

  const dispatch = useDispatch(); // Initialize useDispatch hook

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await axios.get(`https://quickbite-backend-1-w5az.onrender.com/auth/getproducts/${productId}`);
      setProduct(response.data.product);
      fetchRelatedProducts(response.data.product.category, productId);
    } catch (error) {
      // console.error('Error fetching product:', error);
    }
  };

  const fetchRelatedProducts = async (category: string, productId: string) => {
    try {
      const response = await axios.get(`https://quickbite-backend-1-w5az.onrender.com/auth/getproductsrelated?category=${category}`);
      const filteredProducts = response.data.products.filter((relatedProduct: Product) => relatedProduct._id !== productId);
      const limitedProducts = filteredProducts.slice(0, 4);
      setRelatedProducts(limitedProducts);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async (productId: string, quantity: number, userId: string) => {
    try {
      if (userId) {
        await axios.post('https://quickbite-backend-1-w5az.onrender.com/auth/addtocart', { productId, quantity, userId }, { headers: { 'x-user-id': userId } });
        toast.success(`${product?.name} added to cart successfully`)
        dispatch(addToCart({ _id: productId, name: product?.name || '', price: product?.price || 0, quantity })); // Dispatch addToCart action
      }
    } catch (error) {
      // console.error('Error adding product to cart:', error);
      toast.error('Error adding product to cart')
    }
  };

  return (
    <>
      <Header />
      <div className="product-details-page">
        {product && (
          <div className="product-details shadow">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className='flex_text'> 
              <h1>{product.name}</h1>
              <h4>{product.description}</h4>
              <h3>Price: ${product.price}</h3>
              <button onClick={() => handleAddToCart(product._id, 1, userId)}>Add to Cart</button>
            </div>
          </div>
        )}
        <div className="related-products">
          <h2>You may also like</h2>
          <div className="product-list">
            {relatedProducts.map((relatedProduct) => (
              <div className="product-card product_product pt-2 shadow">
              <Link key={relatedProduct._id} to={`/productdetails/${relatedProduct._id}`} style={{ textDecoration: 'none'}}>
              <img src={relatedProduct.image} alt={relatedProduct.name} className="product-image" /> 
              <h3>{relatedProduct.name}</h3>
              <p>{relatedProduct.description}</p>
              <p>Price: ${relatedProduct.price}</p>
              <button onClick={() => handleAddToCart(relatedProduct._id, 1, userId)}>Add to Cart</button>
              </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
