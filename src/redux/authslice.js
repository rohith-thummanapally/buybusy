import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase-init";
import { getDoc,addDoc,setDoc,updateDoc,doc,collection,query, and,where, getDocs } from "firebase/firestore";
import { redirect,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const loginthunk=createAsyncThunk('auth/login',
    async (args,thunkAPI)=>{
        try{
            let email=args['email'];
            let password=args['password'];
            let navigate=args['nav'];
            let myquery=query(collection(db,'users'),where('email','==',email),where('password','==',password));
            let userdata=await getDocs(myquery);
            if(userdata.size===0)
            {
                alert('Invalid Credentials');
            }
            else
            {
                userdata.forEach((res)=>{
                    thunkAPI.dispatch(authactions.setUser(res.id));
                    navigate('/');
                }); 
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
);
export const signupthunk=createAsyncThunk('auth/signup',
    async (args,thunkAPI)=>{
        try{
            console.log(args);
            let {name,email,password,nav}=args;
            let conn=collection(db,'users');
            let newdoc=await addDoc(conn,{name,email,password});
            if(newdoc.id)
            {
                thunkAPI.dispatch(authactions.setUser(newdoc.id));
                nav('/');
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
);
let INITIAL_STATE={user:''};
export const authslice=createSlice({
    name:'auth',
    initialState:INITIAL_STATE,
    reducers:{
        'setUser':(state,action)=>{
            state.user=action.payload;
        }       
    },
    extraReducers:(builder)=>{

    }
});


export const authreducers=authslice.reducer;
export const authactions=authslice.actions;
export const authstate=(store)=>store.authreducers;