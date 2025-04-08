import { useState,useEffect,useContext } from "react";
import userContext from "../usercontext";
import { db } from "../firebase-init";
import Items from "./items";
import { getDocs,collection,query,doc, getDoc,where, setDoc,addDoc } from "firebase/firestore";
function Cart()
{
    let {user,setUser}=useContext(userContext);
    let [cartid,setcartid]=useState('');
    let [cartitems,setcartitems]=useState([]);
    let [total,setTotal]=useState(Number(0));
    let userdoc=doc(db,'users',user);
    useEffect(
        ()=>{
            fetchdata();
        },
        []
    );
    useEffect(()=>{
        console.log('in my items');
        console.log(cartitems);
    },[cartitems])
    async function fetchdata()
    {
        let q=query(collection(db,'userCart'),where('user','==',userdoc));
        let cartdata=await getDocs(q);
        let fincartdata=[];
        let allitems=[];
        cartdata.forEach(element => {
            fincartdata=element.data()['product'];
            setcartid(element.id);
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
                            setcartitems(myitems);
                            setTotal(totprice);
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
                    setcartitems(myitems);
                    setTotal(totprice);
                    tarr=[]
                }
            }
        });
        
    }

    async function removefromcart(productid)
    {
        let cartdoc=await getDoc(doc(db,'userCart',cartid));
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
            fetchdata();
        }
    }
    async function addordecitem(productid,counter)
    {
        console.log('in add or dec item'+cartid);
        let cartdoc=await getDoc(doc(db,'userCart',cartid));
        if(cartdoc.exists())
        {
            let cartdata=cartdoc.data();
            let tproducts=cartdoc.data()['product'];
            tproducts.forEach((item)=>{
                console.log(item['productid']['id'],'--',productid);
                if(item['productid']['id']==productid)
                {
                    item['count']+=counter;
                    if(item['count']<=0)
                    {
                        removefromcart(productid);
                    }
                }
                return true;
            })
            console.log(tproducts);
            cartdata['product']=tproducts;
            await setDoc(doc(db,'userCart',cartid),cartdata);
            fetchdata();
        }
    }
    async function purchaseitems(user)
    {
        let cartdoc=await getDoc(doc(db,'userCart',cartid));
        if(cartdoc.exists())
        {
            let ordereditems=cartdoc.data()['product'];
            let totalcost=total;
            let orderedon=new Date();
            console.log(orderedon);  
            let orderdata=await addDoc(collection(db,'userorders'),{ordereditems,orderedon,totalcost,'user':userdoc}); 
            console.log(orderdata);
        }
    }
    function Sidebar()
    {
        return (
            <div style={{position:'fixed',left:'10px',top:'30vh',width:'17.5vw',height:'25vh',backgroundColor:'lightgray',borderRadius:'10px',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <p style={styles.h2style}>Price : {total}</p>
                <input type='button' value='Purchase' onClick={()=>{purchaseitems(user)}} style={{marginTop:'20px'}} />
            </div>
        );
    }
    return(
        <div style={{display:'flex',flexDirection:'row'}}>
            <Sidebar />
            <div style={{marginLeft:'20vw',width:'80vw',display:'flex',flexDirection:'column',alignItems:'center',padding:'20px 40px'}}>
                
                <div class='Itemsdiv' style={{width:'inherit'}}>
                    <Items products={cartitems} cart={true} removefromcart={removefromcart} addordecitem={addordecitem} />
                </div>
            </div>
        </div>
    )
}
const styles={
    h2style:{
        color:'#224957',
        fontSize:'1.25em',
        fontWeight: '700',
        marginBottom:'0px'
    }
}

export default Cart;