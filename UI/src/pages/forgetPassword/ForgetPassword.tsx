// Importing React and relevent libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Importing formik and yup for validation
import { object, string } from 'yup';
import { useFormik } from 'formik';

// Importing the css styles file
import Styles from './forget_password.module.css';
import 'react-toastify/dist/ReactToastify.css';

//Importing MUI Componens
import { Box, Button, TextField, Typography } from '@mui/material';

// Importing the img
import LockImg from '../../assets/lock.png';
// Toastify package imports (for notifications)

// Importing api handler
import { forgetPassword } from '../../services/authServices';

const ForgetPassword: React.FC = () => {
  // Error notification msg code
  const notifyError = () =>
    toast.error("Email doesn't exists", {
      position: toast.POSITION.TOP_RIGHT,
    });
  // React router navigate function to navigate progmatically
  const navigate = useNavigate();

  // function to make api call to save the submitted password
  const callSubmitPassword = async (values: any) => {
    const email = values.email;
    const frogetPwdApiResponce = await forgetPassword(email);
    console.dir(frogetPwdApiResponce);
    if (frogetPwdApiResponce.status == 200) {
      navigate('/verifyotp', { state: { email: email } });
    } else {
      notifyError();
    }
  };
  // - > User email address
  const user_data = {
    email: '',
  };

  // -> Form schema using yup
  const formSchema = object({
    email: string()
      .email('*Follow email @ format')
      .required('*Enter email address'),
  });
  const formik = useFormik({
    initialValues: user_data,
    validationSchema: formSchema,
    onSubmit: values => {
      callSubmitPassword(values);
    },
  });
  return (
    <div>
      <form className={Styles.loginForm} onSubmit={formik.handleSubmit}>
        <Box className={Styles.bgContainer}>
          <Box className={Styles.MainContainer}>
            <img className={Styles.img} src={LockImg} alt="locker-img" />
            <Typography
              variant="h4"
              textAlign={'center'}
              sx={{ fontWeight: 'bold', color: '#343538' }}
            >
              Trouble Logging In?
            </Typography>
            <Typography
              textAlign={'center'}
              variant="h6"
              sx={{ color: '#343538' }}
            >
              Enter your email to reset your password
            </Typography>
            <Box sx={{ width: '60%', margin: 'auto', marginTop: '1em' }}>
              {/* Input field */}
              <TextField
                placeholder="Email @"
                name="email"
                variant="outlined"
                label="Email"
                type="email"
                fullWidth
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {/* ERROR MSG */}
              {formik.errors.email && formik.touched.email ? (
                <span className={Styles.errorMsg}> {formik.errors.email}</span>
              ) : null}
              <Button
                variant="contained"
                type="submit"
                color="success"
                className={Styles.btn}
              >
                Get OTP
              </Button>
              {/* Toastify package to show notification */}
              <ToastContainer />
            </Box>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default ForgetPassword;
