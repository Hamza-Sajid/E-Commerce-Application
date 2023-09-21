import axios from 'axios';
import api from '../utils/apiUrl';

/**
 * Get registered user profile , verify jwt token
 * @returns
 */
const userProfile = async () => {
  const apiUrl = `${api}/user`;
  // Make the GET request using Axios
  const response = await axios.get(apiUrl).catch(err => {
    return err;
  });
  return response;
};

export { userProfile };
