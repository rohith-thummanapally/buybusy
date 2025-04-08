import { useState,useEffect,useRef,useContext } from "react";
//import userContext from "../usercontext";
import { db } from "../firebase-init";
import { getDoc,addDoc,setDoc,updateDoc,doc,collection,query, and,where, getDocs } from "firebase/firestore";
import { redirect,useNavigate } from "react-router-dom";
import { loginthunk } from "../redux/authslice";
import { useDispatch } from "react-redux";

function Signin()
{
    //let {user,setUser}=useContext(userContext);
    let navigate=useNavigate();
    const dispatch=useDispatch();
    const Trylogin=async (e)=>
    {  
        e.preventDefault();
        dispatch(loginthunk({email:e.target[0].value,password:e.target[1].value,'nav':navigate}));
        /*let email=e.target[0].value;
        let password=e.target[1].value;
        let myquery=query(collection(db,'users'),where('email','==',email),where('password','==',password));
        let userdata=await getDocs(myquery);
        if(userdata.size==0)
        {
            alert('Invalid Credentials');
        }
        else
        {
            userdata.forEach((res)=>{
                setUser(res.id);
                console.log(res.id+'--');
                console.log(res.data());
                navigate('/');
            }); 
        }*/
    }

    return(
        <div style={styles.signinpage}>
            <div style={{width:'50%',marginLeft:'25%'
            }}>
            <div>
                <p style={{color:'#224957',fontSize:'2.7em',fontFamily:'Quicksand, sans-serif',fontWeight:'900'}}>Sign In</p>
            </div>
            <form style={styles.formstyle} onSubmit={(e)=>{Trylogin(e)}}>
                <input style={styles.inpbox} placeholder="Enter Email" required />
                <br/>
                <input style={styles.inpbox} type="password" placeholder="Enter Password" required />
                <br/>
                <button style={{width:'43%',height:'35px',backgroundColor:'#7064e5',fontSize:'1.2em',boxShadow:'0px 4px 4px rgba(0,0,0,.3)',color:'#ffffff',border:'none',borderRadius:'10px'}} >Sign In</button>
                <br/>
                <p style={{color:'#224948',fontSize:'18px',fontWeight:'600',fontFamily:'Quicksand'}} onClick={()=>{navigate('/signup')}}>or Signup Instead</p>
            </form>
            </div>
        </div>
    )
}
const styles={
    signinpage:{
        display:"flex",
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
        height:'90%',
        width:'100%'
    },
    formstyle:{width:'100%',display:'flex',flexDirection:'column',alignItems:'flex-start'},
    inpbox:{width:'50%',height:'30px',border:'1.5px solid #7064e5',borderRadius:'10px',fontSize:'1.2em',background:'#f4f6f8',padding:'10px',marginBottom:'20px'}

}
export default Signin;