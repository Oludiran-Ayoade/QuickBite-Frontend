import React, { useRef, useEffect} from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { OnCalling, CallingSuccessful, CallingError} from '../redux/ApiRedux';
import { RootState } from '../redux/store';
import { useAuth } from '../context/auth';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number; 
}

const ProductsPage: React.FC<{ id?: string }> = ({ id }) => {
  let dispatch = useDispatch();

  let ApiState = useSelector((state: RootState) => state.ApiRedux.allloaded);
  // console.log("ApiState:", { ...ApiState });

  // const [products, setProducts] = useState<Product[]>([]);
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(OnCalling());
      const response = await axios.get<{ products: Product[] }>('http://localhost:3001/auth/getproducts');
      dispatch(CallingSuccessful(response.data.products));
      // setProducts(response.data.products);
    } catch (error: any) {
      dispatch(CallingError(error.message));
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = async (productId: string, quantity: number, userId: string) => {
    try {
      await axios.post('http://localhost:3001/auth/addtocart', { productId, quantity, userId }, { headers: { 'x-user-id': userId } });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && divRef.current) {
      divRef.current.id = id;
    }
  }, [id]);

  return (
    <>
    <div ref={divRef}>
    <h1 className='text-center' style={{color: 'white', marginTop: '7px', marginBottom: '15px'}}>Menu</h1>
    <h1 className='food_menu text-center mt-2'>Menu</h1>
    <div  className="product-list mainproduct_card">
      {ApiState.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          userId={userId}
          onAddToCart={(productId: string, quantity: number) => handleAddToCart(productId, quantity, userId)}
        />
      ))}
    </div>
    </div>
    </>
  );
};

export default ProductsPage;
