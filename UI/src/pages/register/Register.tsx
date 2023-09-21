// React imports and relevent libraries
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

//Import CSS
import Styles from './Register.module.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';

// MUI imports
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Modal,
} from '@mui/material';

// Importing assets
import emailSent from '../../assets/emailSent.png';
import Logo from '../../assets/logo.svg';

// Importing formik and yup for validation
import { object, string } from 'yup';
import { useFormik } from 'formik';

// Importing api handler
import { handleRegisterUserApi } from '../../services/authServices';

const Register: React.FC = () => {
  // To store the phone number of user
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [openModal, setModalOpen] = useState(false);
  // To close the modal
  const handleClose = () => setModalOpen(false);

  // To navigate progmatically
  const navigate = useNavigate();

  // Set phone no-# method
  const handlePhoneChange = (value: any) => {
    setPhoneNumber(value);
  };

  // Handling the error notify
  const notifyErrorAlreadyExists = () => {
    toast.error('User already exists, try diffrent credentials', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  // If phone number doesn't exists
  const notifyErrorPhoneNumber = () => {
    toast.error('Phone number is required', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Handling the server message
  const notifyServerError = () => {
    toast.error('Something went wrong, try again', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Handling the general message
  const notifyGeneralError = () => {
    toast.error('Input valid data to continue', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  /**
   * Making post api request to register the user
   * @param values : any
   */
  const handleSubmit = async (values: any) => {
    const phoneNumberValidation = isValidPhoneNumber(phoneNumber) === true;
    if (phoneNumberValidation == true) {
      setIsPhoneNumberValid(true);
      const requestResponse = await handleRegisterUserApi(values, phoneNumber);
      if (requestResponse.status == 200) {
        setModalOpen(true);
      } else if (requestResponse.response.status == 403) {
        notifyErrorAlreadyExists();
      } else if (requestResponse.response.status == 500) {
        notifyServerError();
      } else if (
        requestResponse.response.data.errors[0].msg ==
        'Phone number is required'
      ) {
        notifyErrorPhoneNumber();
      } else {
        notifyGeneralError();
      }
    } else {
      setIsPhoneNumberValid(false);
    }
  };

  // User schema defination
  const userSchema = object({
    first_name: string()
      .min(3, '*minimum 3 chatacters')
      .max(10, '*Keep it short')
      .required('*First Name is required'),
    last_name: string()
      .min(3, '*minimum 3 chatacters')
      .max(10, '*Keep it short')
      .required('*Last Name is required'),
    email: string()
      .email('*Follow abc@domain.com format')
      .required('*Email is required'),
    password: string()
      .min(5, '*input at-least 5 characters with digits')
      .max(12, '*password is too long')
      .matches(/^(?=.*[0-9])/, '*at least 1 digit is required')
      .required('*Password is required'),
  });

  // Input form values
  const inputValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  };

  // Defining formik schema with method
  const formik = useFormik({
    initialValues: inputValues,
    validationSchema: userSchema,
    onSubmit: values => {
      handleSubmit(values);
    },
  });

  // Style object for an mui component
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    p: 4,
  };

  return (
    <Box className={Styles.bgContainer}>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ color: '#343538' }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign={'center'}
          >
            <b>Verification email has been sent</b>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <img
              src={emailSent}
              alt=""
              width={150}
              style={{ display: 'block', margin: 'auto' }}
            />
            Kindly check your email we have sent an email to verify your
            account.
          </Typography>
          <Button
            onClick={() => {
              setTimeout(() => {
                setModalOpen(!openModal);
                navigate('/login');
              }, 800);
            }}
            className={Styles.btn}
          >
            Okay
          </Button>
        </Box>
      </Modal>
      <Container maxWidth="xs" className={Styles.mainContainer}>
        <img className={Styles.logoImg} src={Logo} alt="logo" />

        <Typography variant="h5" className="textHeading" textAlign={'center'}>
          Register Now
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            label="First Name"
            fullWidth
            required
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="true"
            InputLabelProps={{ shrink: true }}
          />
          {/* ERROR MSG */}
          {formik.errors.first_name && formik.touched.first_name ? (
            <span className={Styles.errorMsg}>{formik.errors.first_name}</span>
          ) : null}
          <TextField
            variant="outlined"
            margin="normal"
            label="Last Name"
            fullWidth
            required
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="true"
            InputLabelProps={{ shrink: true }}
          />
          {/* ERROR MSG */}
          {formik.errors.last_name && formik.touched.last_name ? (
            <span className={Styles.errorMsg}>{formik.errors.last_name}</span>
          ) : null}
          <TextField
            variant="outlined"
            margin="normal"
            label="Email"
            fullWidth
            required
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="true"
            InputLabelProps={{ shrink: true }}
          />
          {/* ERROR MSG */}
          {formik.errors.email && formik.touched.email ? (
            <span className={Styles.errorMsg}>{formik.errors.email}</span>
          ) : null}
          <PhoneInput
            placeholder="Phone Number *"
            id="phoneNumber"
            name="phoneNumber"
            country="PK"
            value={phoneNumber}
            onChange={handlePhoneChange}
            autoComplete="true"
            defaultCountry="PK"
            className={Styles.PhoneInputInput}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '12px',
              fontSize: '16px',
            }}
          />
          {isPhoneNumberValid == false ? (
            <span
              style={{ position: 'relative', top: '5px' }}
              className={Styles.errorMsg}
            >
              *Invalid phone number
            </span>
          ) : undefined}

          <TextField
            variant="outlined"
            margin="normal"
            label="Password"
            type="password"
            fullWidth
            required
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="true"
            InputLabelProps={{ shrink: true }}
          />
          {/* ERROR MSG */}
          {formik.errors.password && formik.touched.password ? (
            <span className={Styles.errorMsg}>{formik.errors.password}</span>
          ) : null}
          <Button
            className={Styles.btn}
            sx={{ marginTop: '2em' }}
            type="submit"
            fullWidth
            variant="contained"
            color="success"
          >
            Sign Up
          </Button>

          <Typography variant="caption" className={Styles.paraText}>
            If you are already member click here to
          </Typography>
          <Typography
            variant="caption"
            className={Styles.paraText}
            sx={{ marginLeft: '0.5em', fontWeight: 'bold' }}
          >
            <Link
              style={{ textDecoration: 'none', color: '#0AAD0A' }}
              to={'/login'}
            >
              Login
            </Link>
          </Typography>
          <ToastContainer />
        </form>
      </Container>
    </Box>
  );
};

export default Register;
