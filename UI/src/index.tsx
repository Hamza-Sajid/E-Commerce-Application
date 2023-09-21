// Importing React packages
import React from 'react';
// Importing react router
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Importing styles (main _ index file)
import './index.css';
// Importing app which will be the entry point of our application
import App from './App';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51NkiTXDVBFckkCRa7ynNmXkG7kCjS79K7jGaQWpL4W1hOZSh7K7EGHMSlmV2nCQhbsYDbT43aN3lpqMQI07c3dRB0063pN82OF',
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <CartProvider>
          <App />
        </CartProvider>
      </Elements>
    </BrowserRouter>
  </React.StrictMode>,
);
