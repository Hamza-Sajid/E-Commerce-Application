// Importing the react and relevent libraries
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Importing styles modules
import Styles from './new_password.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, TextField, Button } from '@mui/material';

// Importing the static image
import PasswordImg from '../../assets/newPassword.png';

// Importing the Api handler
import { saveNewPasswordApi } from '../../services/authServices';

// Importing formik and yup for validation
import { object, string } from 'yup';
import { useFormik } from 'formik';

const NewPassword: React.FC = () => {
  // To progmatically navigate the user
  const navigate = useNavigate();

  // Receving the emailValue which we are passing from parent component
  const location = useLocation();
  const emailValue = location.state?.email || 'Default Value';

  // Handling the notifyError notification msg
  const notifyError = () =>
    toast.error('Enter a valid password mimum length 5 , atleast 1 digit', {
      position: toast.POSITION.TOP_RIGHT,
    });

  // Handling the notify_sucess msg
  const notifySuccess = () =>
    toast.success('Password Updated!', {
      position: toast.POSITION.TOP_RIGHT,
    });

  // - > User email address
  const user_data = {
    password: '',
  };

  // -> Form schema using yup
  const formSchema = object({
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
      handleNewPwd(values);
    },
  });

  /**
   * Making post api request to update the user password with the provided one or not
   */
  const handleNewPwd = async (values: any) => {
    //Receving the api response
    const apiResponce = await saveNewPasswordApi(emailValue, values.password);
    if (apiResponce.status == 200) {
      notifySuccess();
      // we will redirect the user to '/' path on after 800 seconds
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } else {
      // Show error toast
      notifyError();
    }
  };

  return (
    <Box className={Styles.bgContainer}>
      <Box className={Styles.mainContainer}>
        <form onSubmit={formik.handleSubmit}>
          <img className={Styles.img} src={PasswordImg}></img>
          <Typography
            variant="h4"
            textAlign={'center'}
            sx={{ fontWeight: 'bold', color: '#343538' }}
          >
            Enter New Password
          </Typography>
          <Box className={Styles.input}>
            <TextField
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              variant="outlined"
              label="New Password"
              fullWidth
            />
            {/* ERROR MSG */}
            {formik.errors.password && formik.touched.password ? (
              <span className={Styles.errorMsg}> {formik.errors.password}</span>
            ) : null}
            <Button
              variant="contained"
              type="submit"
              color="success"
              className={Styles.btn}
            >
              Update
            </Button>
            <ToastContainer />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default NewPassword;
