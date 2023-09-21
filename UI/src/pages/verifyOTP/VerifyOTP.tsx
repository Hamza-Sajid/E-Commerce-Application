// Importing the React and relevent libraries
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Importing styles modules
import Styles from './verifyotp.module.css';
import 'react-toastify/dist/ReactToastify.css';

// Importing MUI
import { Box, Typography, TextField, Button } from '@mui/material';

// Importing icons + img files
import { AlternateEmail } from '@mui/icons-material';
import OtpImg from '../../assets/verifyOTP.png';

// Importing the api call controller
import { verifyOTPApi } from '../../services/authServices';

const VerifyOTP: React.FC = () => {
  // Storing the otp code
  const [otp, setOtp] = useState('');
  // To progmatically controll the navigation
  const navigate = useNavigate();
  // Getting the state value which we are passing from the main file
  const location = useLocation();
  const emailValue = location.state?.email || 'Default Value';
  console.log(emailValue);

  // To show the error if email doesn't found
  const notifyError = () =>
    toast.error('Invalid OTP', {
      position: toast.POSITION.TOP_RIGHT,
    });

  // To show the error if user doesn't input any otp value
  const notifyOTPError = () =>
    toast.error('Enter OTP to continue', {
      position: toast.POSITION.TOP_RIGHT,
    });

  /**
   * To handle the api submission
   */
  const handleOtpSubmission = async () => {
    if (otp == '') {
      return notifyOTPError();
    }
    const verifyOTPResponce = await verifyOTPApi(emailValue, otp);
    if (verifyOTPResponce.status == 200) {
      navigate('/newpwd', { state: { email: emailValue } });
    } else {
      notifyError();
    }
  };
  return (
    <Box className={Styles.bgContainer}>
      <Box className={Styles.mainContainer}>
        <img className={Styles.img} src={OtpImg}></img>
        <Typography
          variant="h4"
          textAlign={'center'}
          sx={{ fontWeight: 'bold', color: '#343538' }}
        >
          Verification
        </Typography>
        <Typography textAlign={'center'} variant="h6" sx={{ color: '#343538' }}>
          Enter OTP which was sent to your provided e-email
        </Typography>

        <Box className={Styles.input}>
          <TextField
            value={otp}
            onChange={event => {
              setOtp(event.target.value);
            }}
            placeholder="OTP CODE"
            variant="outlined"
            label="OTP"
            fullWidth
          >
            Enter your email address
          </TextField>
          <Button
            onClick={handleOtpSubmission}
            variant="contained"
            type="submit"
            color="success"
            className={Styles.btn}
          >
            Verify
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default VerifyOTP;
