import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { db } from "../firebase-init.js";
import { getDocs,getDoc,doc,collection,query,where, setDoc, addDoc } from "firebase/firestore";

export const getproductsthunk=createAsyncThunk('products/getproducts',
    async (args,thunkApi)=>{
        try{
        console.log('in get products thunk ');
            
            let {pfilter,searchtext,categeories}=thunkApi.getState().productsReducer
                    let myitems=[];
                    let tagsarr=[];
                    let allitems=[];
                    let titems2=new Map();
                    Object.keys(categeories).forEach((key)=>{
                        if(categeories[key])
                        {
                            tagsarr.push(key);
                        }
                    })
                    console.log(1);
                    const productsRef = collection(db, "products");
                    const queries = tagsarr.map((tag) =>
                        query(productsRef, where("Tags", "array-contains", tag), where("Price", "<", Number(pfilter)))
                      );
                    
                      // Execute all queries in parallel using Promise.all
                      const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
                    
                      // Merge results and remove duplicates using a Map
                      const results = new Map();
                      snapshots.forEach((snapshot) => {
                        snapshot.forEach((doc) => {
                            results.set(doc.id, {...doc.data(),'id':doc.id})
                        });
                      });
                      console.log(results);
                      // Convert map values to an array
                    const finalProducts = Array.from(results.values());
                    allitems=finalProducts.filter((item)=>{
                        if(item['Name'].match(new RegExp(searchtext,'i')))
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
        
                    });
                    console.log(2);
                    //console.log('all items is');
                    //console.log(allitems);
                    let tarr=[];
                    let tvar=0;
                    allitems.forEach((item)=>{
                        if(tvar%3==0)
                        {
                            if(tarr.length)
                            {
                                myitems.push(tarr);
                            }
                            tarr=[]
                            tarr.push(item);
                        }
                        else
                        {   
                            tarr.push(item)
                        }
                        tvar++;
                    });
                    myitems.push(tarr);
                    console.log('after s');
                    //console.log(myitems);
                    thunkApi.dispatch(productsactions.setProducts({products:myitems}));
                    //setItems(myitems);
                }
                catch(err)
                {
                    console.log(err);
                }
    }
)

let initialstate={products:[],usercart:[],myorders:[],pfilter:5000,searchtext:'',categeories:{
    mensclothing:true,
    womensclothing:true,
    jewellery:true,
    electronics:true
}};
let productSlice=createSlice({
    name:'products',
    initialState:initialstate,
    reducers:{
        'setCategeories':(state,action)=>{
            let tcategeories=state.categeories;
            tcategeories[action.payload.target.name]=action.payload.target.checked;
            state.categeories=tcategeories;
        },
        'setFilter':(state,action)=>{
            console.log('setfilter reducer');
            console.log(action.payload);
            state.pfilter=action.payload;
        },
        'setsearchtext':(state,action)=>{
            state.searchtext=action.payload;
        },
        'setProducts':(state,action)=>{
            state.products=action.payload.products;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase('dashboard/setCategeories',(state,action)=>{
            
        })
    }
})

export const productsReducer=productSlice.reducer;
export const productsactions=productSlice.actions;
export const productsstate=(store)=>store.productsReducer;