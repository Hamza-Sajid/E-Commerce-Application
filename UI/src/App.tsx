// React imports and relevent libraries
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Styles imports
import './App.css';

// Pages imports
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ForgetPassword from './pages/forgetPassword/ForgetPassword';
import VerifyOTP from './pages/verifyOTP/VerifyOTP';
import NewPassword from './pages/newPassword/NewPassword';
import HomePage from './pages/homePage/HomePage';
import CategoryProduct from './pages/categoryProducts/CategoryProduct';
import ProductDeatils from './pages/productDetails/ProductDeatils';
import CheckoutPage from './pages/checkoutPage/CheckoutPage';
import ProtectedRoute from './services/protectedRoute';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgetpwd" element={<ForgetPassword />}></Route>
        <Route path="/verifyotp" element={<VerifyOTP />}></Route>
        <Route path="/newpwd" element={<NewPassword />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/category/:categoryName"
          element={<CategoryProduct />}
        ></Route>
        <Route path="/product/:productId" element={<ProductDeatils />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/product/:productId/checkout"
            element={<CheckoutPage />}
          ></Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
