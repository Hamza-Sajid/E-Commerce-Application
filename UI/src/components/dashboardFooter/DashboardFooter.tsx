import React from 'react';
// Importing the MUI
import { Box, Container, Typography } from '@mui/material';
// Importing the styles files
import Styles from './dashboard_footer_style.module.css';

function DashboardFooter() {
  return (
    <Container maxWidth={false} className={Styles.container}>
      <Box className={Styles.leftContainer}>
        <Box className={Styles.logoSection}>
          <Box className={Styles.img}>
            <img
              src="https://www.instacart.com/assets/footer/2022/carrot-footer-acffa90f16b04b4ec635f507baed133cdf562058823c3e517b7d7d9a9742fd84.svg"
              alt="logo"
            />
          </Box>
          <Box className={Styles.text}>
            <p>Get deliveries with Instacart</p>
          </Box>
        </Box>

        <Box className={Styles.mobileApps}>
          <Box>
            <img
              src="https://www.instacart.com/assets/footer/iOS-9e2130394aab134afa35db75591ebc77b932b77950bae0c2f5407dc0ca0553bd.svg"
              alt=""
            />
            <p style={{ display: 'inline' }}>IOS</p>
          </Box>
          <Box>
            <img
              src="https://www.instacart.com/assets/footer/play-store-7c8b5dbea57e5d80b812b1ef33eb4beeaf94f01cd3bbe30e74523b4df74fcee1.svg"
              alt=""
            />
            <p style={{ display: 'inline' }}>Android</p>
          </Box>
        </Box>
      </Box>

      <Box className={Styles.navLinks}>
        <Box className={Styles.menuContainer}>
          <Typography variant="h6" className="textHeading">
            Top Departments
          </Typography>
          <Box className={Styles.list}>
            <ol>
              <li>Fresh products</li>
              <li>Dairy products</li>
              <li>Meat</li>
              <li>Seafood</li>
              <li>Asian Groceries</li>
            </ol>
          </Box>
        </Box>

        <Box className={Styles.menuContainer}>
          <Typography variant="h6" className="textHeading">
            More Departments
          </Typography>
          <Box className={Styles.list}>
            <ol>
              <li>Non-Alchaholic</li>
              <li>Froozen</li>
              <li>Beverages</li>
              <li>Organic Grocery</li>
              <li>Household Essentials</li>
              <li>Latin Groceries</li>
            </ol>
          </Box>
        </Box>

        <Box className={Styles.menuContainer}>
          <Typography variant="h6" className="textHeading">
            Intacart Program
          </Typography>
          <Box className={Styles.list}>
            <ol>
              <li>Instacart+</li>
              <li>Instacart Business</li>
              <li>Fresh Funds</li>
              <li>Gift Cards</li>
              <li>Promos & Coupons</li>
              <li>Grocery Budget Calculator</li>
            </ol>
          </Box>
        </Box>

        <Box className={Styles.menuContainer}>
          <Typography variant="h6" className="textHeading">
            Get to know us
          </Typography>
          <Box className={Styles.list}>
            <ol>
              <li>Press</li>
              <li>Career</li>
              <li>Blog</li>
              <li>Ideas & Guides</li>
              <li>Shop By Location</li>
              <li>Convenience Store Near Me</li>
            </ol>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default DashboardFooter;
