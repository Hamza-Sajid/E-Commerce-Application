import React, { useEffect, useState } from 'react';

import { Container, Box, Typography } from '@mui/material';
import NavBarComponent from '../../components/navbar/NabarBar';
import ProductCatelogFilter from '../../components/productCatelogFilter/ProductCatelogFilter';
import Styles from './category_product.module.css';
//Icons
import { GrAdd } from 'react-icons/gr';
import AddIcon from '@mui/icons-material/Add';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../utils/apiUrl';
import Cookies from 'js-cookie';

function CategoryProduct() {
  const { categoryName } = useParams();

  interface Product {
    name: string;
    price: number;
  }
  const [product, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    const fetchData = () => {
      // Define the API endpoint URL
      const apiUrl = `${api}/user`;
      // Get the token from the cookie
      const token = Cookies.get('token');

      // Set up Axios headers with the token
      const headers = { Authorization: `${token}` };
      // axios GET request
      const options = {
        url: 'http://localhost:3000/product/categories/' + categoryName,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `${token}`,
        },
      };

      axios(options)
        .then(response => {
          setProducts(response.data.data);
          console.log(response);

          // setCandidates(response.data);
          // dispath(sucessOnFetchingCandidatesData(response.data));
        })
        .catch(error => {
          console.log(error);
          // dispath(errorFetchingCandidatesData(e));
        });
    };

    fetchData();
  }, [categoryName]);

  return (
    <Container
      sx={{ marginBottom: '5em', paddingLeft: '0px', paddingRight: '0px' }}
      maxWidth={false}
    >
      <NavBarComponent user={user} />
      <Container
        style={{ paddingLeft: '0px', paddingRight: '0px' }}
        className={Styles.container}
        maxWidth={false}
      >
        <div className={Styles.filterBox}>
          <ProductCatelogFilter
            currentCategory={categoryName}
            product={product}
            setProducts={setProducts}
          />
        </div>

        <div className={Styles.productBox}>
          <Typography variant="h5" className="textHeading">
            {`${categoryName} Products`}
          </Typography>
          {/*All product container */}
          <div className={Styles.productContainer}>
            {product != undefined
              ? product.map((product: any, index: any) => {
                  return (
                    <Link
                      to={`/product/${product._id}`}
                      className={Styles.productNavLink}
                      key={index}
                    >
                      <div>
                        <button className={Styles.addCartBtn}>
                          <span>
                            <AddIcon className={Styles.addBtn} />
                          </span>
                          <span>Add</span>
                        </button>
                        <img
                          height={150}
                          width={150}
                          src={product?.images[0]}
                          alt=""
                        />
                        <div className={Styles.priceContainer}>
                          <div className={Styles.mainPrice}>
                            <p>$</p>
                            <p>{product.price.value}</p>
                            <p>00</p>
                          </div>
                        </div>
                        <div className={Styles.productName}>
                          <p>{product.name}</p>
                          <span>18ct</span>
                        </div>
                        <div className={Styles.stockArea}>
                          <svg
                            data-testid="inventory_high_icon_custom"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            fill="C7C8CD"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="8"
                              y="16.5"
                              width="8"
                              height="3"
                              rx="1.5"
                              fill="green"
                              fillOpacity="0.7"
                            ></rect>
                            <rect
                              x="5.5"
                              y="10.5"
                              width="13"
                              height="3"
                              rx="1.5"
                              fill="green"
                              fillOpacity="0.8"
                            ></rect>
                            <rect
                              x="3"
                              y="4.5"
                              width="18"
                              height="3"
                              rx="1.5"
                              fill="green"
                            ></rect>
                          </svg>
                          <span className={Styles.stockText}>
                            Many in stock
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              : undefined}
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default CategoryProduct;
