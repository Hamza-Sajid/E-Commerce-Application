// Importing the react
import React, { useEffect, useState } from 'react';
// Importing css files
import Styles from './trending_product_style.module.css';
// Importing the mui components
import { Container, Typography, Box, Rating, Button } from '@mui/material';
// Importing a static image file
import ProductImg1 from '../../assets/product1.png';
import api from '../../utils/apiUrl';
import Cookies from 'js-cookie';
import axios from 'axios';
import NoImg from '../../assets/no_img.jpg';
import { Link } from 'react-router-dom';
interface Product {
  name: string;
  price: number;
}

const TrendingProducts: React.FC = () => {
  const [product, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      // Define the API endpoint URL
      const apiUrl = `${api}/product/trending`;
      // Get the token from the cookie
      const token = Cookies.get('token');

      // Set up Axios headers with the token
      const headers = { Authorization: `${token}` };
      axios
        .get(apiUrl, { headers })
        .then(response => {
          console.log(response);
          setProducts(response.data.trendingProducts);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getProducts();
  }, [0]);
  console.log(product);
  return (
    <div>
      <Typography
        variant="h5"
        className="textHeading"
        textAlign={'center'}
        sx={{ fontWeight: 'bold', fontSize: '29px', marginBottom: '24px' }}
      >
        Trending Products
      </Typography>
      <Container
        sx={{
          display: 'flex',
          gap: '2em',
          marginTop: '1em',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {product != undefined
          ? product?.map((element: any, index: any) => {
              let imgSrc = '';
              if (element.images != undefined) {
                imgSrc = element?.images[0];
              } else {
                imgSrc = NoImg;
              }
              return (
                <Link
                  to={`/product/${element._id}`}
                  key={index}
                  style={{ textDecoration: 'none', color: 'unset' }}
                >
                  <Box className={Styles.cardContainer}>
                    <Box className={Styles.card}>
                      <img src={imgSrc} alt="" width={'150'} />
                    </Box>
                    <Container
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1em',
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {element.name}{' '}
                      </Typography>
                      {/* <Typography sx={{ fontWeight: 'bold' }}>{element.price.value} </Typography> */}
                    </Container>

                    <Container sx={{ marginTop: '0.5em', width: '100%' }}>
                      <Typography variant="caption">
                        {element.description.slice(0, 42)}...
                      </Typography>
                    </Container>

                    <Container
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.5em',
                      }}
                    >
                      <Rating
                        name="customized-icons"
                        defaultValue={0}
                        value={element?.averageRating}
                        max={5}
                        sx={{ color: '#09A944', fontSize: '1.2em' }}
                        readOnly={true}
                      />
                      <Typography
                        variant="caption"
                        style={{ fontSize: '1.2em' }}
                      >
                        ${element?.price?.value}
                      </Typography>
                    </Container>

                    <Container sx={{ marginTop: '1em' }}>
                      <Button className={Styles.btn} variant="outlined">
                        View Product
                      </Button>
                    </Container>
                  </Box>
                </Link>
              );
            })
          : undefined}
      </Container>
    </div>
  );
};

export default TrendingProducts;
