import React, { useEffect, useState } from 'react';
import { Container } from '@mui/system';
import {
  Box,
  InputLabel,
  MenuItem,
  Modal,
  Rating,
  Select,
  Typography,
} from '@mui/material';
import NavBarComponent from '../../components/navbar/NabarBar';
import Styles from './product_details.module.css';
import { BsArrowLeftShort, BsStarFill } from 'react-icons/bs';
import { AiFillInfoCircle, AiOutlineHeart } from 'react-icons/ai';
import { TfiMenuAlt } from 'react-icons/tfi';
import { LuVerified } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/apiUrl';
import Cookies from 'js-cookie';
import axios from 'axios';
import ProductComments from '../../components/productComment/ProductComments';
import { Line } from 'rc-progress';
import { useCartContext } from '../../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function ProductDeatils() {
  interface Product {
    _id: string;
    name: string;
    description: string;
    price: {
      value: number;
      currency: string;
      _id: string;
    };
    averageRating: number;
  }

  interface User {
    _id: string;
    username: string;
  }

  interface ProductComment {
    createdAt: string;
    createdByUser: string;
    description: string;
    rating: number;
    title: string;
    _id: string;
  }

  const { setTotalCartItem } = useCartContext();

  const { productId } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(1);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [images, setImages] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [user, setUser] = useState<User>();
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = useState<number | null>(2);
  const [commentTitle, setCommentTitle] = useState('');
  const [commentDescription, setCommentDescription] = useState('');
  const [productPostedComments, setProductPostedComments] = useState<
    ProductComment[]
  >([]);
  const [productStarRating, setProductStarRating] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Method to handle the success msg
  const notify = () => {
    toast.success('Comment Posted', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

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
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getUserProfile();
  }, [0]);

  const handleChange = (event: any) => {
    setStock(event.target.value);
  };

  useEffect(() => {
    const fetchData = () => {
      // Define the API endpoint URL
      const apiUrl = `${api}/product`;
      // Get the token from the cookie
      const token = Cookies.get('token');

      // Set up Axios headers with the token
      const headers = { Authorization: `${token}` };
      // axios GET request
      const options = {
        url: `${apiUrl}/${productId}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `${token}`,
        },
      };

      axios(options)
        .then(response => {
          setProductDetails(response.data.data);
          setThumbnailImage(response.data.data.images[0]);
          setImages(response.data.data.images);
        })
        .catch(error => {
          console.log(error);
          // dispath(errorFetchingCandidatesData(e));
        });
    };

    fetchData();
  }, []);

  const addToCart = async () => {
    // axios POST request
    const options = {
      url: 'http://localhost:3000/cart',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      data: {
        userId: user?._id,
        productId: productId,
        quantity: stock,
      },
    };

    axios(options).then(response => {
      if (response.status == 200) {
        setTotalCartItem(prevCount => prevCount + stock);
      }
      console.log(response);
    });
  };

  const submitComment = async () => {
    // axios POST request
    const options = {
      url: 'http://localhost:3000/user/comment',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      data: {
        productId: productId,
        rating: rating,
        title: commentTitle,
        description: commentDescription,
        createdByUser: user?.username,
      },
    };

    axios(options).then(response => {
      if (response.status == 200 || response.status == 201) {
        notify();
        window.location.reload();
      }
    });
  };
  // Fetch product comments using the API route
  const fetchProductComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/comment/${productId}`,
      );
      console.log(response);
      setProductPostedComments(response.data);

      // notify();
      // setOpen(false);
    } catch (error) {
      console.error('Error fetching product comments:', error);
      return [];
    }
  };

  const fetchProductStarRating = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/comment/star/${productId}`,
      );
      setProductStarRating(response.data);
    } catch (error) {
      console.error('Error fetching product comments:', error);
      return [];
    }
  };
  useEffect(() => {
    fetchProductComments();
    fetchProductStarRating();
  }, [0]);
  return (
    <Container
      sx={{ marginBottom: '5em', paddingLeft: '0px', paddingRight: '0px' }}
      maxWidth={false}
    >
      <ToastContainer />
      <NavBarComponent user={user} />
      <Container className={Styles.container} maxWidth={false}>
        <Box
          className={Styles.navigationArea}
          onClick={() => {
            navigate(-1);
          }}
        >
          <BsArrowLeftShort className={Styles.arrowIcon} />
          <Typography className="textHeading">Back</Typography>
        </Box>
        <div className={Styles.productContainer}>
          <div className={Styles.productSection}>
            <div className={Styles.productMainImg}>
              <img src={thumbnailImage} alt="" />
            </div>

            <div className={Styles.productDiscription}>
              <h2>{productDetails?.name}</h2>
              <span>20 lbs</span>

              <h6>Details</h6>
              <p>{productDetails?.description}</p>
              <div className={Styles.productImgList}>
                {images.map((element, index) => {
                  return (
                    <div
                      onClick={() => setThumbnailImage(element)}
                      className={Styles.productImgListItem}
                      key={index}
                    >
                      <img src={element} alt="" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={Styles.productCart}>
            <div className={Styles.productCartContainer}>
              <h2>${productDetails?.price.value}</h2>
              <h4>Free Delivery</h4>
              <div className={Styles.productStockIcon}>
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
                <span>Many in stock</span>
              </div>
              <div className={Styles.productCartInput}>
                <Select
                  id="demo-simple-select"
                  value={stock}
                  defaultValue={1}
                  onChange={handleChange}
                  className={Styles.productCartInputText}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
                <button onClick={addToCart}>Add To Cart</button>
              </div>

              <div className={Styles.productCartSave}>
                <div className={Styles.productCartSaveItem}>
                  <AiOutlineHeart className={Styles.productCartSaveItemIcon} />
                  <h5>Save</h5>
                </div>

                <div className={Styles.productCartSaveItem}>
                  <TfiMenuAlt className={Styles.productCartSaveItemIcon} />
                  <h5>Add to list</h5>
                </div>
              </div>
            </div>
            <div className={Styles.productCartFooter}>
              <div className={Styles.productCartFooterIcon}>
                <LuVerified />
              </div>
              <div className={Styles.productCartFooterHeading}>
                <h5> 100% satisfiction guranteed</h5>
              </div>
              <div className={Styles.productCartFooterIcon2}>
                <AiFillInfoCircle />
              </div>
            </div>

            <div className={Styles.productCartFooterPara}>
              <p>Place your order with peace of mind.</p>
            </div>
          </div>
        </div>
      </Container>
      <hr
        style={{
          background: '#E8E9EB',
          border: 'none',
          height: '1px',
          width: '92%',
          margin: 'auto',
        }}
      />

      {/* COMMENT SECTION */}
      <div>
        <div className={Styles.mainContainer}>
          {/* ---- REVIEW SECTION ----- */}
          <div className={Styles.reviewContainer}>
            <div className={Styles.reviewHeading}>
              <div style={{ width: '80%' }}>
                <h4>Review</h4>
              </div>

              <div className={Styles.addReviewButton}>
                <button onClick={handleOpen}>Add Review</button>
              </div>
              {/* ~~~~  MODAL CODE  ~~~~*/}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className={Styles.modalContainer}>
                  <h4 className="textHeading">Overall Rating</h4>
                  <Rating
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    // onChange={}
                    className={Styles.productRating}
                  />
                  <div className={Styles.ratingInput}>
                    <label className="textPara" htmlFor="">
                      Review Title
                    </label>
                    <input
                      value={commentTitle}
                      onChange={e => setCommentTitle(e.target.value)}
                      placeholder="Easy to use"
                      type="text"
                      name=""
                      id=""
                    />

                    <label
                      style={{ marginTop: '1.5em' }}
                      className="textPara"
                      htmlFor=""
                    >
                      Product Review
                    </label>
                    <textarea
                      value={commentDescription}
                      onChange={e => setCommentDescription(e.target.value)}
                      name=""
                      id=""
                      placeholder="Since i bough this a month ago, it made my life really easy , i would reccomend you guys as well"
                    ></textarea>

                    <div
                      className={Styles.ratingInputButton}
                      style={{ display: 'block', margin: 'auto' }}
                    >
                      <button onClick={submitComment}>Submit Review</button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </div>

            <div>
              <div className={Styles.reviewSection}>
                {productPostedComments != undefined ||
                productPostedComments != null ? (
                  productPostedComments?.map((element, index) => {
                    return (
                      <>
                        <Rating
                          value={element?.rating}
                          readOnly={true}
                          size="small"
                        />
                        <h4>{element?.title}</h4>
                        <h6>Reviewd by {element?.createdByUser}</h6>
                        <p>{element?.description}</p>
                      </>
                    );
                  })
                ) : (
                  <h2>No comment for now</h2>
                )}
              </div>
            </div>
          </div>
          {/* ------ RATING SECTION -------  */}
          <div className={Styles.ratingContainer}>
            <h4>Customer Review</h4>

            <h5>Average Rating: {productDetails?.averageRating.toFixed(1)} </h5>

            <div className={Styles.ratingList}>
              <div className={Styles.ratingListItem}>
                <h5>5 </h5>
                <BsStarFill style={{ color: 'FFBE1D', display: 'inline' }} />
                <Line
                  strokeLinecap={'round'}
                  percent={productStarRating[4] * 10}
                  strokeWidth={2}
                  strokeColor="#FFBE1D"
                  trailColor="#E8E9Eb"
                  style={{ height: '0.40em' }}
                />
                <h5 style={{ color: 'gray' }}>{productStarRating[4]}</h5>
              </div>
              <div className={Styles.ratingListItem}>
                <h5>4 </h5>
                <BsStarFill style={{ color: 'FFBE1D', display: 'inline' }} />
                <Line
                  strokeLinecap={'round'}
                  percent={productStarRating[3] * 10}
                  strokeWidth={2}
                  strokeColor="#FFBE1D"
                  trailColor="#E8E9Eb"
                  style={{ height: '0.40em' }}
                />
                <h5 style={{ color: 'gray' }}>{productStarRating[3]}</h5>
              </div>
              <div className={Styles.ratingListItem}>
                <h5>3 </h5>
                <BsStarFill style={{ color: 'FFBE1D', display: 'inline' }} />
                <Line
                  strokeLinecap={'round'}
                  percent={productStarRating[2] * 10}
                  strokeWidth={2}
                  strokeColor="#FFBE1D"
                  trailColor="#E8E9Eb"
                  style={{ height: '0.40em' }}
                />
                <h5 style={{ color: 'gray' }}>{productStarRating[2]}</h5>
              </div>
              <div className={Styles.ratingListItem}>
                <h5>2 </h5>
                <BsStarFill style={{ color: 'FFBE1D', display: 'inline' }} />
                <Line
                  strokeLinecap={'round'}
                  percent={productStarRating[1] * 10}
                  strokeWidth={2}
                  strokeColor="#FFBE1D"
                  trailColor="#E8E9Eb"
                  style={{ height: '0.40em' }}
                />
                <h5 style={{ color: 'gray' }}>{productStarRating[1]}</h5>
              </div>
              <div className={Styles.ratingListItem}>
                <h5>1 </h5>
                <BsStarFill style={{ color: 'FFBE1D', display: 'inline' }} />
                <Line
                  strokeLinecap={'round'}
                  percent={productStarRating[0] * 10}
                  strokeWidth={2}
                  strokeColor="#FFBE1D"
                  trailColor="#E8E9Eb"
                  style={{ height: '0.40em' }}
                />
                <h5 style={{ color: 'gray' }}>{productStarRating[0]}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ProductDeatils;
