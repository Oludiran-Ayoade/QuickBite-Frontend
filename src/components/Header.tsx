import '../styles/Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
// import { CartState } from '../redux/cartSlice'
import { clearCart } from '../redux/cartSlice';

const Header:React.FC = () => {
  const dispatch = useDispatch();
  // let cartlength = useSelector((state: CartState )=>(state.cart))
  // console.log(cartlength);

  const filteredCartItems = useSelector((state: any) => state.cart.filteredCartItems || []);
  // console.log(filteredCartItems);
  
  
  const navigate = useNavigate()
  const { auth, logout } = useAuth();
 
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearCart()); 
    logout(); 
    navigate('/signin'); 
  };
  
  return (
    <>
      <div className='header_area'>
      <Link to='/' style={{textDecoration: 'none'}}><h2 className="site_name">QuickBite</h2></Link>
        {/* <div>
          <input type="text" placeholder='Search here' />
          <button className='btn btn-orange'> Search </button>
        </div> */}
        <ul>
          {/* <li><Link className='nav_link' to="/">Home</Link></li>
          <li><Link className='nav_link' to="/">Shop</Link></li> */}
          {auth.user ? (
            <>
            {auth.user.role === 1 && (
                <li>
                  <Link className='nav_link' to='/admin'>
                    Admin
                  </Link>
                </li>
              )}
              <div className='drop'>
      <Dropdown style={{marginLeft: '12px'}} className='drop_down'>
       <Dropdown.Toggle variant="success" id="dropdown-basic" className='drop_down_toggle' style={{background: '#d98e03', border: 'none', color: 'white'}}>
       <MdAccountCircle style={{height: '40px',fontSize: '35px'}} />
          Account
           </Dropdown.Toggle>
      <Dropdown.Menu style={{border: '2px solid #d98e03'}}>
        <Dropdown.Item onClick={handleLogout} style={{color: '#d98e03'}} className='drop_item'>Sign Out</Dropdown.Item>
          </Dropdown.Menu>
              </Dropdown>
              </div>
            </>
          ) : (
            <>
          <div className='drop'>
      <Dropdown style={{marginLeft: '12px'}} className='drop_down'>
       <Dropdown.Toggle variant="success" id="dropdown-basic" className='drop_down_toggle' style={{background: '#d98e03', border: 'none', color: 'white'}}>
       <MdAccountCircle style={{height: '30px',fontSize: '35px'}} />
          Account
           </Dropdown.Toggle>

      <Dropdown.Menu style={{border: '2px solid #d98e03'}}>
        <Dropdown.Item as={Link} to="/signin" style={{color: '#d98e03'}} className='drop_item'>Sign In</Dropdown.Item>
        <Dropdown.Item as={Link} to="/signup" style={{color: '#d98e03'}} className='drop_item'>Sign Up</Dropdown.Item>

          </Dropdown.Menu>
              </Dropdown>
              </div>
            </>
          )}
          {auth.user? (
            <>
            <Link to='/cartpage' style={{textDecoration: 'none'}}>
            <GiShoppingBag style={{color: 'white', fontSize: '35px', marginTop:'-5px'}} />
           <span style={{fontSize: '15px', color: '#d98e03'}} className='cart_num'><h3>{filteredCartItems.length}</h3></span> 
           </Link>
            </>
          ):(
            <></>
          )}
        
        </ul>
      </div>
    </>
  );
}

export default Header;
