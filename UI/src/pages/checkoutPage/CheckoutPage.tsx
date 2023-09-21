import React, { useEffect, useState } from 'react';
import SimpleNavbar from '../../components/simpleNavbar/SimpleNavbar';
import Styles from './checkout_page_style.module.css';
import { FaCar, FaLocationDot } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import api from '../../utils/apiUrl';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Modal } from '@mui/material';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe(
  'pk_test_51NkiTXDVBFckkCRa7ynNmXkG7kCjS79K7jGaQWpL4W1hOZSh7K7EGHMSlmV2nCQhbsYDbT43aN3lpqMQI07c3dRB0063pN82OF',
);

function CheckoutPage() {
  const location = useLocation();

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [paymentError, setPaymentError] = useState<string | undefined | null>(
    null,
  );
  const [paymentSuccess, setPaymentSuccess] = useState<
    string | undefined | null
  >(null);

  const [productNames, setProductNames] = useState();
  const [productsPrice, setProductsPrice] = useState<number | undefined | null>(
    null,
  );

  interface ProductData {
    map(
      arg0: (
        cartItem: any,
        index: any,
      ) => import('react/jsx-runtime').JSX.Element,
    ): React.ReactNode;
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
    totalReviews: number;
    variants: any[];
    __v: number;
    _id: string;
  }

  // Function to get all the names from our product list
  const extractProductNames = (data: any) => {
    // const products = data.cart.map(item => item.products[0].product);
    const products = data.cart.map((item: any, index: any) => {
      return item?.products[0]?.product;
    });
    console.log(products);
    const productNames = products.map((product: any, index: any) => {
      return product.name;
    });
    // const productNames = products.map(product => product.name);
    return productNames;
  };

  // Method to handle the success msg
  const notify = () => {
    toast.success('Product Removed', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  };

  // Get the price of all product at once

  const calculateTotalPrice = (data: any) => {
    let totalPrice = 0;

    data.cart.forEach((item: any, index: any) => {
      const product = item?.products[0].product;
      const productPrice = product.price.value;
      totalPrice += productPrice;
    });

    return totalPrice;
  };

  const [cartItems, setCartItems] = useState<ProductData>();
  const getCartItems = async () => {
    // const id = await props.user._id;
    // Define the API endpoint URL
    const apiUrl = `${api}/cart/${location?.state.userId}`;
    // Get the token from the cookie
    const token = Cookies.get('token');

    // Set up Axios headers with the token
    const headers = { Authorization: `${token}` };
    axios
      .get(apiUrl, { headers })
      .then(response => {
        console.log(response);
        setCartItems(response.data.cart);
        const productNames = extractProductNames(response.data);

        setProductNames(productNames);
        const totalPrice = calculateTotalPrice(response.data);
        console.log(totalPrice);
        setProductsPrice(totalPrice);
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCartItems();
  }, [0]);

  const handleRemoveItem = async (productId: any) => {
    console.log(productId);
    try {
      const response = await axios.delete(
        `${api}/cart/${location.state.userId}/remove/${productId}`,
      );
      console.log(response.data.message);
      if (response.status == 200) {
        notify();
      }
      getCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/cart/user/${location?.state.userId}`,
      );
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return; // Ensure stripe and elements are available
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      setPaymentError(error.message);
    } else {
      const response = await axios.post('http://localhost:3000/charge', {
        product: productNames,
        amount: productsPrice, // Amount in cents
        source: token.id,
        currency: 'usd',
        buyerId: location?.state.userId,
      });

      if (response.status === 200) {
        // Check if payment requires authentication
        if (response.data.requiresAction) {
          // Handle Payment Intent with additional authentication
          const result = await stripe.confirmCardPayment(
            response.data.clientSecret,
            {
              payment_method: {
                card: cardElement,
                // Include additional data if needed
              },
            },
          );

          if (result.error) {
            setPaymentError(result.error.message);
          } else if (result.paymentIntent.status === 'succeeded') {
            // setPaymentSuccess('Payment successful');
            // handleOpen()
            // setTimeout(() => {
            //     navigate("/")
            // }, 2500)
          }
        } else {
          handleOpen();
          setTimeout(() => {
            clearCart();
            navigate('/');
          }, 2500);
        }
      } else {
        alert('Payment failed , try again');
        // setPaymentError('Payment failed');
      }
    }
  };

  return (
    <div className={Styles.container}>
      <ToastContainer />
      <SimpleNavbar />

      <div className={Styles.detailsContainer}>
        <div className={Styles.orderInfo}>
          <div className={Styles.orderDetails}>
            <div className={Styles.orderDetailsLocation}>
              <div className={Styles.orderDetailsLocationImg}>
                <FaLocationDot />
              </div>
              <div className={Styles.orderDetailsLocationText}>
                <h4 className="">Delivery Address</h4>
                <label htmlFor="">Location</label>
                <input type="text" name="" placeholder="Gulberg isb" id="" />

                <label htmlFor="" style={{ marginTop: '1.5em' }}>
                  Zip-Code
                </label>
                <input type="text" name="" placeholder="77001" id="" />
              </div>
            </div>
          </div>
          {/* --------HR--------- */}
          <div className={Styles.hr}></div>

          <div className={Styles.deliveryLocationContainer}>
            <div className={Styles.deliveryLocationIcon}>
              <FaCar />
            </div>

            <div className={Styles.deliveryLocationInput}>
              <div className={Styles.deliveryLocationInputFields}>
                <div className={Styles.deliveryLocationInputFieldsHeading}>
                  <h2>Delivery Instructions</h2>
                </div>
                <div className={Styles.deliveryLocationInputFieldsText}>
                  <textarea></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* --------HR--------- */}
          <div className={Styles.hr}></div>

          <div className={Styles.cartContainer}>
            <div
              style={{ fontSize: '16px' }}
              className={Styles.deliveryLocationInputFieldsHeading}
            >
              <h3>Cart Items</h3>
            </div>

            <div className={Styles.productPriceContainer}>
              <div style={{ width: '40%' }}>
                <h5>Product</h5>
              </div>
              <div style={{ width: '15%' }}>
                <h5>Quantity</h5>
              </div>
              <div>
                <h5>Remove</h5>
              </div>
              <div>
                <h5>Price</h5>
              </div>
            </div>
            <hr className={Styles.cartHr} />

            {/* PRODUCT CART */}

            {cartItems?.map((element, index) => {
              return (
                <div className={Styles.cartItemsListContainer} key={index}>
                  <div className={Styles.productName}>
                    <img
                      width={70}
                      height={60}
                      src={element?.products[0]?.product?.images[0]}
                      alt=""
                    />
                    <span>{element?.products[0]?.product.name}</span>
                  </div>

                  <div className={Styles.productQuantity}>
                    <span>{element?.products[0]?.quantity}</span>
                  </div>

                  <div
                    className={Styles.deleteIcon}
                    style={{ cursor: 'pointer' }}
                  >
                    <MdDelete onClick={() => handleRemoveItem(element?._id)} />
                  </div>

                  <div>
                    <span>${element?.products[0]?.product?.price?.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={Styles.cardContainer}>
            <div className={Styles.deliveryLocationInputFieldsHeading}>
              <h2>Card Details</h2>
            </div>

            <div className={Styles.cardElementContainer}>
              <CardElement
                className={Styles.stripeButton}
                options={{
                  style: {
                    base: {
                      fontSize: '19px',
                      fontFamily: 'Helvetica, sans-serif',
                      '::placeholder': {
                        color: '#343538',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className={Styles.confirmPaymentBtn}>
            <button onClick={handlePayment}>Confirm Payment</button>
          </div>
          <div>
            {paymentError && <p>{paymentError}</p>}
            {paymentSuccess && <p>{paymentSuccess}</p>}
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={Styles.modalContainer}
          >
            <div className={Styles.divContainer}>
              <h3>Congratulations</h3>
              <h5>
                You payment of {productsPrice}$ has been succesfully processed.
              </h5>
              <IoCheckmarkDoneCircleSharp />
            </div>
          </Modal>
        </div>
        <div className={Styles.orderCode}>
          <button>Continue</button>
          <div className={Styles.OrderCodeHeading}>
            <img
              src="https://www.instacart.com/image-server/24x24/www.instacart.com/assets/loyalty/signup/logo_v2_aci-8da4a9de8cbf1b594a2b1ba14d4d2fddd6151d8765e661b868f407c015e50eb2.png"
              alt=""
            />
            <h4 className="textHeading"> Save with Safeway for U®</h4>
          </div>
          <p>
            It’s easy and free to link or sign up for our loyalty program, and
            it only <br />
            takes a few seconds.
          </p>

          {/* <div className={Styles.buttonContainer}>
                        <div className={Styles.phoneButtonPart1}>
                            <span className='textHeading'>+1</span>
                        </div>
                        <div className={Styles.phoneButtonPart2}>
                            <span className='textHeading'>
                                +92340-11
                            </span>

                        </div>
                    </div> */}

          <button className={Styles.createAccountBtn}>Connect Account </button>
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default CheckoutPage;
