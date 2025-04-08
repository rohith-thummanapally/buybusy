import { configureStore } from "@reduxjs/toolkit";
import { authreducers } from "./redux/authslice";
import { productsReducer } from "./redux/productsslice";
import { cartreducer } from "./redux/cartslice";
export const store=configureStore({
    reducer:{
        authreducers,
        productsReducer,
        cartreducer
    }
})