import React, { useEffect, useState } from 'react';
import Styles from './product_catelogy_filter_style.module.css';
import { Typography } from '@mui/material';
import { AiFillCaretRight } from 'react-icons/ai';
import api from '../../utils/apiUrl';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
function ProductCatelogFilter(props: any) {
  interface Product {
    averageRating: number;
    category: string[];
    createdAt: string;
    description: string;
    images: string[];
    name: string;
    price: {
      value: number;
      currency: string;
      _id: string;
    };
    stock: number;
    tags: string[];
    totallReviews: number;
    variants: any[]; // You can define a more specific interface for variants if needed
    __v: number;
    _id: string;
  }

  const [categories, setCategories] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  useEffect(() => {
    const getProducts = async () => {
      // Define the API endpoint URL
      const apiUrl = `${api}/product/categories`;
      // Get the token from the cookie
      const token = Cookies.get('token');
      // Set up Axios headers with the token
      const headers = { Authorization: `${token}` };
      console.log('going tro run fast');

      axios
        .get(apiUrl, { headers })
        .then(response => {
          console.log('res' + response);
          setCategories(response.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getProducts();
  }, [0]);

  const getFilteredProducts = async () => {
    // Define the API endpoint URL
    const apiUrl = `${api}/product/filter`;
    const urlWithQuery = `${apiUrl}?minPrice=10&maxPrice=2220&category=Electronics`;

    // Get the token from the cookie
    const token = Cookies.get('token');
    // Set up Axios headers with the token
    const headers = { Authorization: `${token}` };
    // axios POST request
    const options = {
      url: urlWithQuery,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${token}`,
      },
    };

    axios(options).then(response => {
      props.setProducts(response.data.data);
    });
  };

  const filteredCategories = categories.filter(
    category => category !== props.currentCategory,
  );
  console.log(filteredCategories);

  return (
    <div>
      <div className={Styles.categorieList}>
        <ol>
          <li>{props.currentCategory}</li>
          {categories == undefined
            ? undefined
            : filteredCategories.map((elements: any, index: any) => {
                return (
                  <Link
                    to={`/category/${elements}`}
                    className={Styles.listItemLink}
                    key={index}
                  >
                    <li key={index} className={Styles.categorieListItems}>
                      {elements}
                    </li>
                  </Link>
                );
              })}
        </ol>
      </div>
      <hr className={Styles.hr} />
      <div className={Styles.filterArea}>
        <Typography variant="h6" className="textPara" sx={{ fontSize: '17px' }}>
          Price
        </Typography>
        <div className={Styles.priceFilter}>
          <input
            value={minPrice}
            onChange={(e: any) => setMinPrice(e.target.value)}
            type="number"
            name=""
            id=""
            placeholder="Min"
          />
          <Typography className={Styles.dashed}>-</Typography>
          <input
            value={maxPrice}
            onChange={(e: any) => setMaxPrice(e.target.value)}
            type="number"
            name=""
            id=""
            placeholder="Max"
          />
          <button className={Styles.btn} onClick={getFilteredProducts}>
            <AiFillCaretRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCatelogFilter;
