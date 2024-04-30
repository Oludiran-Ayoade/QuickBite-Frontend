import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist';
import ApiReduxReducer, { ApiReduxState } from './ApiRedux';
import storage from 'redux-persist/lib/storage';
import cartReducer from './cartSlice';


export interface RootState {
  ApiRedux: ApiReduxState;
}
// Define your root reducer by combining all reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  ApiRedux: ApiReduxReducer,
  
});

// Configuring Redux persist
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['cart','ApiRedux'],
  // Add any other configurations if needed
};

// Wrap your root reducer with the persisted reducer using persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store
const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor object
const persistor = persistStore(reduxStore);

export { reduxStore as store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
