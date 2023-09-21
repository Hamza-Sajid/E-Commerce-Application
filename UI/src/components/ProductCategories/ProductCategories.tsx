// Importing the react file
import React from 'react';

// Importing the mui component
import { Box, Container, Typography } from '@mui/material';

// Importing the css
import Styles from './product_category_style.module.css';

// Importing the imagees
import Dairy from '../../assets/Dairy.jpeg';
import Fruits from '../../assets/Fruits.jpg';
import Meat from '../../assets/Meat.jpeg';
import Beverages from '../../assets/Beverages.webp';
import Beauty from '../../assets/Beauty.jpg';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function ProductCategories() {
  // Stores data to loop
  const categories = [
    {
      name: 'Dairy',
      picture: Dairy,
      status: 'delivery',
    },
    {
      name: 'Fruits',
      picture: Fruits,
      status: 'delivery',
    },
    {
      name: 'Meat',
      picture: Meat,
      status: 'delivery',
    },
    {
      name: 'Beverages',
      picture: Beverages,
      status: 'delivery',
    },
    {
      name: 'Beauty',
      picture: Beauty,
      status: 'delivery',
    },
  ];
  return (
    <Container sx={{ marginTop: '1.5em' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          className="textHeading"
          sx={{ display: 'inline' }}
        >
          Choose your category in{' '}
        </Typography>
        <Typography
          variant="h4"
          className="textHeading"
          sx={{ display: 'inline', color: '#0AAD0A' }}
        >
          Gulberg Green Islamabad
        </Typography>
      </Box>
      <Container className={Styles.storeContainer}>
        {categories.map((value, index) => {
          return (
            <Link
              to={`category/${value.name}`}
              key={index}
              className={Styles.navLinks}
            >
              <Box className={Styles.storesList}>
                <Box>
                  <img width={60} src={value.picture} alt="" />
                </Box>
                <Box sx={{ padding: '1em' }}>
                  <Typography variant="h6" className="textHeading2">
                    {value.name}
                  </Typography>

                  <Typography variant="caption" className="textHeading2">
                    Delivery within 45 mins
                  </Typography>
                </Box>
              </Box>
            </Link>
          );
        })}
      </Container>
    </Container>
  );
}

export default ProductCategories;
