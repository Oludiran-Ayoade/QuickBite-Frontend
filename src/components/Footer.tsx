import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container shadow-lg">
        <div className="footer-info">
          <h1 className='text-center mt-4'>Contact Us</h1>
          <p>Bodija, Ibadan City, Nigeria</p>
          <p>Email: oludiranayoade.com</p>
          <p>Phone: +234 706 060 1254</p>
        </div>
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 QuickBite. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
