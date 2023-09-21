// React imports and relevent libraries
import React from 'react';
import { Link, Link as Redirect, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

// Importing formik and yup for validation
import { object, string } from 'yup';
import { useFormik } from 'formik';

// Importing the styles modules
import Styles from './login_style.module.css';
import 'react-toastify/dist/ReactToastify.css';

// MUI Imports
import { TextField, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';

// Login image import
import LoginPageImg from '../../assets/login.svg';

// Importing api handler
import { handleUserLoginApi } from '../../services/authServices';

const Login: React.FC = () => {
  // React router navigate function to navigate progmatically
  const navigate = useNavigate();

  // Method to handle the success msg
  const notify = () => {
    toast.success('User Login', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  // Method to show error msg
  const notifyError = () => {
    toast.error('Invalid credentials', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  // Method to show error msg
  const notifyNotVerifiedLogin = () => {
    toast.error('Check your email to verify your account', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  /**
   * Method to make an Login Api call
   * @param values
   */
  const handleLogin = async (values: any) => {
    const loginApiResponce = await handleUserLoginApi(values);
    console.log(loginApiResponce);

    if (loginApiResponce.status == 200) {
      notify();
      Cookies.set('token', loginApiResponce.data.data.token, {
        expires: 3600000,
      });
      navigate('/');
    } else if (loginApiResponce.response.status == 404) {
      notifyError();
    } else if (loginApiResponce.response.status == 401) {
      notifyNotVerifiedLogin();
    }
  };
  // - > intial user data
  const user_data = {
    email: '',
    password: '',
  };

  // -> Form schema using yup
  const formSchema = object({
    email: string()
      .email('*Follow email @ format')
      .required('*Enter email address'),
    password: string()
      .min(5, '*input at-least 5 characters with digits')
      .max(12, '*password is too long')
      .matches(/^(?=.*[0-9])/, '*at least 1 digit is required')
      .required('*Password is required'),
  });
  const formik = useFormik({
    initialValues: user_data,
    validationSchema: formSchema,
    onSubmit: values => {
      handleLogin(values);
    },
  });
  return (
    <div>
      <div className={Styles.MainContainer}>
        <form className={Styles.loginForm} onSubmit={formik.handleSubmit}>
          <Box className={Styles.inputForm}>
            <Typography variant="h5">
              Welcome to <br />
              Insta Shop
            </Typography>
            <Typography variant="h6">Ship Smarter...</Typography>
            <TextField
              id="outlined-basic"
              label={'Email'}
              InputLabelProps={{ shrink: true }}
              type="email"
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="false"
            />
            {/* ERROR MSG */}
            {formik.errors.email && formik.touched.email ? (
              <span className={Styles.errorMsg}> {formik.errors.email}</span>
            ) : null}
            <TextField
              InputLabelProps={{ shrink: true }}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="false"
              id="outlined-basic"
              label="Password"
              type="password"
              variant="outlined"
            />
            {formik.errors.password && formik.touched.password ? (
              <span className={Styles.errorMsg}>{formik.errors.password}</span>
            ) : null}

            <Link to={'/forgetpwd'}>
              <Typography
                className={Styles.forgetPassword}
                variant="button"
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                <b>Forget</b>
                <b style={{ position: 'relative', top: '-0.1em' }}>🔒</b>
                <b>?</b>
              </Typography>
            </Link>

            <Button type="submit" variant="contained" className={Styles.btn}>
              Log in
            </Button>
            <ToastContainer />
            <div className={Styles.paraTexts}>
              <Box>
                <Typography variant="caption">If you are new</Typography>
                <Link style={{ textDecoration: 'none' }} to="/register">
                  <Typography variant="caption" className={Styles.link}>
                    {' '}
                    Cick Here{' '}
                  </Typography>
                </Link>
                <Typography variant="caption">to register</Typography>
              </Box>
            </div>
          </Box>
        </form>
        <Box className={`${Styles.imgContainer} ${Styles.desktopOnly}`}>
          <img className={Styles.img} src={LoginPageImg} />
        </Box>
      </div>
    </div>
  );
};

export default Login;
