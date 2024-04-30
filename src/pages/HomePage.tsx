import React from 'react';
import Header from '../components/Header';
import HeroSection from './HeroSection';
import ProductsPage from './ProductsPage';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const handleExploreMenuClick = () => {
    const productsPage = document.getElementById('productsPage');
    if (productsPage) {
      productsPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <HeroSection onExploreMenuClick={handleExploreMenuClick} />
      <ProductsPage id="productsPage"  />
      <Footer />
    </>
  );
};

export default HomePage;
