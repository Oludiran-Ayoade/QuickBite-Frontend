import { createSlice } from "@reduxjs/toolkit"

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number; 
  }

export interface ApiReduxState {
    isloading: boolean;
    allloaded: Product[];
    loadError: string | null;
  }
  
export const ApiRedux = createSlice({
    name: 'ApiCall',
    initialState: {
        isloading: false,
        allloaded: [],
        loadError: null
    },
    reducers: {
        OnCalling: (state) => {
            state.isloading = true
            state.allloaded = []
            state.loadError = null
        },
        CallingSuccessful : (state, action) => { 
            state.isloading = false
            state.allloaded = action.payload
            state.loadError = null
        },
        CallingError : (state, action) => {
            state.isloading = false
            state.allloaded = []
            state.loadError = action.payload
        },
    }
})

export const {OnCalling, CallingSuccessful, CallingError } = ApiRedux.actions
export default ApiRedux.reducer