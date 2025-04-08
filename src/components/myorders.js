import { useContext,useEffect, useState } from "react";
import { db } from "../firebase-init";
import userContext from "../usercontext";
//import { query ,collection,getDoc,getDocs,doc,where,} from 'firebase/firestore';
import { getDocs,collection,query,doc, getDoc,where, setDoc,addDoc } from "firebase/firestore";
function Myorders()
{
    let {user,setUser}=useContext(userContext);
    let userdoc=doc(db,'users',user);
    //let userdoc = user?.uid ? doc(db, 'users', user.uid) : null;
    let [orders,setorders]=useState([]);
    useEffect(()=>{
        //if(user.uid)
        {
            fetchdata();
        }
    },[]);
    async function fetchdata()
    {
        setorders([]);
        console.log('in fetch data');
        
        let q=query(collection(db,'userorders'),where('user','==',userdoc));
        let ordersdata=await getDocs(q);
        
        ordersdata.forEach(async indvorder=>{
            console.log('in orders data foreach');
            let tdata= indvorder.data();
            console.log(tdata);
            let tproducts=tdata['ordereditems'];
            console.log('----');
            console.log(tproducts);
            let ordprods=[];
            let orddetails={};
            /*tproducts.forEach(async product=>{
                let pdoc=await getDoc(doc(db,'products',product['productid']['id']));
                let pdetails=pdoc.data();
                let count=product['count'];
                ordprods.push({'pname':pdetails['Name'],'price':pdetails['Price'],'quantity':count});
            })*/
                for (let product of tproducts) {
                    let pdoc = await getDoc(doc(db, 'products', product['productid']['id']));
                    let pdetails = pdoc.data();
                    let count = product['count'];
                    ordprods.push({ 'pname': pdetails['Name'], 'price': pdetails['Price'], 'quantity': count });
                }
            orddetails['orderedon']=tdata['orderedon'];
            orddetails['totalcost']=tdata['totalcost'];
            orddetails['orderitems']=ordprods;
            //orders.push(orddetails);
            ///console.log(orders);
            //setorders(orders);
            setorders(prevOrders => [...prevOrders, orddetails]);

        })
    }
    function formatTimestamp(timestamp) {
        if (!timestamp || !timestamp.seconds) return "Invalid date";
        
        let date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleString(); // Format it properly
    }
    function Orders(props)
    {
        console.log('in orders component');
        console.log(props['prods']);
        console.log(props['prods'].length);

        return (
            <div style={{width:'100%',marginTop:'50px'}}>
                <div>
                    <p style={{fontSize:'20px',color:'#224957',fontWeight:'700'}}>
                        Ordered On:-{formatTimestamp(props['orderedon'])} 
                    </p>
                </div>
                <table style={{width:'80%',marginLeft:'10%',lineHeight:'40px'}}>
                    <tr>
                        <th style={{width:'30%',backgroundColor:'#f1f0f0',borderBottom:'1.5px solid black'}}>
                            Title
                        </th>
                        <th style={{width:'20%',backgroundColor:'#f1f0f0',borderBottom:'1.5px solid black'}}>
                            Price
                        </th>
                        <th style={{width:'20%',backgroundColor:'#f1f0f0',borderBottom:'1.5px solid black'}}>
                            Quantity
                        </th>
                        <th style={{width:'20%',backgroundColor:'#f1f0f0',borderBottom:'1.5px solid black'}}>
                            Total Price
                        </th>
                    </tr>
                    {
                        props['prods'].map((item,index)=>(
                            <tr>
                                <td style={{width:'30%',backgroundColor:'#f1f0f0',padding:'0px 10px',fontSize:'14px'}}>
                                    {item['pname']}
                                </td>
                                <td style={{width:'20%',backgroundColor:'#f1f0f0'}}>
                                ₹ {item['price']}
                                </td>
                                <td style={{width:'20%',backgroundColor:'#f1f0f0'}}>
                                    {item['quantity']}
                                </td>
                                <td style={{width:'20%',backgroundColor:'#f1f0f0'}}>
                                ₹ {item['price']*item['quantity']}
                                </td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td colspan={4} style={{backgroundColor:'#f1f0f0',textAlign:'right',paddingRight:'20px'}}>
                        ₹ {props['price']}
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
    return (
        <>
        {!user && 
        <div>
            Please login to view your orders    
        </div>}
        {user &&
            <div style={{textAlign:'center'}}>
                <h1>Your Orders</h1>
                {
                 orders.map((orderdetails,index)=>(
                        <div key={index}>
                        <Orders price={orderdetails['totalcost']} orderedon={orderdetails['orderedon']} prods={orderdetails['orderitems']}/>
                        </div>
                 ))
                }
            </div>
        }
        </>
    )
}

export default Myorders;