// Importing react and relevent libraries
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
// Importing css files
import Styles from './navbar_style.module.css';

// Importing the mui buttons
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Popover,
    SwipeableDrawer,
    Toolbar,
    Typography,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

// // Importing assets + logos
import { HiMenu } from 'react-icons/hi';
import { BiLogOut, BiSolidCart } from 'react-icons/bi';
import { FaLocationDot } from 'react-icons/fa6';
import Logo from '../../assets/bannerLogo.svg';
import SearchIcon from '@mui/icons-material/Search';
import { RxCross2 } from 'react-icons/rx';
import { IoCloseSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import {
    ArrowLeft,
    ArrowRightAltOutlined,
    CloseOutlined,
} from '@mui/icons-material';
import api from '../../utils/apiUrl';
import { string } from 'yup';
import { useCartContext } from '../../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NavBarComponent(props: any) {
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

    const navigate = useNavigate();
    const user = props.user;

    const { setTotalCartItem, totalCartItem } = useCartContext();

    // Code to handle the MUI drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ProductData[]>([]);

    // Method to handle the success msg
    const notify = () => {
        toast.success('Product Removed', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));

    // Function to remove the cookies from the DB
    function deleteAllCookies() {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [name] = cookie.trim().split('=');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        setTimeout(() => {
            navigate('/login');
        }, 1000);
    }

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };



    useEffect(() => {
        // Define the debounce function
        const debouncedFetch = debounce(fetchSearchResults, 300); // Adjust the delay as needed

        // Call the debounced function when searchQuery changes
        debouncedFetch();

        // Cleanup effect
        return () => {
            debouncedFetch.cancel(); // Cancel the debounce on unmount
        };
    }, [searchQuery]);
    // }, [searchQuery]);

    const handleInputChange = (event: { target: { value: any } }) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const fetchSearchResults = async () => {
        try {
            // Replace with your actual API endpoint and fetch logic
            const response = await fetch(
                `http://localhost:3000/product/search?name=${searchQuery}`,
            );
            const data = await response.json();
            setSearchResults(data.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    // Debounce function to delay API call
    const debounce = (func: any, delay: any) => {
        let timeoutId: string | number | NodeJS.Timeout | undefined;
        const debounced = (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args); // Use spread operator here
            }, delay);
        };
        debounced.cancel = () => clearTimeout(timeoutId);
        return debounced;
    };

    // GET CART ITEM PRODUCTS
    const userRef = useRef(null);

    const [cart, setCart] = useState<ProductData>();
    const getCartItems = async () => {
        // const id = await props.user._id;
        // Define the API endpoint URL
        const apiUrl = `${api}/cart/${props.user?._id}`;
        // Get the token from the cookie
        const token = Cookies.get('token');

        // Set up Axios headers with the token
        const headers = { Authorization: `${token}` };
        axios
            .get(apiUrl, { headers })
            .then(response => {
                setCart(response.data.cart);
                setTotalCartItem(response.data.cart.length);
            })
            .catch(error => {
                console.log(error);
            });
    };
    useEffect(() => {
        if (!props.user) {
            return; // Prop value is not available yet, exit the useEffect
        }

        getCartItems();
    }, [props.user, totalCartItem]);
    // }, [props.user])

    const handleRemoveItem = async (productId: any) => {
        try {
            const response = await axios.delete(
                `${api}/cart/${props.user._id}/remove/${productId}`,
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

    return (
        <div
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                background: 'white',
                borderBottom: '',
            }}
        >
            <ToastContainer />
            <AppBar
                className={Styles.shadowContainer}
                position="static"
                color="transparent"
                sx={{
                    boxShadow: 'none',
                    // padding: '0.5em',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                }}
            >
                <Toolbar
                    className={Styles.toolbar}
                    sx={{ paddingLeft: '0px', paddingRight: '0px' }}
                >
                    <Box
                        sx={{
                            width: '20%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1em',
                        }}
                    >
                        {/* Mobile UI Code */}
                        {/* ---------------------- */}
                        <HiMenu
                            onClick={toggleDrawer}
                            className={Styles.burgerMenu}
                            fontSize="1.8em"
                        />
                        {/* ---------------------- */}
                        <img
                            onClick={() => navigate('/')}
                            className={Styles.logo}
                            alt="logo"
                            src={Logo}
                            width={120}
                            style={{ cursor: 'pointer' }}
                        ></img>
                    </Box>

                    <Box className={Styles.searchArea}>
                        {user == undefined ? (
                            <Search className={Styles.searchContainer}>
                                <SearchIconWrapper sx={{ fontWeight: 'bold!important' }}>
                                    <SearchIcon
                                        sx={{ fontWeight: 'bold!important', fontSize: '1.8em' }}
                                    />
                                </SearchIconWrapper>

                                <StyledInputBase
                                    placeholder="Search products"
                                    inputProps={{ 'aria-label': 'Search product' }}
                                    className={Styles.searchInput}
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                />
                            </Search>
                        ) : (
                            <Search
                                sx={{ border: '0.5px solid lightgray', borderRadius: '2em' }}
                                className={Styles.searchContainer2}
                            >
                                <SearchIconWrapper sx={{ fontWeight: 'bold!important' }}>
                                    <SearchIcon
                                        sx={{ fontWeight: 'bold!important', fontSize: '1.8em' }}
                                    />
                                </SearchIconWrapper>

                                <StyledInputBase
                                    placeholder="Search products"
                                    inputProps={{ 'aria-label': 'Search product' }}
                                    className={Styles.searchInput2}
                                    value={searchQuery}
                                    sx={{ border: 'none' }}
                                    onChange={handleInputChange}
                                />
                            </Search>
                        )}
                        {/* Display search results div */}
                        {searchQuery && (
                            <div className={Styles.inputResult}>
                                <div className={Styles.inputItemContainer}>
                                    {searchResults?.length == 0 ? (
                                        <div className={Styles.inputItem}>
                                            <div className={Styles.inputItemText}>
                                                <h4>No such product exsist</h4>
                                            </div>
                                        </div>
                                    ) : (
                                        searchResults?.map((element: any, index: any) => {
                                            return (
                                                <Link
                                                    to={`/product/${element._id}`}
                                                    key={index}
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                >
                                                    <div className={Styles.inputItem}>
                                                        <div className={Styles.inputItemImg}>
                                                            <img src={element?.images[0]} alt="" />
                                                        </div>
                                                        <div className={Styles.inputItemText}>
                                                            <h4>{element?.name}</h4>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}{' '}
                    </Box>
                    {user == undefined ? (
                        <Box className={Styles.buttonsArea}>
                            <Link to={'/login'}>
                                <Button className={Styles.containBtn}>Log in</Button>
                            </Link>
                            <Link to={'/register'}>
                                <Button className={Styles.outlineBtn}>Sign up</Button>
                            </Link>
                        </Box>
                    ) : (
                        <Box className={Styles.buttonsArea}>
                            <div className={Styles.loginMenu}>
                                <FaLocationDot />
                                <Typography variant="h6">94001</Typography>
                            </div>
                            <div>
                                {totalCartItem <= 0 ? (
                                    <Button onClick={openDrawer} className={Styles.outlineBtn2}>
                                        <BiSolidCart
                                            style={{ color: 'rgb(52, 53, 56)', fontSize: '1.3em' }}
                                        />
                                        <Typography variant="h6">{totalCartItem}</Typography>
                                    </Button>
                                ) : (
                                    <Button onClick={openDrawer} className={Styles.outlineBtn3}>
                                        <BiSolidCart
                                            style={{ color: 'white', fontSize: '1.15em' }}
                                        />
                                        <Typography
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                fontFamily: 'helvetica',
                                                marginLeft: '5px',
                                            }}
                                            variant="h6"
                                        >
                                            {totalCartItem}
                                        </Typography>
                                    </Button>
                                )}

                                <Drawer
                                    anchor="right"
                                    open={isDrawerOpen}
                                    onClose={closeDrawer}
                                >
                                    <div className={Styles.customdrawer}>
                                        {/* --- HEADING PART ---- */}
                                        <div className={Styles.customDrawerHeading}>
                                            <div className={Styles.customDrawerHeadingIcon}>
                                                <IoCloseSharp onClick={closeDrawer} />
                                            </div>

                                            <div className={Styles.customDrawerHeadingText}>
                                                <h4>Personal Shoping Cart</h4>
                                                <h5>Shoping in 94105</h5>
                                            </div>
                                        </div>

                                        {/* ~~~~ HEADING PART [END] ~~~~ */}

                                        {/* --- SALE PART ---- */}

                                        <div className={Styles.customDrawerSale}>
                                            <h4>Your first delivery is free!</h4>
                                        </div>
                                        {/* ~~~~ SALE PART [END] ~~~~ */}

                                        {/* --- CART ITEM LIST PART ---- */}
                                        <div className={Styles.customDrawerCart}>
                                            {cart !== undefined ? (
                                                cart.map((cartItem: any, index: any) => (
                                                    <div
                                                        className={Styles.customDrawerCartItem}
                                                        key={index}
                                                    >
                                                        <div>
                                                            <img
                                                                width={50}
                                                                height={50}
                                                                src={cartItem?.products[0]?.product?.images[0]}
                                                                alt={cartItem?.products[0]?.product?.name}
                                                            />
                                                        </div>
                                                        <div className={Styles.customDrawerCartItemDetails}>
                                                            <div
                                                                className={
                                                                    Styles.customDrawerCartItemDetailsText
                                                                }
                                                            >
                                                                <h5>{cartItem?.products[0]?.product.name}</h5>
                                                            </div>
                                                            <div
                                                                className={
                                                                    Styles.customDrawerCartItemDetailsQuantity
                                                                }
                                                            >
                                                                <span>18ct</span>
                                                            </div>
                                                            <div
                                                                className={
                                                                    Styles.customDrawerCartItemDetailsButton
                                                                }
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveItem(cartItem?._id)
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={
                                                                Styles.customDrawerCartItemDetailsPrice
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    Styles.customDrawerCartItemDetailsPriceTotall
                                                                }
                                                            >
                                                                <h5>{cartItem?.products[0]?.quantity}CT</h5>
                                                            </div>

                                                            <div
                                                                className={
                                                                    Styles.customDrawerCartItemDetailsPriceTotallNumber
                                                                }
                                                            >
                                                                <h5>
                                                                    $
                                                                    {cartItem?.products[0]?.product?.price?.value}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={Styles.customDrawerCartItem}>
                                                    <div className={Styles.customDrawerCartItemDetails}>
                                                        <div
                                                            className={Styles.customDrawerCartItemDetailsText}
                                                        >
                                                            <h5>Cart is empty</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ~~~~ CART ITEM LIST PART [END] ~~~~ */}

                                        {/* --- CART CHECKOUT PART ---- */}
                                        <hr
                                            style={{
                                                background: '#E8E9EB',
                                                border: 'none',
                                                height: '1px',
                                            }}
                                        />

                                        <div className={Styles.addToCartContainer}>
                                            <button
                                                onClick={() =>
                                                    navigate('checkout', {
                                                        state: { userId: props.user._id },
                                                    })
                                                }
                                                className={Styles.addToCartButton}
                                            >
                                                Go to checkout
                                            </button>
                                        </div>

                                        {/* --- CART CHECKOUT ENDING PART ---- */}
                                    </div>
                                </Drawer>
                            </div>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {/* ---- Code of Left Side Drawer ----- */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <div style={{ width: 400 }} className={Styles.mobileNavBar}>
                    <CloseOutlined
                        className={Styles.mobileNavBarIcon}
                        onClick={toggleDrawer}
                    />
                    <img className={Styles.logo} alt="logo" src={Logo} width={150}></img>
                    <ol>
                        <li className={Styles.mobileNavBarMenus}>Departments</li>
                        <li>More ways to shop</li>
                        <li>Help</li>
                    </ol>

                    <button className={Styles.logoutButton} onClick={deleteAllCookies}>
                        <BiLogOut />
                        Logout
                    </button>
                </div>
            </Drawer>
        </div>
    );
}

export default NavBarComponent;
