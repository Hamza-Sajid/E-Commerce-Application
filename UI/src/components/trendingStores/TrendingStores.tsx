// Importing the react file
import React from 'react';

// Importing the mui component
import { Box, Container, Typography } from '@mui/material';

// Importing the css
import Styles from './trending_product_style.module.css';

function TrendingStores() {
  // Stores data to loop
  const stores = [
    {
      name: 'Shopistan',
      picture:
        'https://i.pinimg.com/originals/c7/91/14/c7911473aab5fc77a12de155eb4ab651.jpg',
      status: 'delivery',
    },
    {
      name: 'Beats',
      picture:
        'https://penji.co/wp-content/uploads/2019/06/target-online-store-logo.jpg',
      status: 'delivery',
    },
    {
      name: 'Shopify',
      picture:
        'https://logos-world.net/wp-content/uploads/2020/11/Shopify-Logo.png',
      status: 'delivery',
    },
    {
      name: 'Disney',
      picture: 'https://logonoid.com/images/disney-store-logo.jpg',
      status: 'delivery',
    },
    {
      name: 'Realme',
      picture: 'https://static.c.realme.com/IN/thread/1457643467692908544.jpg',
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
          Choose your store in{' '}
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
        {stores.map((value, index) => {
          return (
            <>
              <Box className={Styles.storesList}>
                <Box>
                  <img width={60} src={value.picture} alt="" />
                </Box>

                <Box sx={{ padding: '1em' }}>
                  <Typography variant="h6" className={Styles.storeTitle}>
                    {value.name}
                  </Typography>

                  <Typography variant="caption" className={Styles.caption}>
                    Delivery by 7:15
                  </Typography>
                </Box>
              </Box>
            </>
          );
        })}
      </Container>
    </Container>
  );
}

export default TrendingStores;
