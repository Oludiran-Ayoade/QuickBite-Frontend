import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth.tsx'
import { store, persistor } from './redux/store.ts'
import { Provider } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PersistGate } from 'redux-persist/integration/react';

const stripePromise = loadStripe('pk_test_51P7CXPP9S0EKyjDcRhjFL9cezwDArrenWBKDnevyqfKD0modlx4Di5NMawI3oIszKLkCYIlPGZOMtwTYPYxZqlNY00819OVOsl');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
      </PersistGate>
      </Provider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
