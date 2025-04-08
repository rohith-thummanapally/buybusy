import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase-init.js";
import { getDocs,getDoc,doc,collection,query,where, setDoc, addDoc } from "firebase/firestore";
import { authstate,authreducers } from "./authslice.js";
import { useSelector,useDispatch } from "react-redux";
export const addtocartthunk=createAsyncThunk('addtocart',
    async (args,thunkApi)=>{
        console.log('in add to cart thunk');
        console.log(args);
        let user=args['user'];
        let prodId=args['prodid'];
        let navigate=args['nav'];
        if(!user)
        {
            navigate('/signin');
        }
        else
        {
            console.log('in else');
            let userdoc=doc(db,'users',user);
            let proddoc=doc(db,'products',prodId);
            let q=query(collection(db,'userCart'),where('user','==',userdoc));
            let havedoc=await getDocs(q);
            if(havedoc.size)
            {
                console.log('in some if');
                let products;
                let hasproductincart=false;
                havedoc.forEach((sdoc)=>{
                    let usercartid=sdoc.id;
                    let usercartdata=sdoc.data();
                    products=sdoc.data()['product'];
                    usercartdata['product'].forEach((proditem)=>{
                        if(proditem['productid']['id']==prodId)
                        {
                            hasproductincart=true;
                            //update count for that product
                            proditem['count']+=1;
                    
                        }
                    })
                    if(!hasproductincart)
                    {
                        //add product to cart
                        let newprod={'count':1,'productid':proddoc};
                        usercartdata['product'].push(newprod);
                        //setDoc(collection(db,'usercart'));
                    }
                    setDoc(doc(db,'userCart',usercartid),usercartdata);
                }) ; 
            }
            else
            {
                //add user to userCart
                console.log('add new user cart');
                let newdoc=await addDoc(collection(db,'userCart'),{'product':[{'count':1,'productid':proddoc}],'user':userdoc});
                
            }
        }
    }
)

export const getcartitemsthunk=createAsyncThunk('getCartItems',
    async (args,thunkAPI)=>{
        try
        {
            let {user}=thunkAPI.getState().authreducers;// useSelector(authstate);
            let userdoc=doc(db,'users',user);
        let q=query(collection(db,'userCart'),where('user','==',userdoc));
        let cartdata=await getDocs(q);
        let fincartdata=[];
        let allitems=[];
        cartdata.forEach(element => {
            fincartdata=element.data()['product'];
            //setcartid(element.id);
            thunkAPI.dispatch(cartactions.setcartid(element.id));
        });
        let tarr=[];
            let tvar=0;
            let myitems=[];
            let totprice=0;
            fincartdata.forEach(async(cartitem,index)=>{
            let count=cartitem['count'];
            let prodid=cartitem['productid']['id'];
            let tdata=await getDoc(doc(db,'products',prodid));
            if(tdata.exists())
            {
                let item={...tdata.data(),'counter':count,'id':prodid};
                totprice+=Number(item['Price']) * Number(count);
                if(tvar%3==0)
                    {
                        if(tarr.length)
                        {
                            myitems.push(tarr);
                            //setcartitems(myitems);
                            //thunkAPI.dispatch(cartactions.setcartitems({'cartitems':myitems}));
                            //setTotal(totprice);
                            //thunkAPI.dispatch(cartactions.settotal(totprice));
                        }
                        tarr=[]
                        tarr.push(item);
                    }
                    else
                    {   
                        tarr.push(item)
                    }
                    tvar++;
                if(index==fincartdata.length-1)
                {
                    myitems.push(tarr);
                    //setcartitems(myitems);
                    thunkAPI.dispatch(cartactions.setcartitems({'cartitems':myitems}));
                    //setTotal(totprice);
                    thunkAPI.dispatch(cartactions.settotal(totprice));
                    tarr=[]
                }
            }
        });

        }
        catch(err)
        {
            console.log(err);
        }
    }
)

export const removeitemsthunk=createAsyncThunk('removeitem',
    async (args,thunkAPI)=>{
        let {user}=thunkAPI.getState().authreducers;
        let {cartid}=thunkAPI.getState().cartreducer;
        let cartdoc=await getDoc(doc(db,'userCart',cartid));
        let productid=args['productid'];
        if(cartdoc.exists())
        {
            let cartdata=cartdoc.data();
            let tproducts=cartdoc.data()['product'];
            tproducts=tproducts.filter((item)=>{
                console.log(item['productid']['id'],'--',productid);
                if(item['productid']['id']==productid)
                {
                    return false;
                }
                return true;
            })
            console.log(tproducts);
            cartdata['product']=tproducts;
            await setDoc(doc(db,'userCart',cartid),cartdata);
            //fetchdata();
        }
    }
)

export const addordecthunk=createAsyncThunk('addordecitems',
    async (args,thunkAPI)=>{
        
        let productid=args['productid'];
        let counter=args['counter'];
        console.log('in add or dec item '+productid+'--'+counter);
        let {cartid}=thunkAPI.getState().cartreducer;
        let cartdoc=await getDoc(doc(db,'userCart',cartid));
        let removeitem=false;
        if(cartdoc.exists())
        {
            console.log('in if cartdoc');
            let cartdata=cartdoc.data();
            let tproducts=cartdoc.data()['product'];
            tproducts.forEach(async (item)=>{
                console.log(item['productid']['id'],'--',productid);
                if(item['productid']['id']==productid)
                {
                    item['count']+=counter;
                    if(item['count']<=0)
                    {
                        //removefromcart(productid);
                        removeitem=true;
                        //await thunkAPI.dispatch(removeitemsthunk({productid}));
                    }
                }
                return true;
            })
            console.log(tproducts);
            if(removeitem)
            {
                await thunkAPI.dispatch(removeitemsthunk({productid}));   
            }
            else
            {
                cartdata['product']=tproducts;
                await setDoc(doc(db,'userCart',cartid),cartdata);
                //fetchdata();
            }
        }
    }
)
let initialState={cartitems:[],total:0,cartid:''}
const cartSlice=createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{
        'setcartitems':(state,action)=>{
            state.cartitems=action.payload.cartitems;
        },
        'settotal':(state,action)=>{
            state.total=action.payload;
        },
        'setcartid':(state,action)=>{
            state.cartid=action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(addordecthunk.fulfilled,(state,action)=>{
            console.log('data updated successfully');
        })
    }
})
export const cartreducer=cartSlice.reducer;
export const cartactions=cartSlice.actions;
export const cartstate=(store)=>store.cartreducer;
