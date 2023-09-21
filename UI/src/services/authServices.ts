// Importing axios to make http calls
import axios from 'axios';
//importing the api [static] url
import api from '../utils/apiUrl';

/**
 * REGISTER USER API HANDLER
 * @param values
 * @param phoneNumber
 * @returns : responce of api
 */
const handleRegisterUserApi = async (values: any, phoneNumber: any) => {
  const apiUrl = `${api}/auth/register`;
  const data = {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    phone_number: phoneNumber,
    password: values.password,
  };
  // Make the POST request using Axios
  const response = await axios.post(apiUrl, data).catch(err => {
    return err;
  });
  return response;
};

/**
 * LOGIN USER API HANDLER
 * @param inputData
 * @returns api responce
 */
const handleUserLoginApi = async (inputData: any) => {
  const apiUrl = `${api}/auth/login`;
  const data = {
    email: inputData.email,
    password: inputData.password,
  };
  // Make the POST request using Axios
  const response = await axios.post(apiUrl, data).catch(err => {
    return err;
  });
  return response;
};

/**
 *  FORGET PASSWORD PAGE API HANDLER
 * @param email
 * @returns api responce
 */
const forgetPassword = async (email: string) => {
  const data = {
    email: email,
  };

  const apiUrl = `${api}/auth/forget_pwd`;
  // Make the POST request using Axios
  const response = await axios.post(apiUrl, data).catch(err => {
    return err;
  });

  return response;
};

/**
 * Verify OTP [When user requst for the password forogt]
 * @param emailValue
 * @param otp
 * @returns
 */
const verifyOTPApi = async (emailValue: any, otp: any) => {
  const apiUrl = `${api}/auth/verify_otp`;
  const data = {
    email: emailValue,
    otp: otp,
  };
  // Make the POST request using Axios
  const response = await axios.post(apiUrl, data).catch(err => {
    return err;
  });
  return response;
};

/**
 * SAVE A NEW PASSWORD PAGE API HANDLER
 * @param emailValue
 * @param password
 * @returns : api responce
 */

const saveNewPasswordApi = async (emailValue: any, password: any) => {
  const apiUrl = `${api}/auth/new_pwd`;
  const data = {
    email: emailValue,
    password: password,
  };
  // Make the POST request using Axios
  const response = await axios.post(apiUrl, data).catch(err => {
    return err;
  });
  console.log(response);
  return response;
};

// -- Exporting the functions  --
export {
  handleRegisterUserApi,
  handleUserLoginApi,
  forgetPassword,
  verifyOTPApi,
  saveNewPasswordApi,
};
