// Importing the React package
import React, { useEffect, useState } from 'react';
// Importing styles
import Styles from './HomePage_styles.module.css';
// Importing the mui components
import { Button, Container } from '@mui/material';
//Importing relevent components
import NavBarComponent from '../../components/navbar/NabarBar';
import DashboardBanner from '../../components/dashboardBanner/DashboardBanner';
import TrendingProducts from '../../components/trendingProducts/TrendingProductsContainer';
import HomePageStories from '../../components/homePageStories/HomePageStories';
import DashboardFooter from '../../components/dashboardFooter/DashboardFooter';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../utils/apiUrl';
import ProductCategories from '../../components/ProductCategories/ProductCategories';

const HomePage: React.FC = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const getUserProfile = async () => {
      // Define the API endpoint URL
      const apiUrl = `${api}/user`;
      // Get the token from the cookie
      const token = Cookies.get('token');

      // Set up Axios headers with the token
      const headers = { Authorization: `${token}` };

      axios
        .get(apiUrl, { headers })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getUserProfile();
  }, [0]);

  return (
    <Container
      sx={{ marginBottom: '5em', paddingLeft: '0px', paddingRight: '0px' }}
      maxWidth={false}
    >
      <NavBarComponent user={user} />
      <DashboardBanner />
      <ProductCategories />
      <HomePageStories />
      <Container sx={{ marginTop: '2em' }}>
        <TrendingProducts />
      </Container>
      <hr className={Styles.hr} />
      <DashboardFooter />
    </Container>
  );
};

export default HomePage;
