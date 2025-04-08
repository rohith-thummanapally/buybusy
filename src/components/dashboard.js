import { useState,useEffect,useContext } from "react";
import userContext from "../usercontext.js";
import { db } from "../firebase-init.js";
import { getDocs,getDoc,doc,collection,query,where, setDoc, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Items from "./items.js";
function Dashboard()
{
    const {user,setUser}=useContext(userContext);
    const [products,setItems]=useState([]);
    const [pfilter,setprice]=useState(5000);
    const [searchtext,setText]=useState('');
    const [categeories,setCategeories]=useState({
        mensclothing:true,
        womensclothing:true,
        jewellery:true,
        electronics:true
    });

    let navigate=useNavigate();
    async function fetchdata()
    {
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
            //console.log(myitems);
            setItems(myitems);
    }
    useEffect(()=>{
        fetchdata();
    },[]);
    useEffect(()=>{
        fetchdata();
    },[pfilter,searchtext]);
    function handleCategeories(e)
    {
        //console.log(e.target.checked);
        //console.log(e.target.name);
        let tcategeories=categeories;
        tcategeories[e.target.name]=e.target.checked;
        //console.log(tcategeories);
        setCategeories(tcategeories);
        fetchdata();
    }   
    async function addtocart(prodId)
    {
        let userdoc=doc(db,'users',user);
        let proddoc=doc(db,'products',prodId);
        if(!user)
        {
            navigate('/signup');
        }
        else
        { 
            console.log(userdoc);
            let q=query(collection(db,'userCart'),where('user','==',userdoc));
            
            let havedoc=await getDocs(q);
            if(havedoc.size)
            {
                console.log('in if');
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
    function Sidebar()
    {
        return(
            <div style={{position:'fixed',left:'10px',top:'30vh',width:'17.5vw',height:'55vh',backgroundColor:'lightgray',borderRadius:'10px',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <p style={styles.h2style}>Filter</p>
                <p style={{marginBottom:'0px'}} >Price : {pfilter}</p>
                <input type='range' max={50000} value={pfilter} onChange={(e)=>{setprice((fprice)=>e.target.value);}} />
                <p style={{...styles.h2style}}>Category</p>
                <div style={{textAlign:'left',lineHeight:'2'}}>
                <label><input type='checkbox' name="mensclothing" checked={categeories['mensclothing']} onChange={(e)=>{handleCategeories(e)}}/>Men's Clothing</label><br />
                <label><input type="checkbox" name="womensclothing" checked={categeories['womensclothing']} onChange={(e)=>{handleCategeories(e)}} />Women's Clothing</label><br />
                <label><input type="checkbox" name="jewellery" checked={categeories['jewellery']} onChange={(e)=>{handleCategeories(e)}} />Jewellery </label><br />
                <label><input type="checkbox" name="electronics" checked={categeories['electronics']} onChange={(e)=>{handleCategeories(e)}} />Electronics</label><br />
                </div>
            </div>
        )
    }
    
    return(
        <div style={{display:'flex',flexDirection:'row'}}>
            <Sidebar />
            <div style={{marginLeft:'20vw',width:'80vw',display:'flex',flexDirection:'column',alignItems:'center',padding:'20px 40px'}}>
                <div>
                    <input type="text" placeholder="Search" style={{height:'40px',width:'240px',fontSize:'20px'}} onChange={(e)=>{setText(e.target.value)}}/>
                </div>
                <div class='Itemsdiv' style={{width:'inherit'}}>
                    <Items products={products} addtocart={addtocart} />
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
export default Dashboard;