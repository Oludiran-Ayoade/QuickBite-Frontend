import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartState {
  cart: any;
  cartItems: CartItem[];
  cartCount: number;
  filteredCartItems: CartItem[]; // Store filtered items per user
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const initialState: CartState = {
  cart: [],
  cartItems: [],
  cartCount: 0,
  filteredCartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { _id, name, price, quantity } = action.payload;
      const existingItem = state.filteredCartItems.find(item => item._id === _id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.filteredCartItems.push({ _id, name, price, quantity });
      }

      state.cartCount = state.filteredCartItems.reduce((count, item) => count + item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItemIndex = state.filteredCartItems.findIndex(item => item._id === productId);

      if (existingItemIndex !== -1) {
        const existingItem = state.filteredCartItems[existingItemIndex];
        state.cartCount -= existingItem.quantity; // Reduce cart count by quantity of removed item
        state.filteredCartItems.splice(existingItemIndex, 1); // Remove item from cart
      }
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; newQuantity: number }>) => {
      const { productId, newQuantity } = action.payload;
      const existingItem = state.filteredCartItems.find(item => item._id === productId);

      if (existingItem) {
        const quantityDiff = newQuantity - existingItem.quantity;
        existingItem.quantity = newQuantity; // Update item quantity

        state.cartCount += quantityDiff; // Adjust cart count based on quantity change
      }
    },
    setFilteredCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.filteredCartItems = action.payload;
     },

    clearCart: (state) => {
      state.cartItems = []; // Clear cart items
      state.cartCount = 0; // Reset cart count
      state.filteredCartItems = []; // Clear filtered items
    },
  },
});

// Action creators for cart-related actions
export const { addToCart, removeFromCart, updateCartItemQuantity, setFilteredCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
