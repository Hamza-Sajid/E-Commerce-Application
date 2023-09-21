// Method to store neccesaary http responce messages

const enum ResponseMessages {
  LOGIN_SUCCESS = 'Login successfuly',
  REGISTER_SUCCESS = 'Register successfuly',
  INVALID_CREDENTIALS = 'Invalid credentials',
  EMAIL_IN_USE = 'Email already in use',
  USER_NOT_FOUND = 'User not found',
  UPDATED = 'Updated successfully',
  RESET_LINK_SET = 'Password reset link sent to your email',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  ALREADY_EXSISTS = 'Another resource already exists with the same attributes',
  UNAUTHORIZED = 'You are not authorized to access this data',
  INVALID_DATA = 'Invalid data to process this request',
  ENTER_NEW_DATA = "Request process successfully , enter new data",
  "ADD_TO_DB" = "Added to the database",
  "FOUND" = "Data found",
  "NOT_FOUND" = "No data found",
  "INVALID_ID" = "You input an invalid id",
  "ENTERID" = "Enter your id to continue",
  "DELETED" = "Value is deleted from the db",
  "QUERY" = "Query is required",
  "EXSISTS" = "Following data exists",
  "PASSWORD_SENT" = "Password reset request sent to your email",
  "INVALID_OTP" = "Enter valid otp with email",
  "PRODUCT_NO_EXISTS" = "No such product exists"
}

export default ResponseMessages;
// End of File (EOF)

